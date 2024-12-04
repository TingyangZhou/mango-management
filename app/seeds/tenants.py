from sqlalchemy.sql import text
from app.models import SCHEMA, Tenant, db, environment



def seed_tenants():

    tenants = [
        Tenant(first_name="Tenant1First", last_name="Tenant1Last", email="tenant1@example.com", mobile="5550001", lease_id=1),
        Tenant(first_name="Tenant2First", last_name="Tenant2Last", email="tenant2@example.com", mobile="5550002", lease_id=1),
        Tenant(first_name="Tenant3First", last_name="Tenant3Last", email="tenant3@example.com", mobile="5550003", lease_id=2),
        Tenant(first_name="Tenant4First", last_name="Tenant4Last", email="tenant4@example.com", mobile="5550004", lease_id=2),
        Tenant(first_name="Tenant5First", last_name="Tenant5Last", email="tenant5@example.com", mobile="5550005", lease_id=3),
        Tenant(first_name="Tenant6First", last_name="Tenant6Last", email="tenant6@example.com", mobile="5550006", lease_id=3),
        Tenant(first_name="Tenant7First", last_name="Tenant7Last", email="tenant7@example.com", mobile="5550007", lease_id=4),
        Tenant(first_name="Tenant8First", last_name="Tenant8Last", email="tenant8@example.com", mobile="5550008", lease_id=4)
    ]
    db.session.add_all(tenants)
    db.session.commit()

def undo_tenants():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tenants RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tenants"))

    db.session.commit()
