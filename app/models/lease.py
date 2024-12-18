from .db import SCHEMA, add_prefix_for_prod, db, environment
from datetime import datetime, timezone


class Lease(db.Model):
    __tablename__ = "leases"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(
        db.Integer, 
        db.ForeignKey(add_prefix_for_prod('properties.id'), ondelete="CASCADE"), 
        nullable=False
        )
    start_date = db.Column(db.Date, nullable = False)
    end_date = db.Column(db.Date, nullable = False)
    rent = db.Column(db.Numeric(precision=10, scale=2), nullable = False)
    rent_due_day = db.Column(db.Integer, nullable = False)
    deposit = db.Column(db.Numeric(precision=10, scale=2), nullable = True)
    deposit_due_date = db.Column(db.Date, nullable = False)
    lease_doc = db.Column(db.String, nullable=True)
    is_archived = db.Column(db.Boolean, nullable = False, default = False)
    is_active = db.Column(db.Boolean, nullable = False, default = True)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    tenants = db.relationship("Tenant", backref = "lease", cascade="all, delete-orphan")
    invoices = db.relationship("Invoice", backref = "lease", cascade="all, delete-orphan")
    

    def to_dict_basic(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "start_date": self.start_date.strftime('%Y-%m-%d') if self.start_date else None,
            "end_date": self.end_date.strftime('%Y-%m-%d') if self.end_date else None,
            "rent": self.rent,
            "rent_due_day": self.rent_due_day,
            "deposit": self.deposit,
            "deposit_due_date":self.deposit_due_date.strftime('%Y-%m-%d') if self.deposit_due_date else None,
            "is_active": self.is_active,
            "is_archived": self.is_archived,
            "lease_doc": self.lease_doc,
            "created_at": self.created_at,
            
        }


