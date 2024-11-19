from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import User, Property, Lease, Tenant, db

property_routes = Blueprint("portfolio", __name__, url_prefix="/api/properties")


# Get all properties
@property_routes.route("/", methods=['GET'])
@login_required
def get_all_properties():
    user = User.query.get(current_user.id)
    all_properties = Property.query.filter(Property.user_id == user.id).all()

    response = []
    for property in all_properties:
        property_dict = property.to_dict_basic()

        current_lease = Lease.query.filter(db.and_(property.id == Lease.property_id,
                                                    Lease.is_active == 1)).first()
                                                    
        if (current_lease != None):
            property_dict['rent'] = current_lease.rent
            property_dict['is_vacant'] = False
            property_dict['num_tenants'] = Tenant.query.filter(Tenant.lease_id == current_lease.id).count()
        else:
            property_dict['rent'] = 'N/A'
            property_dict['is_vacant'] = True
            property_dict['num_tenants'] = 0

        
        property_data = {
            "id": property_dict["id"],
            "address": property_dict["address"],
            "rent": property_dict["rent"],
            "num_tenants": property_dict["num_tenants"],
            "is_vacant": property_dict['is_vacant'],
            "created_at": property_dict['created_at'],
            "updated_at": property_dict["updated_at"] 
        }
        
        response.append(property_data)
    
    return jsonify({"properties":response}), 200


# Get Property details from an id
@property_routes.route("/<int:propertyId>", methods=['GET'])
@login_required
def get_a_property(propertyId):
    user = User.query.get(current_user.id)
    property = Property.query.get(propertyId)

    if (property == None):
          return jsonify({ "message": "Property couldn't be found"}), 404

    current_lease = Lease.query.filter(db.and_(property.id == Lease.property_id,
                                                    Lease.is_active == 1)).first()
    
    if (current_lease != None):
        property.is_vacant = False

    else:
        property.is_vacant = True

    property_data = {
        "id": property.id,
        "address": property.address,
        "bedrooms": property.bedrooms,
        "bathrooms": property.bathrooms,
        "sqft": property.square_feet,
        "property_type":property.property_type,
        "is_vacant": property.is_vacant
    }
    return jsonify(property_data), 200


# Edit A Property
@property_routes.route("/<int:propertyId>", methods=['PATCH'])
@login_required
def edit_property(propertyId):
    
