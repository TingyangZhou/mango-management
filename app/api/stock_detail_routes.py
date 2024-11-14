# app/api/stock_details.py

from flask import Blueprint, jsonify
from flask_login  import login_required, current_user
from app.models import Stock, WatchlistStock, UserStock

stock_detail_routes = Blueprint('stock_details', __name__)

@stock_detail_routes.route('/<stockId>', methods=['GET'])
@login_required
def stock_detail(stockId):
    stock_details = Stock.query.get(stockId)

    if not stock_details:
        return jsonify({"message": "Stock couldn't be found"}), 404
    
    is_in_watchlist = WatchlistStock.query.filter_by(user_id=current_user.id, stock_id=stockId).first() is not None
    is_in_portfolio = UserStock.query.filter_by(user_id=current_user.id, stock_id=stockId).first() is not None

    return jsonify({
        'id': stock_details.id,
        'ticker': stock_details.ticker,
        'company_name': stock_details.company_name,
        'image_url': stock_details.image_url,
        'company_info': stock_details.company_info,
        'updated_price': stock_details.updated_price,
        'Is_in_watchlist': is_in_watchlist,
        'Is_in_portfolio': is_in_portfolio,
    })
