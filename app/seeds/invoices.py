from sqlalchemy.sql import text
from app.models import SCHEMA, Invoice, db, environment
from datetime import datetime


# # Adds demo tweets
def seed_invoices():
    invoice1 = Invoice(
        lease_id=1,
        user_id = 1,
        
        item="Rent",
        description="Monthly rent for January",
        due_date=datetime(2024, 1, 1).date(),
        amount=1500.00,
        payment_date=datetime(2024, 1, 1).date()
    )
    invoice2 = Invoice(
        lease_id=2,
        user_id = 1,
      
        item="Rent",
        description="Monthly rent for February",
        due_date=datetime(2024, 2, 1).date(),
        amount=1500.00,
        payment_date=None  # Unpaid
    )
    invoice3 = Invoice(
        lease_id=3,
        user_id = 1,
        
        item="Rent",
        description="Monthly rent for March",
        due_date=datetime(2024, 3, 1).date(),
        amount=2000.00,
        payment_date=datetime(2024, 3, 15).date()
    )
    invoice4 = Invoice(
        lease_id=4,
        user_id = 2,
      
        item="Rent",
        description="Monthly rent for April",
        due_date=datetime(2024, 12, 1).date(),
        amount=1200.00,
        payment_date=None  # Unpaid
    )
    invoice5 = Invoice(
        lease_id=5,
        user_id = 1,

        item="Rent",
        description="Monthly rent for May",
        due_date=datetime(2022, 5, 1).date(),
        amount=1000.00,
        payment_date=datetime(2022, 5, 1).date()
    )

    invoice6 = Invoice(
        lease_id=4,
        user_id = 2,

        item="Deposit",
       
        due_date=datetime(2024, 3, 15).date(),
        amount=1000.00,
        payment_date=datetime(2024, 3, 13).date()
    )

    db.session.add_all([invoice1,invoice2, invoice3, invoice4, invoice5, invoice6])
    
    db.session.commit()

def undo_invoices():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.invoices RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM invoices"))

    db.session.commit()
