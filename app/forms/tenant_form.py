from flask_wtf import FlaskForm
# from flask_wtf.file import FileAllowed, FileField, FileRequired
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class CreateTenantForm(FlaskForm):
    first_name = StringField("First Name", validators=[DataRequired(),Length(min=1, max=50, message="First name must be between 1 and 50 characters.")])
    last_name = StringField("Last Name", validators=[DataRequired(),Length(min=1, max=50, message="Last name must be between 1 and 50 characters.")])
    email = StringField("Email", validators=[DataRequired()])
    mobile = StringField("Mobile", validators=[DataRequired(), Length(min=10, max=15, message="Phone number must be between 1 and 50 characters.")])
 


