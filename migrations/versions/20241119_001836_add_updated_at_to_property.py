"""add updated_at to Property

Revision ID: 4245a8e795eb
Revises: 80d0c877bdae
Create Date: 2024-11-19 00:18:36.946846

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4245a8e795eb'
down_revision = '80d0c877bdae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('properties', schema=None) as batch_op:
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('properties', schema=None) as batch_op:
        batch_op.drop_column('updated_at')

    # ### end Alembic commands ###
