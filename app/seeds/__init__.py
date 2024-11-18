from flask.cli import AppGroup

from app.models.db import SCHEMA, db, environment

from .properties import seed_properties, undo_properties
from .users import seed_users, undo_users
from .leases import seed_leases, undo_leases
from .tenants import seed_tenants, undo_tenants
from .invoices import seed_invoices, undo_invoices

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    if environment == "production":
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_invoices()
        undo_tenants()
        undo_leases()
        undo_properties()
        undo_users()

    seed_users()
    seed_properties()
    seed_leases()
    seed_tenants()
    seed_invoices()


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_invoices()
    undo_tenants()
    undo_leases()
    undo_properties()
    undo_users()
