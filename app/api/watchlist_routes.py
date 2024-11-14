from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user


# from app.api.aws import get_unique_filename, upload_file_to_s3
# from app.forms import TweetForm
from app.models import Stock, db, WatchlistStock

watchlist_routes = Blueprint("watchlist", __name__)

#Get Current User's Watchlisted Stocks
@watchlist_routes.route("/current")
@login_required
def stocks():
    watchlist = WatchlistStock.query.filter(WatchlistStock.user_id == current_user.id).all()
    watchlist_dict = [
        {"id": stock.id,
        "ticker": stock.stocks.to_dict_basic()['ticker'],
        "company_name": stock.stocks.to_dict_basic()['company_name'],
        "image_url": stock.stocks.to_dict_basic()['image_url'],
        "company_info": stock.stocks.to_dict_basic()['company_info'],
        "updated_price": stock.stocks.to_dict_basic()['updated_price'],
        "stock_id": stock.stock_id}
        for stock in watchlist
    ]

    return jsonify({"watchlist_stocks": watchlist_dict}), 200




# Add a Stock to Current User's Watchlist
@watchlist_routes.route("/<int:stockId>/current", methods=['POST'])
@login_required
def add_stock(stockId):
    stock_to_add = Stock.query.get(stockId)

    # check if stock with stockId exists, if not return 404 error 
    if not (stock_to_add):
        return jsonify({"message": "Stock couldn't be found"}), 404
    
    new_watchlist_stock = WatchlistStock(user_id = current_user.id, stock_id = stockId) # watchlist stock to be added
    watchlist_stocks = current_user.watchlist_stocks # all existing wathclist stocks
    # print("--------------\n", watchlist_stocks)
    watchlist_stockId = [stock.stock_id for stock in watchlist_stocks] 
    # print("--------------\nstockId", watchlist_stockId)


    # check if the stock to be added is already in watchlist
    if new_watchlist_stock.stock_id not in watchlist_stockId: 
        current_user.watchlist_stocks.append( new_watchlist_stock)
        db.session.add( new_watchlist_stock)
        db.session.commit()
    
        new_watchlist_stock = {
            "id": new_watchlist_stock.id,
            "ticker": new_watchlist_stock.stocks.to_dict_basic()['ticker'],
            "company_name": new_watchlist_stock.stocks.to_dict_basic()['company_name'],
            "image_url": new_watchlist_stock.stocks.to_dict_basic()['image_url'],
            "company_info": new_watchlist_stock.stocks.to_dict_basic()['company_info'],
            "updated_price": new_watchlist_stock.stocks.to_dict_basic()['updated_price'],
            "Is_in_watchlist": True,
            "stock_id": new_watchlist_stock.stock_id
            }      

        return jsonify(new_watchlist_stock), 200
    
    # if stock to add already in watch list, return 400 error
    else:
        return jsonify({"error": "Stock already exists in watchlist."}), 400



# Delete a Stock from Current User's Watchlist
@watchlist_routes.route("/<int:stockId>/current", methods=['DELETE'])
@login_required
def remove_stock(stockId):
    stock_to_delete = Stock.query.get(stockId)
    # print("====================================")
    # print("stockId")
    # print(stockId)
    # print("stock to delete")
    # print("watchlists foreign key stock_id")
    # # print(stock_to_delete.stock_id)
    # print("actual id")
    # print(stock_to_delete.id)
    # print("====================================")

    # check if stock with stockId exists, if not return 404 error 
    if not (stock_to_delete):
        return jsonify({"message": "Stock couldn't be found"}), 404
    
    # retrieve the stock to be removed from watchlist 
    watchlist_stock = WatchlistStock.query.filter(
        WatchlistStock.user_id == current_user.id,
        WatchlistStock.id == stockId).first() 
    
    # if the stock is not in watchlist, return error
    if (not watchlist_stock):
        return jsonify({"message": "Stock is not in watchlist"}), 400
    
    else:
        db.session.delete(watchlist_stock)
        db.session.commit()
        return jsonify({"message": "successfully deleted from watchlist"}), 200
