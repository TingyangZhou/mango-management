from .db import SCHEMA, add_prefix_for_prod, db, environment
from datetime import datetime, timezone

class Invoice(db.Model):
    __tablename__ = "invoices"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    lease_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('leases.id'), ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete="CASCADE"), nullable=False)
    item = db.Column(db.String(), nullable = False)
    description = db.Column(db.String(), nullable = True)
    due_date = db.Column(db.Date, nullable = False)
    amount = db.Column(db.Numeric(precision=10, scale=2), nullable = False)
    payment_date = db.Column(db.Date, nullable = True, default = None)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    
    def to_dict_basic(self):
        return {
            "id": self.id,
            "lease_id": self.lease_id,
            "item": self.item,
            "description": self.description,
            "due_date": self.due_date,
            "amount": self.amount,
            "payment_date": self.payment_date,
            "created_at": self.created_at,
            
        }