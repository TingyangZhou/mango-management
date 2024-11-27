from flask_wtf import FlaskForm
from wtforms import IntegerField, DateField, FloatField
from wtforms.validators import DataRequired, NumberRange, ValidationError

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
    deposit = FloatField("Deposit", validators=[DataRequired(), NumberRange(min=0.01, message="Deposit must be a positive number.")])
    deposit_due_date = DateField("Deposit Due Date", validators=[DataRequired()])
      
    


