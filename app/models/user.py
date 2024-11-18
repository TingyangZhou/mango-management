from flask_login import UserMixin
from .db import SCHEMA, add_prefix_for_prod, db, environment
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime, timezone


class User(db.Model, UserMixin):
    __tablename__ = "users"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    properties = db.relationship("Property", backref = "user", cascade="all, delete-orphan")
    invoices = db.relationship("Invoice", backref = "user", cascade="all, delete-orphan")
   
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict_basic(self):
        return {
            "id": self.id, 
            "first_name":self.first_name, 
            "last_name": self.last_name, 
            "username": self.username, 
            "email": self.email
            }

 
