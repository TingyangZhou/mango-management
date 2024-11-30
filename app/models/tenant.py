from .db import SCHEMA, add_prefix_for_prod, db, environment


class Tenant(db.Model):
    __tablename__ = "tenants"


    if environment == "production":
        __table_args__ = (
            db.UniqueConstraint('lease_id', 'email', name='unique_tenant_per_lease'),
            {"schema": SCHEMA},
    )
    else:
        __table_args__ = (
            db.UniqueConstraint('lease_id', 'email', name='unique_tenant_per_lease'),
    )

    

    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('leases.id'), ondelete="CASCADE"), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String, nullable=False, unique = False)
    mobile = db.Column(db.String(20), nullable=False)
   
    
    def to_dict_basic(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "mobile": self.mobile,
           
        }

    # could be named to_dict()
    # def to_dict(self):
    #     return {
    #         **self.to_dict_basic(),
    #         "User": self.author.to_dict_basic(),
    #         "LikedBy": [user.to_dict_basic() for user in self.liked_by],
    #     }
