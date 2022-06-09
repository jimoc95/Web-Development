""" 
My page has two types of users: regular ones and administrators.
Choose register on the main page to register as a regular user or choose Admin Login to login as an admin with the username and password below.
admin id: jfk
password: cawd
- Admin can see stock page and decrease or increase the stock of any item in the catalog - stock qty can't go lower than zero.
- Admin can go to the catalog and add a new item by inputting the image filename (I have added two images to the static folder to demonstrate this feature - spanner_set.jpg and nuts_and_bolts.jpg) product name, price and description.
- Once a new product has been added to the catalog the "Our Tools" page will be automatically updated adding this product and users will be able to add it to their cart.
- Admin can also remove a product using the Product ID or change the price of a product using the Product ID in the Catalog page.
- Admin can see all of the orders that have been placed by users and search for them by the order number.
- Logged in users can leave reviews on the individual pages of the tools in the "Our Tools" page (click on see details to get to individual pages for tools). Admin cannot leave reviews.
- Logged in users can add products to their cart and remove them from their cart.
- On checkout they will be given a total for the order and then have the option of selecting standard or next-day delivery.(extra cost for next-day which is reflected in the total on the orders page).
- Once a user has checked out, the stock page will be updated automatically reflecting the new stock level of products they have purchased.
- Logged in users can also see the orders they have made in the past."""


from flask import Flask, render_template, redirect, url_for, session, g, request
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import RegistrationForm, LoginForm, Admin_LoginForm, CheckoutForm, OrderForm, CatalogForm, Remove_From_Catalog_Form, Update_Price_CatalogForm, ReviewForm
from functools import wraps

app = Flask(__name__)
app.teardown_appcontext(close_db)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False     # We are using in-memory cookies - normally used for sessions, if I close my browser the sessions will be gone.
app.config["SESSION_TYPE"] = "filesystem"
Session(app) 

@app.before_request             # special decorator - function that will be automatically called at the beginning of every route
def load_logged_in_user():      
    g.user = session.get("user_id", None)   # goes to the session and sees if your user_id is stored in the session - if it is it stores it in g.user, if it isn't it stores None in g.user
    g.admin = session.get("admin_id", None)                                      # g stands for global - can be used anywhere in the program - we don't have to pass it in - we can use it in the jinja without having to pass it in eg. g=g

def user_login_required(view):       # creates a new type of decorator called login_required - put at the beginning of routes which the user has to be logged in to run.
    @wraps(view)                # These two lines are all part of how we create the new decorator.
    def wrapped_view(**kwargs):
        if g.user is None:      # working out whether you are logged in or not
            return redirect(url_for("login", next=request.url))   # if you are not we send you to the login page - or the page that you were requesting before you logged in
        return view(**kwargs)
    return wrapped_view

def admin_login_required(view):       # creates a new type of decorator called login_required - put at the beginning of routes which the user has to be logged in to run.
    @wraps(view)                # These two lines are all part of how we create the new decorator.
    def wrapped_view(**kwargs):
        if g.admin is None:      # working out whether you are logged in or not
            return redirect(url_for("admin_login", next=request.url))   # if you are not we send you to the login page - or the page that you were requesting before you logged in
        return view(**kwargs)
    return wrapped_view

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data         # We get the new users data from the LoginForm
        password = form.password.data
        db = get_db()                       # We then connect to our database and see if there is a user with that user_id
        matching_user = db.execute("""SELECT * FROM users
                                            WHERE user_id = ?;""", (user_id,)).fetchone()
        if matching_user is None:                                          # If there is not a user with that user id we display an error message
            form.user_id.errors.append("Unknown user id!")
        elif not check_password_hash(matching_user["password"], password): # We want to check that the password for that user in the database (which has been disguised) is the same as the password that you typed into the form - check_password_hash will compare the two passwords even though one of them has been disguised 
            form.password.errors.append("Incorrect password")              # If the passwords don't match we add an error message to our form
        else:               # if we reach this else your user_id is known (in the database) and your password is correct - if this happens we are going to log you in and we need to remember this fact fro the duration of the conversation.
            session.clear() # We are going to start off with an empty session store because this is going to be a new conversation
            session["user_id"] = user_id    # presence of your user_id in this dictionary means that you are logged in, the absence of your user_id in this dictionary means you are not logged in.
            next_page = request.args.get("next")    # this piece of code is getting the url for where you were trying to get to  before we took you to the login page.
            if not next_page:                       # after login you don't go back to the index as before you go back to the page that you were trying to get to before.
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form)

