# app/api/search_routes.py

from flask import Blueprint, jsonify, request
from flask_login  import login_required, current_user
from app.models import Stock, UserStock, WatchlistStock

search_routes = Blueprint('search_routes', __name__)

@search_routes.route('/search', methods=['GET'])
@login_required
def search_stocks():
    search_query = request.args.get('input', '').strip()

    if not search_query:
        return jsonify({"message": "Search input required"}), 400
    
    search_results = Stock.query.filter(
        Stock.ticker.ilike(f'%{search_query}%') |
        Stock.company_name.ilike(f'%{search_query}%')
    ).all()

    search_list = []
    for stock in search_results:
        search_list.append({
            'id': stock.id,
            'ticker': stock.ticker,
            'company_name': stock.company_name,
            'image_url': stock.image_url,
            'updated_price': stock.updated_price,
            "is_in_watchlist": WatchlistStock.query.filter_by(user_id=current_user.id, stock_id=stock.id).first() is not None,
            "is_in_portfolio": UserStock.query.filter_by(user_id=current_user.id, stock_id=stock.id).first() is not None
        })
        
    return jsonify({'search_results': search_list}), 200