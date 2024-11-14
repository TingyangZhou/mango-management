from flask.cli import AppGroup

from app.models.db import SCHEMA, db, environment

from .stocks import seed_stocks, undo_stocks
from .users import seed_users, undo_users
from .userStocks import seed_user_stocks, undo_user_stocks
from .watchlistStocks import seed_watchlist_stocks, undo_watchlist_stocks

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
        undo_watchlist_stocks()
        undo_user_stocks()
        undo_stocks()
        undo_users()

    seed_users()
    seed_stocks()
    seed_user_stocks()
    seed_watchlist_stocks()


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    # undo_tweets()
    undo_watchlist_stocks()
    undo_user_stocks()
    undo_users()
    undo_stocks()
