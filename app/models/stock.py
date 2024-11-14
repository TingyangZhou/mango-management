from .db import SCHEMA, add_prefix_for_prod, db, environment
from .userStock import UserStock

class Stock(db.Model):
    __tablename__ = "stocks"


#     __tablename__ = "tweets"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    

    id = db.Column(db.Integer, primary_key=True)
    ticker = db.Column(db.String(20), nullable=False, unique=True)
    company_name = db.Column(db.String(), nullable=False)
    company_info = db.Column(db.String())
    image_url = db.Column(db.String())
    updated_price = db.Column(db.Float(precision=2))

    user_stocks = db.relationship("UserStock", backref="stocks", cascade="all, delete-orphan")
    watchlist_stocks = db.relationship("WatchlistStock", backref="stocks", cascade="all, delete-orphan")


#     tweet = db.Column(db.Text)
#     user_id = db.Column(
#         db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
#     )
#     image = db.Column(db.String(1000), nullable=True)

#     # Related data
#     author = db.relationship("User", back_populates="tweets")
#     liked_by = db.relationship("User", back_populates="liked_tweets", secondary=likes)

    def to_dict_basic(self):
        return {
            "id": self.id,
            "ticker": self.ticker,
            "company_name": self.company_name,
            "company_info": self.company_info,
            "image_url": self.image_url,
            "updated_price": self.updated_price
        }

    # could be named to_dict()
    # def to_dict(self):
    #     return {
    #         **self.to_dict_basic(),
    #         "User": self.author.to_dict_basic(),
    #         "LikedBy": [user.to_dict_basic() for user in self.liked_by],
    #     }
