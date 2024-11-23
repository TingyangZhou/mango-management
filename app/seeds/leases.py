from sqlalchemy.sql import text
from app.models import SCHEMA, Lease, db, environment
from datetime import datetime


# # Adds demo tweets
def seed_leases():
    lease1 = Lease(
  
        property_id=1,
        start_date=datetime(2024, 1, 1).date(),
        end_date=datetime(2024, 12, 31).date(),
        rent=1500.00,
        rent_due_day=1,
        deposit=1500.00,
        deposit_due_date=datetime(2023, 12, 15).date(),
        is_active=True
    )
    lease2 = Lease(

        property_id=2,
        start_date=datetime(2024, 2, 1).date(),
        end_date=datetime(2024, 12, 31).date(),
        rent=2000.00,
        rent_due_day=1,
        deposit=2000.00,
        deposit_due_date=datetime(2023, 12, 15).date(),
        is_active=True
    )
    lease3 = Lease(
  
        property_id=3,
        start_date=datetime(2024, 3, 1).date(),
        end_date=datetime(2024, 12, 31).date(),
        rent=1200.00,
        rent_due_day=1,
        deposit=1200.00,
        deposit_due_date=datetime(2023, 12, 15).date(),
        is_active=True
    )
    lease4 = Lease(
    
        property_id=4,
        start_date=datetime(2024, 4, 1).date(),
        end_date=datetime(2025, 4, 1).date(),
        rent=1000.00,
        rent_due_day=1,
        deposit=1000.00,
        deposit_due_date=datetime(2023, 12, 20).date(),
        is_active=True
    )

    lease5 = Lease(

        property_id=1,
        start_date=datetime(2022, 2, 1).date(),
        end_date=datetime(2023, 2, 1).date(),
        rent=1000.00,
        rent_due_day=1,
        deposit=1000.00,
        deposit_due_date=datetime(2021, 12, 20).date(),
        is_active=False
    )

    db.session.add_all([lease1, lease2, lease3, lease4, lease5])
    db.session.commit()

def undo_leases():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.leases RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM leases"))

    db.session.commit()
