from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user

# from app.api.aws import get_unique_filename, upload_file_to_s3
# from app.forms import TweetForm
from app.models import Stock, WatchlistStock, UserStock, db

stock_routes = Blueprint("stocks", __name__)


@stock_routes.route("")
@login_required
def stocks():

    all_stocks = db.session.query(
        Stock.id,
        Stock.ticker,
        Stock.company_name,
        Stock.company_info,
        Stock.image_url,
        Stock.updated_price,
        db.session.query(UserStock).filter(UserStock.stock_id == Stock.id, UserStock.user_id == current_user.get_id()).exists().label("is_in_portfolio"),
        db.session.query(WatchlistStock).filter(WatchlistStock.stock_id == Stock.id, WatchlistStock.user_id == current_user.get_id()).exists().label("is_in_watchlist")
    ).all()

    all_stocks_dict = [{
        "id": stock.id,
        "ticker": stock.ticker,
        "company_name": stock.company_name,
        "company_info": stock.company_info,
        "image_url": stock.image_url,
        "updated_price": stock.updated_price,
        "is_in_portfolio": stock.is_in_portfolio,
        "is_in_watchlist": stock.is_in_watchlist
    } for stock in all_stocks]

    data = {"stocks": all_stocks_dict}
    print("================================")
    print(data)
    print("================================")
    response = make_response(jsonify(data), 200)  # Sets a 404 Not Found status code
    response.headers["Content-Type"] = "application/json"
    return response

    # except(e):

    #     data = {"message": ""}
    #     response = make_response(jsonify(data), 200)  # Sets a 404 Not Found status code
    #     response.headers["Content-Type"] = "application/json"
    #     return response





# def format_errors(validation_errors):
#     """
#     Simple function that turns the WTForms validation errors into a simple list
#     """
#     errorMessages = dict()

#     for field in validation_errors:
#         errorMessages[field] = [error for error in validation_errors[field]]

#     return errorMessages


# @tweet_routes.route("")
# def tweets():
#     """
#     Query for all tweets and returns them in a list of tweet dictionaries
#     """
#     tweets = Tweet.query.all()
#     return {"tweets": [tweet.to_dict() for tweet in tweets]}


# @tweet_routes.route("", methods=["POST"])
# def post_a_tweet():
#     """
#     Query for all tweets and returns them in a list of tweet dictionaries
#     """

#     form = TweetForm()

#     form["csrf_token"].data = request.cookies["csrf_token"]

#     if form.validate_on_submit():
#         tweet = form.data["tweet"]
#         user_id = form.data["user_id"]
#         image = form.data["image"]

#         image.filename = get_unique_filename(image.filename)
#         upload = upload_file_to_s3(image)
#         print(upload)

#         if "url" not in upload:
#             # if the dictionary doesn't have a url key
#             # it means that there was an error when you tried to upload
#             # so you send back that error message (and you printed it above)
#             return {"errors": [upload]}, 400

#         url = upload["url"]
#         new_tweet = Tweet(tweet=tweet, user_id=user_id, image=url)

#         db.session.add(new_tweet)

#         db.session.commit()

#         return new_tweet.to_dict()

#     if form.errors:
#         return {"errors": format_errors(form.errors)}, 400
