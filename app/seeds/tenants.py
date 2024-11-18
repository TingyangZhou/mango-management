from sqlalchemy.sql import text
from app.models import SCHEMA, Tenant, db, environment


# # Adds demo tweets
def seed_tenants():

    tenants = [
        Tenant(first_name="Tenant1First", last_name="Tenant1Last", email="tenant1@example.com", mobile="555-0001", lease_id=1001),
        Tenant(first_name="Tenant2First", last_name="Tenant2Last", email="tenant2@example.com", mobile="555-0002", lease_id=1001),
        Tenant(first_name="Tenant3First", last_name="Tenant3Last", email="tenant3@example.com", mobile="555-0003", lease_id=1002),
        Tenant(first_name="Tenant4First", last_name="Tenant4Last", email="tenant4@example.com", mobile="555-0004", lease_id=1002),
        Tenant(first_name="Tenant5First", last_name="Tenant5Last", email="tenant5@example.com", mobile="555-0005", lease_id=1003),
        Tenant(first_name="Tenant6First", last_name="Tenant6Last", email="tenant6@example.com", mobile="555-0006", lease_id=1003),
        Tenant(first_name="Tenant7First", last_name="Tenant7Last", email="tenant7@example.com", mobile="555-0007", lease_id=1004),
        Tenant(first_name="Tenant8First", last_name="Tenant8Last", email="tenant8@example.com", mobile="555-0008", lease_id=1004)
    ]
    db.session.add_all(tenants)
    db.session.commit()

def undo_tenants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tenants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tenants"))

    db.session.commit()
