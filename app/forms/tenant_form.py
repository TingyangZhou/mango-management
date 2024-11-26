from flask_wtf import FlaskForm
# from flask_wtf.file import FileAllowed, FileField, FileRequired
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class CreateTenantForm(FlaskForm):
    first_name = StringField("First Name", validators=[DataRequired(),Length(min=1, max=100, message="First name must be between 1 and 100 characters.")])
    last_name = StringField("Last Name", validators=[DataRequired(),Length(min=1, max=100, message="Last name must be between 1 and 100 characters.")])
    email = StringField("Email", validators=[DataRequired()])
    mobile = StringField("Mobile", validators=[DataRequired(), Length(min=1, max=20, message="Phone number must be between 1 and 20 numbers")])
 


