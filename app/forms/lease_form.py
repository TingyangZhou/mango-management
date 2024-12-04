from flask_wtf import FlaskForm
<<<<<<< HEAD
from flask_wtf.file import FileField, FileAllowed
from wtforms import IntegerField, DateField, FloatField
from wtforms.validators import DataRequired, NumberRange, ValidationError
from app.api.aws import ALLOWED_EXTENSIONS
=======
from wtforms import IntegerField, DateField, FloatField
from wtforms.validators import DataRequired, NumberRange, ValidationError
>>>>>>> 681a0a9b2f130562924ae6eb6533bded54958f13

from datetime import date


def validate_end_date(form, field):
    start_date = form.start_date.data
    end_date = field.data

    if end_date <= start_date:
        raise ValidationError("End date must be greater than start date.")
    if end_date <= date.today():
        raise ValidationError("End date must be in the future.")

class CreateLeaseForm(FlaskForm):
    start_date = DateField("Start Date", validators=[DataRequired()])
    end_date = DateField("End Date", validators=[DataRequired(), validate_end_date])
    rent = FloatField("Rent", validators=[DataRequired(), NumberRange(min=0.01, message="Rent must be a positive number.")])
    rent_due_day = IntegerField("Rent Due On", validators=[DataRequired(),NumberRange(min=0, max=30, message="Due day must be an integer between 0-30")])
    deposit = FloatField("Deposit", validators=[NumberRange(min=0, message="Deposit must be a non-negative number.")])
    deposit_due_date = DateField("Deposit Due Date", validators=[DataRequired()])
<<<<<<< HEAD
    lease_doc = FileField("Lease File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
=======
>>>>>>> 681a0a9b2f130562924ae6eb6533bded54958f13
      
    


