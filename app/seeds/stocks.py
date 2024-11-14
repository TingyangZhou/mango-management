from sqlalchemy.sql import text
from .demo_stock import demo_stocks
from app.models import SCHEMA, Stock, db, environment


# # Adds demo tweets
def seed_stocks():
    # stock1 = Tweet(tweet="This is my first tweet!", author=demo, liked_by=[marnie])
    # stock2 = Tweet(
    #     tweet="Sql tweets are usually worse than the original :/", author=demo
    # )
    # stock3 = Tweet(
    #     tweet="You know what they say, third tweet's the charm!!!",
    #     author=marnie,
    #     liked_by=[bobbie, demo, marnie],
    # )
    # {"ticker": "PLTR", "company_name": "PALANTIR TECHNOLOGIES INC-A", "updated_price": 47.09, "company_info": "Palantir Technologies is a public American software company that specializes in big data analytics."},
    for stock in demo_stocks:
        seedStock = Stock(
            ticker=stock["ticker"],
            company_name=stock["company_name"],
            updated_price=stock["updated_price"],
            company_info=stock["company_info"]
            )
        db.session.add(seedStock)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the tweets table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_stocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM stocks"))

    db.session.commit()
