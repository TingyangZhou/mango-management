from .db import SCHEMA, add_prefix_for_prod, db, environment

class WatchlistStock(db.Model):
    __tablename__ = "watchlist_stocks"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete="CASCADE"), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('stocks.id'), ondelete="CASCADE"), nullable=False)




 

   

    
    