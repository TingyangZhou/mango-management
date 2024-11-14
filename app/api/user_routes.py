from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user


from app.models import User, db


user_routes = Blueprint("users", __name__)




def user_to_dict(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "cash_balance": user.cash_balance,
        "createdAt": "2021-11-19 20:39:36"
        }




@user_routes.route("/")
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}




@user_routes.route("/<int:id>")
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)


    if user:
        return user.to_dict()


    else:
        return {"error": "User Not Found"}, 404


@user_routes.route("/current")
def currUserInfo():
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)


        response_body = jsonify(user_to_dict(user))
        response = make_response(response_body,200)
        response.headers["Content-Type"] = "application/json"
    else:
        response_body = jsonify({ "message": "Authentication required"})
        response = make_response(response_body, 401)
        response.headers["Content-Type"] = "application/json"
    return response
   


@user_routes.route("/current", methods=["PATCH"])
def currUserUpdate():
    if current_user.is_authenticated:
        data = request.get_json()
        new_balance = data.get('New_balance') # incremental amount

        currUser = User.query.get(current_user.id)
        old_balance = currUser.cash_balance 
        currUser.cash_balance = new_balance + old_balance
        db.session.commit()


        response_body = jsonify(user_to_dict(currUser))
        response = make_response(response_body,200)
        response.headers["Content-Type"] = "application/json"


    else:
        response_body = jsonify({ "message": "Authentication required"})
        response = make_response(response_body, 401)
        response.headers["Content-Type"] = "application/json"
    return response

    

