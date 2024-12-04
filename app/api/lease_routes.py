# app/api/lease.py

from flask import Blueprint, request, jsonify
from flask_login  import login_required, current_user
from datetime import datetime, timedelta
from app.models import Lease, Property, User, db
from app.forms import CreateLeaseForm
from app.api.aws import (get_unique_filename, upload_file_to_s3)

lease_routes = Blueprint('leases', __name__, url_prefix="/api")

# Get all active leases
@lease_routes.route('/properties/<int:propertyId>/leases/active', methods=['GET'])
@login_required
def get_active_lease(propertyId):
    user = User.query.get(current_user.id)
    # Check if the property exists
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
    # Check if the user is autherized to access this property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
        
    # Check if the lease exists
    active_lease = Lease.query.filter(db.and_(Lease.property_id == propertyId,
                                Lease.end_date >= datetime.now().date())).first()
    if not active_lease:
         return jsonify({"active_lease":None}), 200
    if not active_lease.is_active:
        active_lease.is_active = True
        db.session.commit()

    active_lease_dict = active_lease.to_dict_basic()  

    return jsonify({"active_lease":active_lease_dict}), 200


# Get all expired leases
@lease_routes.route('/properties/<int:propertyId>/leases/expired', methods=['GET'])
@login_required
def get_expired_leases(propertyId):
    user = User.query.get(current_user.id)
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
     # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    expired_leases = Lease.query.filter(db.and_(Lease.property_id == propertyId,
                                Lease.end_date < datetime.now().date())).all()    
    
    if not expired_leases:
        return jsonify({"expired_leases": []}), 200
  
    for lease in expired_leases:
        lease.is_active = False
    db.session.commit()

    expired_leases_dict = [lease.to_dict_basic() for lease in expired_leases]   

    return jsonify({"expired_leases": expired_leases_dict}), 200


# Create a lease
@lease_routes.route('/properties/<int:propertyId>/leases', methods=['POST'])
@login_required
def create_lease(propertyId):
    
    user = User.query.get(current_user.id)
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
   # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    
    # check if the lease exists
    current_active_lease = Lease.query.filter(db.and_(Lease.property_id == propertyId,
                                Lease.is_active == True)).first()
      
    if current_active_lease:
        return jsonify({"message": "An active lease already exist for this property"}), 404
       
    form = CreateLeaseForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
        
    if form.validate_on_submit():
       
       
        file = form.data["lease_doc"]
        print("File object:", file)
        print("File filename:", getattr(file, "filename", None))
        print("File content_type:", getattr(file, "content_type", None))
        url = None
        if file: 
            file.filename = get_unique_filename(file.filename)
            upload = upload_file_to_s3(file)

            if "url" not in upload:
                return jsonify(upload), 400

            url = upload["url"]
        
        new_lease = Lease(
            property_id= propertyId,
            start_date= form.start_date.data,
            end_date= form.end_date.data,
            rent= form.rent.data,
            rent_due_day = form.rent_due_day.data,
            deposit = form.deposit.data,
            deposit_due_date = form.deposit_due_date.data,
            lease_doc = url
        )

        db.session.add(new_lease)
        db.session.commit()

        new_lease_dict = new_lease.to_dict_basic()
        return jsonify(new_lease_dict), 201

    return form.errors, 400


# Update a lease
@lease_routes.route('/properties/<int:propertyId>/lease', methods=['PATCH'])
@login_required
def update_lease(propertyId):
    user = User.query.get(current_user.id)

    # check if the property exists
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
    # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    # check if the lease exists
    current_active_lease = Lease.query.filter(db.and_(Lease.property_id == propertyId,
                                Lease.end_date >= datetime.now().date())).first()
 
    
    form = CreateLeaseForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    if form.validate_on_submit():
        current_active_lease.start_date = form.start_date.data
        current_active_lease.end_date = form.end_date.data
        current_active_lease.rent = form.rent.data
        current_active_lease.rent_due_day = form.rent_due_day.data
        current_active_lease.deposit = form.deposit.data
        current_active_lease.deposit_due_date = form.deposit_due_date.data
        db.session.commit()

        current_active_leaselease_dict =current_active_lease.to_dict_basic()
        return jsonify(current_active_leaselease_dict), 200
    
    return form.errors, 400


# Terminate A Lease
@lease_routes.route('/properties/<int:propertyId>/lease/terminate', methods=['PATCH'])
@login_required
def terminate_lease(propertyId):
    user = User.query.get(current_user.id)

    # Check if the property exists
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
     # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    # Check if the lease exists
    current_active_lease = Lease.query.filter(db.and_(Lease.property_id == propertyId,
                                Lease.end_date >= datetime.now().date())).first()
 
    if not current_active_lease:
        return jsonify({"message": "No active lease found"}), 404
    
    try:
        current_active_lease.end_date = datetime.now().date() - timedelta(days=1)
        current_active_lease.is_active = False

        for tenant in current_active_lease.tenants:
            db.session.delete(tenant)

        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to terminate the lease"}), 500
    
    updated_lease_dict = current_active_lease.to_dict_basic()

    return jsonify(updated_lease_dict), 200
    

# Delete a lease
@lease_routes.route("/leases/<int:leaseId>", methods=['DELETE'])
@login_required
def delete_lease(leaseId):
    user = User.query.get(current_user.id)  
       
    lease = Lease.query.get(leaseId)
    if not lease:
        return jsonify(	{"message": "Lease couldn't be found"}), 404
    
    for tenant in lease.tenants:
        db.session.delete(tenant)

    property = lease.property
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
    # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    db.session.delete(lease)
    db.session.commit()

    return jsonify(	{"message": "Successfully deleted"}), 200



# Delete a Lease Contract
@lease_routes.route("/properties/<int:propertyId>/lease-contract", methods=['PATCH'])
@login_required
def delete_lease_contract(propertyId):
    user = User.query.get(current_user.id)  
       
    # Check if the lease exists
    lease = Lease.query.filter(db.and_(Lease.property_id == propertyId,
                                Lease.end_date >= datetime.now().date())).first()
    
    if not lease:
        return jsonify(	{"message": "Lease couldn't be found"}), 404
    
    property = lease.property
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
    # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    try:
            
        lease.lease_doc = None

        db.session.commit()

        updated_lease_dict = lease.to_dict_basic()
        return jsonify(updated_lease_dict), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to terminate the lease"}), 500
    
     
