"""add user_id to invoice

Revision ID: 80d0c877bdae
Revises: d2fdb675277e
Create Date: 2024-11-17 18:58:23.252015

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '80d0c877bdae'
down_revision = 'd2fdb675277e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('invoices', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key("fk_invoices_user_id", 'users', ['user_id'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('invoices', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###