@app.route("/admin_login", methods=["GET", "POST"])
def admin_login():
    form = Admin_LoginForm()
    if form.validate_on_submit():
        admin_id = form.admin_id.data           # We get the admins data from the RegistrationForm
        password = form.password.data
        db = get_db()                           # We then connect to our database and see if there is already an admin with that admin_id
        matching_admin = db.execute("""SELECT * FROM admin
                                       WHERE admin_id = ?;""", (admin_id,)).fetchone()
        if matching_admin is None:                               # If there is no admin with that admin_id we display an error message
            form.admin_id.errors.append("Unknown admin id!")
        elif matching_admin["password"] != password:             # We want to check that the password for that user in the database (which has been disguised) is the same as the password that you typed into the form - check_password_hash will compare the two passwords even though one of them has been disguised 
            form.password.errors.append("Incorrect password")    # If the passwords don't match we add an error message to our form
        else:                   # if we reach this else your admin_id is known (in the database) and your password is correct - if this happens we are going to log you in and we need to remember this fact fro the duration of the conversation.
            session.clear()     # We are going to start off with an empty session store because this is going to be a new conversation
            session["admin_id"] = admin_id                       # presence of your admin_id in this dictionary means that you are logged in, the absence of your admin_id in this dictionary means you are not logged in.
            next_page = request.args.get("next")    # this piece of code is getting the url for where you were trying to get to  before we took you to the login page.
            if not next_page:                       # after login you don't go back to the index as before you go back to the page that you were trying to get to before.
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("admin_login.html", form=form)

@app.route("/logout")
def logout():
    session.clear()     # if you are logged in your user_id/ admin_id will be stored in the session store - When we want to log you out we just clear the session store - your user_id is no longer there so you are logged out.
    return redirect( url_for("index"))

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_id = form.user_id.data         # We get the new users data from the RegistrationForm
        password = form.password.data
        password2 = form.password2.data
        db = get_db()                       # We then connect to our database and see if there is already a user with that user_id
        possible_clashing_user = db.execute("""SELECT * FROM users
                                            WHERE user_id = ?;""", (user_id,)).fetchone()
        if possible_clashing_user is not None:  # If there is already a user with that user id we display an error message
            form.user_id.errors.append("User id already taken!")
        else:                                   # Otherwise we insert the users user_id and password into the database
            db.execute("""INSERT INTO users (user_id, password) 
                        VALUES (?, ?);""", (user_id, generate_password_hash(password)))
            db.commit()
            return redirect( url_for("login") )  # Once we have registered a new user we redirect them to the login page so that they can login
    return render_template("register.html", form=form)

@app.route("/tools") # Gives us all the tools in the database
def tools():
    db = get_db()
    tools = db.execute("""SELECT * FROM tools;""").fetchall()   # fetches all the tools from the database -> returned as dictionaries "tools", these are passed to the jinja
    return render_template("tools.html", tools=tools)

@app.route("/tool/<int:tool_id>", methods=["GET", "POST"])   # /tool will display information about one particular tool. We are giving it the tool_id that we are interested in. 
def tool(tool_id):
    db = get_db()
    tool = db.execute("""SELECT * FROM tools
                         WHERE tool_id = ?;""", (tool_id,)).fetchone()   # Here we use fetchone because we are getting back one dictionary and not a list of dictionaries as above.
    reviews = db.execute("""SELECT * FROM reviews
                            WHERE tool_id = ?;""", (tool_id,)).fetchall()
    form = ReviewForm()
    if form.validate_on_submit() and "user_id" in session:
        stars = form.stars.data
        review = form.review.data                                        # We get the review dat that the user has inputted into the form and insert it into the review database.
        user_id = session["user_id"]
        db.execute("""INSERT INTO reviews (tool_id, user_id, stars, review)        
                      VALUES (?, ?, ?, ?);""", (tool_id, user_id, stars, review))
        db.commit()
        return redirect (url_for("tools"))                                 # Once you have added a review we redirect you to the tools page
    elif form.validate_on_submit() and "user_id" not in session:           # Otherwise if you have submitted a form but you are not logged in we display an error message
        form.review.errors.append("You must be logged in to leave a review!")
    return render_template("tool.html", tool=tool, form=form, reviews=reviews)

