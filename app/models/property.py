from .db import SCHEMA, add_prefix_for_prod, db, environment
from datetime import datetime, timezone

class Property(db.Model):
    __tablename__ = "properties"


    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False, unique=True)
    user_id = db.Column(
        db.Integer, 
        db.ForeignKey(add_prefix_for_prod('users.id'), ondelete="CASCADE"), 
        nullable=False
        )
    property_type = db.Column(db.String(), nullable=False)
    bedrooms = db.Column(db.Integer(), nullable=False)
    bathrooms = db.Column(db.Integer(), nullable=False)
    square_feet = db.Column(db.Integer(), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    
    leases = db.relationship("Lease", backref = "property", cascade="all, delete-orphan")
    


    def to_dict_basic(self):
        return {
            "id": self.id,
            "address": self.address,
            "property_type": self.property_type,
            "bedrooms": self.bedrooms,
            "bathrooms": self.bathrooms,
            "square_feet": self.square_feet,
            "created_at": self.created_at,
            
        }

    # could be named to_dict()
    # def to_dict(self):
    #     return {
    #         **self.to_dict_basic(),
    #         "User": self.author.to_dict_basic(),
    #         "LikedBy": [user.to_dict_basic() for user in self.liked_by],
    #     }
