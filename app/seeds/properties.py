from sqlalchemy.sql import text
from app.models import SCHEMA, Property, db, environment


# # Adds demo tweets
def seed_properties():
    
    # Create Properties
    property1 = Property(
        user_id = 1,
        address="123 Main St, Houston, TX",
        property_type="Apartment",
        bedrooms=2,
        bathrooms=1,
        square_feet=900,
    )
    property2 = Property(
        user_id = 1,
        address="456 Oak Dr, Houston, TX",
        property_type="House",
        bedrooms=3,
        bathrooms=2,
        square_feet=1400,
    )
    property3 = Property(
        user_id = 1,
        address="789 Pine Ln, Houston, TX",
        property_type="Townhouse",
        bedrooms=2,
        bathrooms=2,
        square_feet=1200,
    )
    property4 = Property(
        user_id = 2,
        address="101 Maple Ct, Houston, TX",
        property_type="Apartment",
        bedrooms=1,
        bathrooms=1,
        square_feet=600,
    )
    property5 = Property(
        user_id = 2,
        address="202 Cedar St, Houston, TX",
        property_type="House",
        bedrooms=3,
        bathrooms=3,
        square_feet=1600,
    )
    db.session.add_all([property1, property2, property3, property4, property5])
    db.session.commit()


def undo_properties():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.properties RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM properties"))

    db.session.commit()
