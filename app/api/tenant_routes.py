from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
from app.forms import CreateTenantForm
from datetime import datetime
from sqlalchemy.exc import IntegrityError

# from app.api.aws import get_unique_filename, upload_file_to_s3
# from app.forms import TweetForm
from app.models import Tenant, Lease, User, Property, db

tenant_routes = Blueprint("tenants", __name__, url_prefix="/api")

# get all tenants of a property
@tenant_routes.route("/properties/<int:propertyId>/tenants", methods=['GET'])
@login_required
def get_tenants(propertyId):
    user = User.query.get(current_user.id)  

    # Check if the property exists  
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
     # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    # Check if there is an active lease for this property
    active_lease = Lease.query.filter(db.and_(Lease.property_id == propertyId,
                                Lease.end_date >= datetime.now().date())).first()
    if not active_lease:
         return jsonify({"message": "No active lease is found"}), 200
    
    current_tenants = active_lease.tenants

    current_tenants_dict = [tenant.to_dict_basic() for tenant in current_tenants]

    return jsonify({"tenants":current_tenants_dict}), 200


# Create a tenant for property
@tenant_routes.route("/properties/<int:propertyId>/tenants", methods=["POST"])
@login_required
def add_tenant(propertyId):
    try:
        user = User.query.get(current_user.id)
        # Check if property exists
        property = Property.query.get(propertyId)
            
        if not property:
            return jsonify({"message": "Property couldn't be found"}), 404
        
        # Check if the user is authorized to access the property
        if property.user_id != user.id:
            return jsonify({"message": "You are not authorized to access this property"}), 403
        
        # Check if there's an active lease
        active_lease = Lease.query.filter(
            db.and_(Lease.property_id == propertyId, Lease.end_date >= datetime.now().date())
        ).first()
        if not active_lease:
            return jsonify({"message": "No active lease is found for this property"}), 404

        form = CreateTenantForm()
        form['csrf_token'].data = request.cookies.get('csrf_token')

        # Validate form input
        if not form.validate_on_submit():
            return jsonify(form.errors), 400

        # Check if email is unique for the lease
        email = form.email.data
        is_unique = not Tenant.query.filter(
            Tenant.lease_id == active_lease.id, Tenant.email == email
        ).first()
        if not is_unique:
            return jsonify({"message": "A tenant with this email already exists for this lease."}), 400

        # Create the new tenant
        new_tenant = Tenant(
            lease_id=active_lease.id,
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            email=form.email.data,
            mobile=form.mobile.data,
        )
    

        db.session.add(new_tenant)
        db.session.commit()

        # Return updated list of tenants
        new_tenants_dict = [tenant.to_dict_basic() for tenant in active_lease.tenants]
        return jsonify({"tenants": new_tenants_dict}), 201
    
    except IntegrityError as e:
        db.session.rollback()  # Rollback the session to handle the exception cleanly

        # Check if the error is related to the unique constraint on tenant email for the lease
        if "UNIQUE constraint failed: tenants.email, tenants.lease_id" in str(e.orig):
            return jsonify({"message": "A tenant with this email address already exists for this active lease."}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An unexpected error occurred.", "error": str(e)}), 500
    return jsonify({"message": "Unhandled error occurred."}), 500

# Update a tenant for property
@tenant_routes.route("/properties/<int:propertyId>/tenants/<int:tenantId>", methods=["PATCH"])
@login_required
def update_tenant(propertyId, tenantId):
    try:
        user = User.query.get(current_user.id)
       
       # Check if the property exists
        property = Property.query.get(propertyId)
        if not property:
            return jsonify({"message": "Property couldn't be found"}), 404
                        
        # Check if the user is authorized to access this property
        if property.user_id != user.id:
            return jsonify({"message": "You are not authorized to access this property"}), 403
                        
        # Check if there's an active lease for this property
        active_lease = Lease.query.filter(
            db.and_(Lease.property_id == propertyId, Lease.end_date >= datetime.now().date())
        ).first()
        if not active_lease:
            return jsonify({"message": "No active lease is found for this property"}), 404
        

        # check if a tenant with specific tenantId exist in this lease
        tenants = active_lease.tenants
        tenant = [tenant for tenant in tenants if tenant.id == tenantId]
        if not tenant:
            return jsonify({"message": "The tenant coundn't be found in the current lease"}), 404
        tenant = tenant[0]

        form = CreateTenantForm()
        form['csrf_token'].data = request.cookies.get('csrf_token')
        if form.validate_on_submit():
                           
            tenant.first_name = form.first_name.data
            tenant.last_name = form.last_name.data
            tenant.email = form.email.data
            tenant.mobile = form.mobile.data
            
            db.session.commit()
            # Return updated list of tenants
            new_tenants_dict = [tenant.to_dict_basic() for tenant in active_lease.tenants]
            return jsonify({"tenants": new_tenants_dict}), 200


    except IntegrityError as e:
        db.session.rollback()  # Rollback the session to handle the exception cleanly

        # Check if the error is related to the unique constraint on address
        if "UNIQUE constraint failed: properties.address" in str(e.orig):
            return jsonify({"message": "The tenant's email already exists."}), 400

       
        return form.errors, 400


# Remove a tenant for property
@tenant_routes.route("/properties/<int:propertyId>/tenants/<int:tenantId>", methods=["DELETE"])
@login_required
def delete_tenant(propertyId, tenantId):
    user = User.query.get(current_user.id)
       
    # Check if the property exists
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
                    
    # Check if the user is authorized to access this property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
                    
    # Check if there's an active lease for this property
    active_lease = Lease.query.filter(
        db.and_(Lease.property_id == propertyId, Lease.end_date >= datetime.now().date())
    ).first()
    if not active_lease:
        return jsonify({"message": "No active lease is found for this property"}), 404
    

    # check if a tenant with specific tenantId exist in this lease
    tenants = active_lease.tenants
    tenant = [tenant for tenant in tenants if tenant.id == tenantId]
    if not tenant:
        return jsonify({"message": "The tenant coundn't be found in the current lease"}), 404
    tenant = tenant[0]

    db.session.delete(tenant)
    db.session.commit()

    return jsonify(	{"message": "Successfully deleted"}), 200
