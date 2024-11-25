from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
from app.forms import CreateTenantForm
from datetime import datetime

# from app.api.aws import get_unique_filename, upload_file_to_s3
# from app.forms import TweetForm
from app.models import Tenant, Lease, User, Property, db

tenant_routes = Blueprint("tenants", __name__, url_prefix="/api")

# get all tenants of a property
@tenant_routes.route("/properties/<int:propertyId>/tenants", methods=['POST'])
@login_required
def get_tenants(propertyId):
    
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
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
        return jsonify({"message": "Invalid form submission", "errors": form.errors}), 400

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
    return jsonify(new_tenants_dict), 201