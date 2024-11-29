from flask_wtf import FlaskForm
# from flask_wtf.file import FileAllowed, FileField, FileRequired
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, InputRequired, NumberRange, ValidationError

# from app.api.aws import ALLOWED_EXTENSIONS


class CreatePropertyForm(FlaskForm):
    address = StringField("Address", validators=[DataRequired()])
    property_type = StringField("Property Type", validators=[DataRequired()])
    bedrooms = IntegerField("Bedrooms", validators=[ NumberRange(min=0, message="Bedrooms must be a non-negative integer.")])
    bathrooms = IntegerField("Bathrooms", validators=[NumberRange(min=0, message="Bathrooms must be a non-negative integer.")])
    sqft = IntegerField("sqft", validators=[NumberRange(min=1, message="Square feet must be a positive integer.")])
    


