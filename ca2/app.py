
from flask import Flask, render_template, redirect, url_for, session, g, request
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import RegistrationForm, LoginForm
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

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/game")
def game():
    return render_template("game.html")

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

@app.route("/leaderboard")
def leaderboard(): 
    """
    function which queries all of the contents of the orders database which is populated from the checkout route
    and allows you to search (query) the database using the order_id
    """
    db=get_db()
    leaderboard = db.execute("""SELECT * FROM leaderboard;""").fetchall()
    return render_template("leaderboard.html", leaderboard=leaderboard)
               

# @app.route("/user_past_scores")
# @user_login_required
# def user_past_scores():
#     user_id = session["user_id"]    # get the user_id of the user logged in from the user_id dictionary in the session
#     db = get_db()                   # get all the orders where the user_id is equal to that user_id 
#     past_scores = db.execute("""SELECT * FROM leaderboard
#                                 WHERE user_id = ?;""", (user_id,)).fetchall()
#     return render_template("past_orders.html", past_scores=past_scores)

@app.route("/store_score", methods=["POST"])
def store_score():
    score = int(request.form["score"])    # get the user_id of the user logged in from the user_id dictionary in the session
    db = get_db()
    db.execute(""" INSERT INTO users (score)
                    VALUES (?);""", (score,))
    db.commit()
    return "success"