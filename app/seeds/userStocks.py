from sqlalchemy.sql import text
from app.models import SCHEMA, UserStock, db, environment


# # Adds demo tweets
def seed_user_stocks():
    db.session.add_all([UserStock(user_id=1, stock_id=23, share_quantity=2, share_price=99.50),
    UserStock(user_id=2, stock_id=10, share_quantity=5, share_price=45.75),
    UserStock(user_id=3, stock_id=15, share_quantity=3, share_price=120.30),
    UserStock(user_id=1, stock_id=7, share_quantity=8, share_price=88.45),
    UserStock(user_id=2, stock_id=30, share_quantity=1, share_price=52.10),
    UserStock(user_id=3, stock_id=5, share_quantity=4, share_price=67.99),
    UserStock(user_id=1, stock_id=12, share_quantity=7, share_price=74.25),
    UserStock(user_id=2, stock_id=3, share_quantity=6, share_price=92.15),
    UserStock(user_id=3, stock_id=25, share_quantity=2, share_price=101.65),
    UserStock(user_id=1, stock_id=18, share_quantity=9, share_price=56.85),
    UserStock(user_id=2, stock_id=8, share_quantity=3, share_price=63.40)])
    
    db.session.commit()

def undo_user_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_stocks"))

    db.session.commit()
