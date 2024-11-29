from flask_wtf import FlaskForm
# from flask_wtf.file import FileAllowed, FileField, FileRequired
from wtforms import StringField, DateField, FloatField, IntegerField
from wtforms.validators import DataRequired, Length, NumberRange


class CreateInvoiceForm(FlaskForm):
    item = StringField("Item", validators=[DataRequired()])
    description = StringField("Description")
    due_date = DateField("Due Date", validators=[DataRequired()])
    amount = FloatField("Amount", validators=[DataRequired(), NumberRange(min=0.01, message="Amount must be a positive number.")])
    property_id = IntegerField("Property Id", validators=[DataRequired(), NumberRange(min=1, message="Property Id must be a positive integer.")])
   


class UpdateInvoiceForm(FlaskForm):
    item = StringField("Item", validators=[DataRequired()])
    description = StringField("Description")
    due_date = DateField("Due Date", validators=[DataRequired()])
    amount = FloatField("Amount", validators=[DataRequired(), NumberRange(min=0.01, message="Amount must be a positive number.")])
   
    
   
 


