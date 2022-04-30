from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, RadioField, SubmitField, IntegerField, FloatField, SelectField
from wtforms.validators import InputRequired, EqualTo

class LoginForm(FlaskForm):
    user_id = StringField("User id:", validators=[InputRequired()])
    password = PasswordField("Password:", validators=[InputRequired()])
    submit = SubmitField("Submit")

class Admin_LoginForm(FlaskForm):
    admin_id = StringField("Admin id:", validators=[InputRequired()])
    password = PasswordField("Password:", validators=[InputRequired()])
    submit = SubmitField("Submit")
    
class RegistrationForm(FlaskForm):
    user_id = StringField("User id:", validators=[InputRequired()])
    password = PasswordField("Password:", validators=[InputRequired()])
    password2 = PasswordField("Repeat Password:", validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Submit")

class CheckoutForm(FlaskForm):
    customer_name = StringField("Name:", validators=[InputRequired()])
    delivery_address = StringField("Delivery Address:", validators=[InputRequired()])
    delivery_method = RadioField("Delivery Method:", choices = ["Next Day (+ €5.99)", "Standard (Free)"],
        default = "Standard (Free)")
    payment_method = RadioField("Payment Method:", choices = ["Debit Card", "Credit Card"],
        default = "Credit Card")
    submit = SubmitField("Submit")

class OrderForm(FlaskForm):
    order_no = IntegerField("Search by Order Number:", validators=[InputRequired()])
    submit = SubmitField("Submit")

class CatalogForm(FlaskForm):
    name = StringField("Product Name:", validators=[InputRequired()])
    price = FloatField("Product Price:", validators=[InputRequired()])
    description = StringField("Product Description:", validators=[InputRequired()])
    image = StringField("Image Filename:", validators=[InputRequired()])
    submit = SubmitField("Submit")

class Remove_From_Catalog_Form(FlaskForm):
    remove_product = IntegerField("Remove Product ID:", validators=[InputRequired()])
    submit = SubmitField("Submit")

class Update_Price_CatalogForm(FlaskForm):
    tool_id = IntegerField("Product ID:", validators=[InputRequired()])
    updated_price = FloatField("New Product Price:", validators=[InputRequired()])
    submit = SubmitField("Submit")

class ReviewForm(FlaskForm):
    stars = SelectField("Stars out of 5:", validators=[InputRequired()], choices = [0, 1, 2, 3, 4, 5], default = 5)
    review = StringField("Review:", validators=[InputRequired()])
    submit = SubmitField("Submit")