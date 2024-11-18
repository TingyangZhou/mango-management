# from flask import Blueprint, request, make_response, jsonify
# from flask_login import login_required, current_user
# # from app.api.aws import get_unique_filename, upload_file_to_s3
# from app.models import UserStock, Stock, db

# portfolio_routes = Blueprint("portfolio", __name__)



# @portfolio_routes.route("/current", methods=['GET','DELETE'])
# # @login_required
# def get_current_user_portfolio():
#     try :
#         if request.method=='GET':
#             current_user_stocks = (
#                 db.session.query(UserStock, Stock)
#                 .join(Stock, UserStock.stock_id == Stock.id)
#                 .filter(UserStock.user_id == current_user.get_id())
#                 .all()
#             )
#             current_user_stocks_dict = [
#                 {
#                     "id": user_stock.id,
#                     "ticker": stock.ticker,
#                     "company_name": stock.company_name,
#                     "image_url": stock.image_url,
#                     "company_info": stock.company_info,
#                     "share_price": stock.updated_price,  
#                     "share_quantity": user_stock.share_quantity,
#                     "stock_id": stock.id,
#                     "updated_price": stock.updated_price
#                 }
#                 for user_stock, stock in current_user_stocks
#             ]
#             return make_response(jsonify({"portfolio_stocks": current_user_stocks_dict}), 200, {"Content-Type": "application/json"})
#         elif request.method=='DELETE':
#             user_id = current_user.get_id()
#             db.session.query(UserStock).filter(UserStock.user_id==user_id).delete(synchronize_session=False)
#             db.session.commit()
#             return make_response(jsonify({"message": "successfully deleted"}), 200, {"Content-Type": "application/json"})
#     except Exception as e :
#         return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    


# @portfolio_routes.route('/<int:stockId>/current',methods=['POST','PATCH','DELETE'])
# @login_required
# def handle_portfolio_stock(stockId):
#     try:
#         # num_shares = request.json.get('num_shares')
#         print('Data 3:', stockId, type(stockId))
#         stock = Stock.query.get(stockId)
#         print('Data 4:', stockId, type(stockId))
#         user_id = current_user.get_id()
#         print('Data 5:', stockId, type(stockId))
#         if (stock):
#             if (request.method =='POST'):
#                 # step 1/2 for POST. try adding data to database 
#                 num_shares = request.json.get('num_shares') # Debugged for frontend (Adrian)
#                 updated_price = stock.updated_price
#                 new_user_stock = UserStock(
#                     user_id = user_id,
#                     stock_id = stockId,
#                     share_quantity = num_shares,
#                     share_price = updated_price
#                 )
#                 db.session.add(new_user_stock)
#                 db.session.commit()
#                 res_user_stock_id = new_user_stock.id
#             elif request.method =='PATCH' or request.method =='DELETE':
#                 # step 1/2 for PATCH and DELETE. find the userstock record
#                 target_user_stock = UserStock.query.filter(UserStock.user_id==user_id, UserStock.stock_id==stockId).first()
#                 #when the stock is not owned by the current user ( not in the user_stocks table)
#                 if not target_user_stock:
#                     return make_response(jsonify({"message": "Stock couldn't be found"}), 404, {"Content-Type": "application/json"})
#                 if request.method =='DELETE':
#                     db.session.delete(target_user_stock)
#                     db.session.commit()
#                     return make_response(jsonify({"message": "successfully deleted"}), 200, {"Content-Type": "application/json"})
#                 elif request.method =='PATCH':
#                     num_shares = request.json.get('num_shares') # Debugged for frontend (Adrian)
#                     updated_price = request.json.get("updated_price")
#                     target_user_stock.share_quantity = num_shares
#                     if updated_price:
#                         target_user_stock.share_price = updated_price
#                     db.session.commit()
#                     res_user_stock_id=target_user_stock.id
#             # step 2/2 for POST & PATCH. construct response dictionary 
#             new_user_stock_dict = {
#                 "id": res_user_stock_id,
#                 "ticker": stock.ticker,
#                 "company_name": stock.company_name,
#                 "image_url": stock.image_url,
#                 "company_info": stock.company_info,
#                 "updated_price": stock.updated_price,
#                 "share_quantity": num_shares
#             }
#             if request.method == "PATCH" and updated_price:
#                 new_user_stock_dict["updated_price"] = updated_price
#             return make_response(jsonify(new_user_stock_dict), 201, {"Content-Type": "application/json"})
#         else:
#             #when the stock is not available in the stock universe
#             return make_response(jsonify({"message": "Stock couldn't be found"}), 404, {"Content-Type": "application/json"})
#     except Exception as e :
#         # in case the data has been push to database but ran into error in step 2 above, rollback the commit
#         db.session.rollback()
#         return make_response(jsonify({"message": str(e)}), 500, {"Content-Type": "application/json"})
    
    
    