@app.route("/cart")
@user_login_required                 # from the decorator that we made above - now we are saying you can only run this route if you are logged in otherwise you will be send to the login page.
def cart():
    if "cart" not in session:   # check to see if there is a "cart" key in the session dictionary
        session["cart"] = {}    # if not create a "cart" key who's value is an empty dictionary
    names = {}                  # create an empty dictionary called names
    prices = {}
    db = get_db()
    total = 0
    for tool_id in session["cart"]:
        tool = db.execute("""SELECT * FROM tools
                             WHERE tool_id = ?;""", (tool_id,)).fetchone()
        name = tool["name"]         # We created an empty dictionary (names and prices) which we are going to display the contents of in the jinja
        names[tool_id] = name       # We put the names of these tools as the value at the of the key tool_id
        price = tool["price"]
        prices[tool_id] = price
        total = total + prices[tool_id]     # total is added to everytime we go through another tool in the loop
    return render_template("cart.html", cart=session["cart"], names=names, prices=prices)   # display the contents of your cart

@app.route("/add_to_cart/<int:tool_id>")
@user_login_required
def add_to_cart(tool_id):
    if "cart" not in session:                               # check to see if there is a "cart" key in the session dictionary
        session["cart"] = {}                                # if not create a "cart" key who's value is an empty dictionary
    if tool_id not in session["cart"]:                      # check to see if you have already ordered this tool - we go to the dictionary and see if tool_id is already in the dictionary
        session["cart"][tool_id] = 0                        # If it is not in the dictionary then we will put in in the dictionary, but with a value of 0 - if the tool_id is already there we don't change your shopping cart, if its not here we put it in with a zero
    session["cart"][tool_id] = session["cart"][tool_id] + 1 # If the tool is already in the cart we add 1 to the value of the key (tool_id) in the "cart" dictionary
    return redirect( url_for("cart"))                       # Rather than rendering a template, I am redirecting you to another route - the cart route so that you can see what is in your cart.

@app.route("/remove_from_cart/<int:tool_id>")
@user_login_required
def remove_from_cart(tool_id):
    if "cart" not in session:   
        session["cart"] = {}
        return "There is nothing in your cart!"   
    if tool_id in session["cart"] and session["cart"][tool_id] > 1:      # if there is more than one of that tool tool in the cart decrease the quantity by 1
        session["cart"][tool_id] = session["cart"][tool_id] - 1
    elif session["cart"][tool_id] <= 1:                                  # if there is less than 1 of those tools in the cart delete that tool from the cart dictionary in the session
        del session["cart"][tool_id]
    return redirect( url_for("cart") )

@app.route("/checkout", methods=["GET", "POST"])
@user_login_required
def checkout():
    if "cart" not in session:   
        session["cart"] = {}
        return "There is nothing in your cart!" 
    if session["cart"] == {}:
        return "There is nothing in your cart!" 
    names = {}                  # create empty dictionaries called names and prices
    prices = {}
    db = get_db()
    total = 0                   # initialize total at zero so we can add to it
    for tool_id in session["cart"]:
        tool = db.execute("""SELECT * FROM tools
                             WHERE tool_id = ?;""", (tool_id,)).fetchone()
        name = tool["name"] # get the value for the name key in the tool dictionary (name of each tool) for each tool_id in the session cart
        names[tool_id] = name   # put the name as the value for the key tool_id inside the new dictionary we created - names 
        price = tool["price"]
        prices[tool_id] = price
        total = total + (prices[tool_id] * session["cart"][tool_id]) # the checkout total the value for the tool_id in the dictionary we created called prices multiplied by the value for the tool_id inside the cart, inside the session which is the quantity ordered.
        total = round(total, 2) # round the total to be placed in checkout page to 2 decimal places
    form = CheckoutForm()
    if form.validate_on_submit():
        customer_name = form.customer_name.data
        delivery_address = form.delivery_address.data
        delivery_method = form.delivery_method.data
        payment_method = form.payment_method.data
        if delivery_method == "Next Day (+ €5.99)": # if next day delivery was selected at checkout - add  €5.99 to the total. 
            total = total + 5.99
            total = round(total, 2)
        items = ""
        user_id = session["user_id"]
        for tool_id in session["cart"]:
            items = items + " " + names[tool_id] + " " + "x" + " " + str(session["cart"][tool_id]) + "," + " "  # concatenate the tools ordered so that they appear in one line in the orders page
        db = get_db() 
        db.execute("""INSERT INTO orders (user_id, name, total, customer_name, delivery_address, delivery_method, payment_method)
                      VALUES (?, ?, ?, ?, ?, ?, ?);""", (user_id, items[:-2], total, customer_name, delivery_address, delivery_method, payment_method))
        db.commit()
        # Decrease the stock_qty in the stock table by the quantity of each tool_id in the cart
        db.execute("""UPDATE stock                  
                      SET stock_qty = (stock_qty - ?)
                      WHERE tool_id = ?;""", (session["cart"][tool_id], tool_id))
        db.commit()
        session["cart"] = {}     # clear the cart once the items have been added to the orders database.
        
        return render_template("order_confirmation.html", customer_name=customer_name)  
    return render_template("checkout.html", cart=session["cart"], names=names, prices=prices, total=total, form=form)

