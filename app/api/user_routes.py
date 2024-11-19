from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from datetime import datetime

from app.models import User, Property, Invoice, Lease, db


user_routes = Blueprint("users", __name__, url_prefix="/api/users")


# @user_routes.route("/")
# @login_required
# def users():
#     """
#     Query for all users and returns them in a list of user dictionaries
#     """
#     users = User.query.all()
#     return {"users": [user.to_dict() for user in users]}




# @user_routes.route("/<int:id>")
# @login_required
# def user(id):
#     """
#     Query for a user by id and returns that user in a dictionary
#     """
#     user = User.query.get(id)


#     if user:
#         return user.to_dict()


#     else:
#         return {"error": "User Not Found"}, 404


@user_routes.route("/current")
@login_required
def currUserInfo():
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        
        total = db.session.query(db.func.sum(Invoice.amount)).filter(
                                        Invoice.user_id == user.id).scalar() or 0
        
        collected = db.session.query(db.func.sum(Invoice.amount)).filter(
                                        db.and_(Invoice.user_id == user.id,
                                                Invoice.payment_date != None)
                                        ).scalar() or 0
        
        outstanding = db.session.query(db.func.sum(Invoice.amount)).filter(
                                        db.and_(Invoice.user_id == user.id,
                                        Invoice.payment_date == None,
                                        Invoice.due_date > datetime.now())).scalar() or 0
        

        overdue = db.session.query(db.func.sum(Invoice.amount)).filter(
                                        db.and_(Invoice.user_id == user.id,
                                        Invoice.payment_date == None,
                                        Invoice.due_date < datetime.now())).scalar() or 0

        all_properties_count = Property.query.filter(Property.user_id == user.id).count()
        occupied_properties_count = Property.query.join(Lease).filter(db.and_(Property.user_id == user.id,
                                                                      Lease.is_active == 1)).count()
        vacant_property_count = all_properties_count - occupied_properties_count
       

        user_data = {
            "id": user.id,
			"first_name": user.first_name,
			"last_name": user.last_name,
			"username": user.username,
			"email": user.email,
			"total": total, 
		    "collected": collected,
			"outstanding": outstanding,
			"overdue": overdue,
			"num_vacanct_properties": vacant_property_count,
			"num_occupied_properties": occupied_properties_count

        }
        return jsonify(user_data), 200
    
    else:
        return jsonify({ "message": "Authentication required"}), 401

   

