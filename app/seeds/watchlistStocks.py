from sqlalchemy.sql import text
from app.models import SCHEMA, WatchlistStock, db, environment


# # Adds demo tweets
def seed_watchlist_stocks():

    db.session.add_all([
    WatchlistStock(user_id=1, stock_id=12),
    WatchlistStock(user_id=2, stock_id=7),
    WatchlistStock(user_id=3, stock_id=18),
    WatchlistStock(user_id=1, stock_id=25),
    WatchlistStock(user_id=2, stock_id=3),
    WatchlistStock(user_id=3, stock_id=30),
    WatchlistStock(user_id=1, stock_id=5),
    WatchlistStock(user_id=2, stock_id=27),
    WatchlistStock(user_id=3, stock_id=14),
    WatchlistStock(user_id=1, stock_id=8)])

    db.session.commit()

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlist_stocks"))

    db.session.commit()