@app.route("/orders", methods=["GET", "POST"])
@admin_login_required
def orders(): 
    """
    function which queries all of the contents of the orders database which is populated from the checkout route
    and allows you to search (query) the database using the order_id
    """
    form=OrderForm()
    db=get_db()
    orders = db.execute("""SELECT * FROM orders;""").fetchall()
    if form.validate_on_submit():       # if the form validates we get the order number from the form and query the database
        order_no = form.order_no.data                       
        db = get_db()
        no_orders = db.execute("""SELECT * FROM orders
                               WHERE order_id = ?;""",(order_no,)).fetchone()
        if no_orders == None:
            form.order_no.errors.append("order number does not exist!") # if the order number entered isn't in the database we leave an error message
        else:
            orders = db.execute("""SELECT * FROM orders
                                   WHERE order_id = ?;""",(order_no,)).fetchall()
    return render_template("orders.html", orders=orders, form=form)

@app.route("/stock")
@admin_login_required
def stock():
    db = get_db()
    stocks = db.execute("""SELECT * FROM stock;""").fetchall()
    return render_template("stock.html", stocks=stocks,)

@app.route("/increment_stock/<int:tool_id>")
@admin_login_required
def increment_stock(tool_id):
    '''
    function which increases the stock_qty of the chosen tool by 1
    tool_id - int from tools database
    returns - stock.html containing updated contents of stock database
    '''
    db = get_db()                                       # update stock table by adding 1 to the stock qty where at that tool_id
    db.execute("""UPDATE stock                              
                  SET stock_qty = stock_qty + 1
                  WHERE tool_id = ?;""", (tool_id,))
    db.commit()
    return redirect( url_for("stock") )                 

@app.route("/decrement_stock/<int:tool_id>")
@admin_login_required
def decrement_stock(tool_id):
    '''
    function which decreases the stock_qty of the chosen tool by 1
    tool_id - int from tools database
    returns - stock.html containing updated contents of stock database
    '''
    db = get_db()
    db.execute("""UPDATE stock
                  SET stock_qty = stock_qty - 1
                  WHERE tool_id = ?
                  AND stock_qty > 0;""", (tool_id,))
    db.commit()
    return redirect( url_for("stock") )

@app.route("/catalog", methods=["GET", "POST"])
@admin_login_required
def catalog():                                  # create 3 different forms to add products to the catalog, update the price and remove a product from the catalog using the tool_id inputted by admin
    db = get_db()
    catalogs = db.execute("""SELECT * FROM tools;""").fetchall()
    form=Update_Price_CatalogForm()
    add_form=CatalogForm()
    remove_form=Remove_From_Catalog_Form()
    if add_form.validate_on_submit():
        name = add_form.name.data
        price = add_form.price.data
        description = add_form.description.data
        image = add_form.image.data
        db = get_db()
        db.execute("""INSERT INTO tools (image, name, price, description)
                      VALUES (?, ?, ?, ?);""", (image, name, price, description)) 
        db.commit()
        return redirect( url_for("catalog") )

    elif remove_form.validate_on_submit():
        remove_product = remove_form.remove_product.data
        db = get_db()
        db.execute("""DELETE FROM tools
                  WHERE tool_id = ?;""", (remove_product,))     # Delete the tool from the database where the tool_id is equal to the product number entered admin
        db.commit()
        return redirect( url_for("catalog") )
    elif form.validate_on_submit():
        tool_id = form.tool_id.data
        updated_price = form.updated_price.data
        db = get_db()
        db.execute("""UPDATE tools 
                      SET price = ?
                      WHERE tool_id = ?;""", (updated_price, tool_id))  # Update the price in the database where the tool_id is the product number entered by admin
        db.commit()
        return redirect( url_for("catalog") )
    return render_template("catalog.html", catalogs=catalogs, form=form, add_form=add_form, remove_form=remove_form)

@app.route("/user_past_orders")
@user_login_required
def user_past_orders():
    user_id = session["user_id"]    # get the user_id of the user logged in from the user_id dictionary in the session
    db = get_db()                   # get all the orders where the user_id is equal to that user_id 
    past_orders = db.execute("""SELECT * FROM orders
                                WHERE user_id = ?;""", (user_id,)).fetchall()
    return render_template("past_orders.html", past_orders=past_orders)


