from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import User, Property, Lease, Tenant, db
from app.forms import CreatePropertyForm
from sqlalchemy.exc import IntegrityError

property_routes = Blueprint("properties", __name__, url_prefix="/api/properties")


# get all properties wihtout pagination
@property_routes.route("/all", methods=['GET'])
@login_required
def get_all_properties_no_page():
    user = User.query.get(current_user.id)
   
    properties = Property.query.filter(
    Property.user_id == user.id
    ).order_by(Property.created_at.desc()).all()

    response =[]
    
    for property in properties:
        property_dict = property.to_dict_basic()

        current_lease = Lease.query.filter(db.and_(property.id == Lease.property_id,
                                                    Lease.is_active == True)).first()
        
     
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

# Get all properties by pagination
@property_routes.route("", methods=['GET'])
@login_required
def get_all_properties():
    user = User.query.get(current_user.id)
    page = request.args.get('page', 1, type=int)  # Default to page 1
    per_page = request.args.get('per_page', 10, type=int)  # Default to 10 items per page
    num_properties = Property.query.filter(Property.user_id == user.id).count()

    pagination = Property.query.filter(
    Property.user_id == user.id
    ).order_by(Property.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )


    response = []
    for property in pagination.items:
        property_dict = property.to_dict_basic()

        current_lease = Lease.query.filter(db.and_(property.id == Lease.property_id,
                                                    Lease.is_active == True)).first()
                                                    
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
    
    return jsonify({"properties":response, "num_properties": num_properties}), 200


# Get Property details from an id
@property_routes.route("/<int:propertyId>", methods=['GET'])
@login_required
def get_a_property(propertyId):
    user = User.query.get(current_user.id)
    property = Property.query.get(propertyId)

    if (property == None):
          return jsonify({ "message": "Property couldn't be found"}), 404

    # Check if the user is authorized to access the property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403

    current_lease = Lease.query.filter(db.and_(property.id == Lease.property_id,
                                                    Lease.is_active == True)).first()
    
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


# Create A Property
@property_routes.route("", methods=['POST'])
@login_required
def add_property():
   user = User.query.get(current_user.id)
   try:
    form = CreatePropertyForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    if form.validate_on_submit():
         # Check if address is unique for the property
        address = form.address.data
        is_unique = not Property.query.filter(
            Property.address == address
        ).first()
        if not is_unique:
            return jsonify({"message": "The address already exists. Please use a different address."}), 400

        new_property = Property(
                                    user_id = user.id,
                                    address = form.address.data,
                                    property_type = form.property_type.data,
                                    bedrooms = form.bedrooms.data,
                                    bathrooms = form.bathrooms.data,
                                    square_feet = form.sqft.data

                                ) 
        db.session.add(new_property)
        db.session.commit()

        new_property_dict =new_property.to_dict_basic()
        return jsonify(new_property_dict), 201
   except IntegrityError as e:
        db.session.rollback()  # Rollback the session to handle the exception cleanly

        # Check if the error is related to the unique constraint on address
        if "UNIQUE constraint failed: properties.address" in str(e.orig):
            return jsonify({"address": "The address already exists. Please use a different address."}), 400
   
   return form.errors, 400



# Update A Property
@property_routes.route("/<int:propertyId>", methods=['PATCH'])
@login_required
def update_property(propertyId):
    user = User.query.get(current_user.id)
   
    #Check if the property exists
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
     
    # Check if the user is authorized to access this property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    try:
    
        form = CreatePropertyForm()
        form['csrf_token'].data = request.cookies.get('csrf_token')
        if form.validate_on_submit():
            address = form.address.data

            # other_properties = Property.query.filter(Property.id != propertyId).all()

            is_unique = not Property.query.filter(
                Property.address == address,
                Property.id != propertyId                   
            ).first()
            if not is_unique:
                return jsonify({"message": "The address already exists. Please use a different address."}), 400
                
            property.address = form.address.data
            property.property_type = form.property_type.data
            property.bedrooms = form.bedrooms.data
            property.bathrooms = form.bathrooms.data
            property.square_feet = form.sqft.data

            db.session.commit()

            property_dict =property.to_dict_basic()
            return jsonify(property_dict), 200
    except IntegrityError as e:
        db.session.rollback()  # Rollback the session to handle the exception cleanly

        # Check if the error is related to the unique constraint on address
        if "UNIQUE constraint failed: properties.address" in str(e.orig):
            return jsonify({"message": "The address already exists. Please use a different address."}), 400
   
        return form.errors, 400




# Remove A Property
@property_routes.route("/<int:propertyId>", methods=['DELETE'])
@login_required
def remove_property(propertyId):
    user = User.query.get(current_user.id)
   
    #Check if the property exists
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
     
    # Check if the user is authorized to access this property
    if property.user_id != user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    db.session.delete(property)
    db.session.commit()

    return jsonify(	{"message": "Successfully deleted"}), 200