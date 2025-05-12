from flask import Flask, render_template, request, redirect, session, url_for, flash,send_from_directory,jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text,func,not_
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
from geopy.geocoders import Nominatim
import pymysql
from werkzeug.utils import secure_filename
from datetime import datetime,timedelta
import json
import logging
import random
import os
import dotenv
import qrcode
from io import BytesIO
import base64
dotenv.load_dotenv()
app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a strong secret key
UPLOAD_FOLDER ="uploads"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Create the uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
# Allowed extensions for files
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Config SQLAlchemy
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:******@******/TURF_BOOKING"
#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Config Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Use environment variable
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Use environment variable
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')  # Use environment variable
mail = Mail(app)

geolocator = Nominatim(user_agent="turfbooking/1")
# Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(400) ,nullable=False)
    password = db.Column(db.String(1000), nullable=False)
    phone = db.Column(db.String(13), unique=True, nullable=False)
    email = db.Column(db.String(500), unique=True, nullable=False)
    date_added= db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
#manager
class Manager(db.Model):
    _tablename_ = 'manager'  # Explicitly define the table name
    manager_id = db.Column(db.Integer, primary_key=True)
    manager_username = db.Column(db.String(400), unique=True, nullable=False)
    manager_password = db.Column(db.String(1000), nullable=False)
    manager_phone = db.Column(db.String(13), unique=True, nullable=False)
    manager_email = db.Column(db.String(500), unique=True, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    upi_id = db.Column(db.String(100), unique=True, nullable=True)
    
    # Define the relationship to TurfDetails
    turf_details = db.relationship('TurfDetails', backref='manager', lazy=True)

    def set_password(self, manager_password):
        self.manager_password = generate_password_hash(manager_password)

    def check_password(self, manager_password):
        return check_password_hash(self.manager_password, manager_password)

class TurfDetails(db.Model):
    _tablename_ = 'turf_details'  # Explicitly define the table name
    turf_id = db.Column(db.Integer, primary_key=True)
    turf_name = db.Column(db.String(200), nullable=False)
    turf_type = db.Column(db.String(100), nullable=False)
    sport = db.Column(db.String(100), nullable=False)
    turf_quantity = db.Column(db.String(2),nullable=False)
    price = db.Column(db.Float, nullable=False)
    adv_price = db.Column(db.Float, nullable=False)
    pincode = db.Column(db.String(12),nullable=False)
    state = db.Column(db.String(125),nullable=False)
    city = db.Column(db.String(350),nullable=False)
    area = db.Column(db.String(350),nullable=False)
    address = db.Column(db.String(25),nullable=False)
    description = db.Column(db.Text, nullable=True)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    image_file = db.Column(db.String(2000), nullable=True)  # Path to the image file
    video_file = db.Column(db.String(2000), nullable=True)  # Path to the video file
    manager_id = db.Column(db.Integer, db.ForeignKey('manager.manager_id'), nullable=False)  # Foreign key reference
class Payment(db.Model):
    _tablename_ = "payment"
    payment_id =  db.Column(db.Integer, primary_key=True)
    payment_method = db.Column(db.String(100),nullable=True)
    turf_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Integer,nullable=False)
    date = db.Column(db.Date, nullable=False)
    payment_proof = db.Column(db.String(2000), nullable=False)
    slots = db.Column(db.JSON, nullable=True)


class Reviews(db.Model):
    _tablename_= 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    turf_id = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(500),nullable=False)
    rating = db.Column(db.Numeric(5,1),nullable=True)




class BookingSlot(db.Model):
    _tablename_ = 'booking_slots'
    id = db.Column(db.Integer, primary_key=True)
    turf_id = db.Column(db.Integer, db.ForeignKey('turf_details.turf_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    slot_number = db.Column(db.Integer, nullable=False)  # 0-9 for 10 slots
    is_booked = db.Column(db.Boolean, default=False)
    turf = db.relationship('TurfDetails', backref='booking_slots')




#initalization booking slots
def initialize_booking_slots():
    today = datetime.now().date()
    turfs = TurfDetails.query.all()
    previous_day = today - timedelta(days=1)
    BookingSlot.query.filter(BookingSlot.date == previous_day).delete()
    for turf in turfs:
        for i in range(5):  
            date = today + timedelta(days=i)
            existing_slots = BookingSlot.query.filter_by(turf_id=turf.turf_id, date=date).all()
            if not existing_slots:
                for slot_number in range(10):  
                    new_slot = BookingSlot(turf_id=turf.turf_id, date=date, slot_number=slot_number, is_booked=False)
                    db.session.add(new_slot)
    db.session.commit()  


@app.route("/",methods=['POST','GET'])
def home():
    if request.method == 'POST':
        if 'login_as_user'in request.form:
            return redirect(url_for('login'))
        elif 'login_as_manager'in request.form:
            return redirect(url_for('manager_login'))
        else:
            return render_template("home.html")
    return render_template("home.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            session['username'] = user.username
            session['email'] = user.email
            session['phone'] = user.phone
            return redirect(url_for('dashboard'))
        flash("Invalid username or password.", "error")
    return render_template("login.html")
@app.route("/manager_login", methods=["GET", "POST"])
def manager_login():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']
        managers = Manager.query.filter_by(manager_username=username).first()
        if managers and managers.check_password(password):
            session['username'] = managers.manager_username
            session['email'] = managers.manager_email
            session['phone'] = managers.manager_phone
            return redirect(url_for('manager_dashboard'))
        flash("Invalid username or password.", "error")
    return render_template("manager_login.html")
@app.route('/update_location', methods=['POST'])
def update_location():
    data = request.get_json()
    session['latitude'] = data['latitude']
    session['longitude'] = data['longitude']
    return redirect(url_for('dashboard'))

@app.route("/user_register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form['username']
        email = request.form['email']
        phone = request.form['phone']
        existing_user = User.query.filter((User .username == username) | (User .email == email)).first()
        if existing_user:
            if existing_user.username == username:
                flash("Username already exists. Please choose a different one.", "error")
            if existing_user.email == email:
                flash("Email already exists. Please use a different email.", "error")
            return render_template("register.html")
        
        otp = random.randint(100000, 999999)
        session['otp'] = otp
        session['username'] = username
        session['email'] = email
        session['phone'] = phone
        try:
            msg = Message('Your OTP Code', sender=os.getenv('MAIL_USERNAME'), recipients=[email])
            msg.body = f'Your OTP code is {otp}'
            mail.send(msg)
            flash("OTP sent to your email. Please check your inbox.", "success")
            return redirect(url_for('verify_otp'))# Render OTP verification page
        except Exception as e:
            logging.error(f"Error sending email: {e}")
            flash("An error occurred while sending the OTP. Please try again.", "error")
            return render_template("register.html")
    return render_template("register.html")
@app.route("/manager_register", methods=["GET", "POST"])
def manager_register():
    if request.method == "POST":
        manager_username = request.form['manager_username']
        manager_email = request.form['manager_email']
        manager_phone = request.form['manager_phone']
        existing_manager= Manager.query.filter((Manager .manager_username== manager_username) | (Manager .manager_email == manager_email)).first()
        if existing_manager:
            if existing_manager.manager_username == manager_username:
                flash("Username already exists. Please choose a different one.", "error")
            if existing_manager.manager_username == manager_email:
                flash("Email already exists. Please use a different email.", "error")
            return render_template("manager_register.html")
        
        otp = random.randint(100000, 999999)
        session['otp'] = otp
        session['username'] = manager_username
        session['email'] = manager_email
        session['phone'] = manager_phone
        try:
            msg = Message('Your OTP Code', sender=os.getenv('MAIL_USERNAME'), recipients=[manager_email])
            msg.body = f'Your OTP code is as manager {otp}'
            mail.send(msg)
            flash("OTP sent to your email. Please check your inbox.", "success")
            return redirect(url_for('manager_verify_otp'))# Render OTP verification page
        except Exception as e:
            logging.error(f"Error sending email: {e}")
            flash("An error occurred while sending the OTP. Please try again.", "error")
            return render_template("manager_register.html")
    return render_template("manager_register.html")

@app.route("/verify_otp", methods=["GET", "POST"])
def verify_otp():
    if request.method == "POST":
        entered_otp = request.form.get('otps')
        if str(session.get('otp')) == entered_otp:
            return redirect(url_for('password'))  # Render password page if OTP is valid
        else:
            flash("Invalid OTP. Please try again.", "error")
    return render_template("verify_otp.html")  # Render OTP verification page
@app.route("/manager_verify_otp", methods=["GET", "POST"])
def manager_verify_otp():
    if request.method == "POST":
        entered_otp = request.form.get('otps')
        if str(session.get('otp')) == entered_otp:
            return redirect(url_for('manager_password'))  # Render password page if OTP is valid
        else:
            flash("Invalid OTP. Please try again.", "error")
    return render_template("manager_verify_otp.html")  # Render OTP verification page

@app.route("/password", methods=["GET", "POST"])
def password():
    if request.method == "POST":
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        if password == confirm_password:
            new_user = User(username=session['username'], email=session['email'], phone=session['phone'])
            new_user.set_password(password)
            try:
                db.session.add(new_user)
                db.session.commit()
                flash("Registration successful! You can now log in.", "success")
                return redirect(url_for('login'))
            except Exception as e:
                logging.error(f"Error occurred: {e}")
                flash("An error occurred while registering.", "error")
                return render_template("password.html")
        else:
            flash("Passwords do not match. Please try again.", "error")
            return render_template('password.html')
    return render_template('password.html')
@app.route("/manager_password", methods=["GET", "POST"])
def manager_password():
    if request.method == "POST":
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        if password == confirm_password:
            new_manager = Manager(
                manager_username=session['username'],
                manager_email=session['email'],
                manager_phone=session['phone']
            )
            new_manager.set_password(password)  # Hash the password
            try:
                db.session.add(new_manager)
                db.session.commit()
                flash("Registration successful! You can now log in.", "success")
                return redirect(url_for('manager_login'))  # Redirect to manager login
            except Exception as e:
                logging.error(f"Error occurred: {e}")
                flash("An error occurred while registering.", "error")
                return render_template("manager_password.html")
        else:
            flash("Passwords do not match. Please try again.", "error")
            return render_template('manager_password.html')
    return render_template('manager_password.html')
@app.route("/dashboard")
def dashboard():
    if "username" in session:
        latitude = session.get('latitude')
        longitude = session.get('longitude')
        if latitude and longitude:
            print(latitude)
            print(longitude)
            location = geolocator.reverse((latitude, longitude), language='en')
            print(location.address)
            address_details = location.raw.get('address', {})
            suburb = address_details.get('suburb', 'Suburb not found')
            city = address_details.get('city', 'City not found')
            state = address_details.get('state', 'State not found')
            country = address_details.get('country', 'Country not found')
            neighborhood = address_details.get('neighborhood', 'Neighborhood not found')
            print(neighborhood)
            if suburb != 'Suburb not found':
                suburb_name = suburb.split()[-1]  # Get the last part of the suburb
                print("Suburb Name:", suburb_name)
                turfs = TurfDetails.query.filter_by(area='royapuram').all()
                reviews = Reviews.query.filter_by().all()
                user = User.query.filter_by(username=session['username'], email=session['email']  ).first()
                session['id'] = user.id  # Assuming 'user' is the logged-in user objec
            return render_template("dashboard.html", username=session['username'],user_id=session['id'], email=session['email'],turfs=turfs, reviews=reviews)
        else:
            print("no location")
            reviews = Reviews.query.filter_by().all()
            turfs = TurfDetails.query.all()
            user = User.query.filter_by(username=session['username'], email=session['email']  ).first()
            session['id'] = user.id  # Assuming 'user' is the logged-in user objec
            return render_template("dashboard.html", username=session['username'],user_id=session['id'], email=session['email'],turfs=turfs, reviews=reviews)
    return redirect(url_for('home'))
@app.route("/manager_dashboard")
def manager_dashboard():
    if "username" in session:
        manager = Manager.query.filter_by(manager_username=session['username']).first()
        if manager:
            turfsm= TurfDetails.query.filter_by(manager_id=manager.manager_id).all()
            return render_template("manager_dashboard.html", username=session['username'], email=session['email'], phone=session['phone'],turfsm=turfsm)
    return redirect(url_for('home'))

@app.route("/add_turf", methods=["GET", "POST"])
def add_turf():
    # Check if the manager is logged in
    if "username" not in session:
        flash("You need to be logged in to add a turf.", "danger")
        return redirect(url_for('manager_login'))  # Redirect to manager login if not logged in
    # Retrieve the manager based on the session username
    # *Highlight: Ensure we retrieve the manager object using the session username*
    manager = Manager.query.filter_by(manager_username=session['username']).first()
    
    if request.method == "POST":
        turf_name = request.form.get('turf_name')
        turf_type = request.form.get('turf_type')
        sport = request.form.get('sport')
        turf_quantity = request.form.get('turf_quantity')
        price = request.form.get('price')
        adv_price = request.form.get('adv_price')
        pincode = request.form.get('pincode')
        state = request.form.get('state')
        city = request.form.get('city')
        address = request.form.get('address')
        description = request.form.get('description', '')
        

        # Validate required fields
        if not turf_name or not address or not price:
            flash("Turf name, location, and price are required.", "danger")
            return render_template("add_turf.html")

        # Convert price to float and validate
        try:
            price = float(price)
            adv_price = float(adv_price)
        except ValueError:
            flash("Price must be a valid number.", "danger")
            return render_template("add_turf.html")
        # Handle image and video file uploads
        image_file = request.files.get('image_file')
        video_file = request.files.get('video_file')
        image_path = ''
        video_path = ''
        # Save image file if it exists and is allowed
        if image_file and allowed_file(image_file.filename):
            image_filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            try:
                image_file.save(image_path)  # Save the file to the specified path
            except Exception as e:
                flash("An error occurred while saving the image file.", "error")
                logging.error(f"Image upload error: {e}")
                return render_template("add_turf.html")
        # Save video file if it exists and is allowed
        if video_file and allowed_file(video_file.filename):
            video_filename = secure_filename(video_file.filename)
            video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
            video_file.save(video_path)  # Save the file to the specified path

        # Create a new TurfDetails object
        new_turf = TurfDetails(
            turf_name=turf_name,
            turf_type=turf_type,
            sport=sport,
            turf_quantity=turf_quantity,
            price=price,
            adv_price=adv_price,
            pincode=pincode,
            state=state,
            city=city,
            address=address,
            description=description,
            image_file=image_path,
            video_file=video_path,
            area = 'royapuram',
            manager_id=manager.manager_id  
        )

        try:
            db.session.add(new_turf)
            db.session.commit()
            flash("Turf added successfully!", "success")
            return redirect(url_for('manager_dashboard'))  
        except Exception as e:
            db.session.rollback() 
            print('add error')
            flash("An error occurred while adding the turf. Please try again.", "error")
            return render_template("add_turf.html") 
    return render_template("add_turf.html")

@app.route("/view_turfs", methods=["GET"])
def view_turfs():
    turfs = TurfDetails.query.all()
    return render_template("view_turfs.html", turfs=turfs)
@app.route('/uploadpayp', methods=['POST'])
def upload_payment_proof():
    manager_id = request.form.get('manager_id')
    date = request.form.get('date')
    turf_id = request.form.get('turf_id')
    amt = request.form.get('price')
    type = request.form.get('paymenttype')
    slots = request.form.get('slots')
    if 'file' not in request.files:
        return 'No file part', 400 
    file = request.files['file'] 
    if file.filename == '':
        return 'No selected file', 400 
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    print("hii")
    print(manager_id)
    slots_list = slots.split(',') 
    slots_json = json.dumps(slots_list)
    print(slots_json)
    new_payment=Payment(turf_id=turf_id,
                        payment_method=type,
                        amount=amt,
                        date=date,
                        slots=slots_json,
                        payment_proof=file_path
                        )
    try:
        db.session.add(new_payment)
        db.session.commit()
        print("suuseessee")
        msg="sussfulll"
        flash("Turf added successfully!", "success")
        return jsonify("good")

    except Exception as e:
        db.session.rollback()  
        flash("An error occurred while adding the turf. Please try again.", "error")
        return render_template("add_turf.html") 
@app.route('/<int:turf_id>/<date>', methods=['GET'])
def get_slots(turf_id, date):
    print('Fetching slots...')
    date = datetime.strptime(date, '%Y-%m-%d').date()
    print(date)
    slots = BookingSlot.query.filter_by(turf_id=turf_id, date=date).all()
    print(slots)  
    if not slots:  # This checks if the list is empty
        return jsonify({"error": "No slots available for this date."}), 404
    # Prepare the response data
    slots_data = [{"slot_number": slot.slot_number, "is_booked": slot.is_booked} for slot in slots]
    return jsonify(slots_data)
@app.route('/qrcode/<float:price>/<int:manager_id>', methods=['POST'])
def generate_qrcode(price,manager_id):
    print(price)
    print(manager_id)
    qr1 =Manager.query.filter_by(manager_id=manager_id).first()
    currency = "INR"
    transaction_note = "your turf booking"
    upi_id = "sivinash@okcici"
    name=qr1.manager_username
    upi_uri = f"upi://pay?pa={upi_id}&pn={name}&am={price}&cu={currency}&tn={transaction_note}"
    qr = qrcode.QRCode(version=1, box_size=6, border=2)
    qr.add_data(upi_uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color='black', back_color='white')
    # Convert image to base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return jsonify({'qr_code':img_str,'amount': price,'manager_id': manager_id,'name':name })
@app.route('/searching',methods=["POST"])
def searching():
    st="astro turf"
    print('searching.....')
    turf = TurfDetails.query.filter((TurfDetails.turf_name == st) | (TurfDetails.area == st)).all()
    print(turf)
    reviews = Reviews.query.filter(Reviews.turf_id.in_([turf.turf_id for turf in turf])).all()
    user = User.query.filter_by(username=session.get('username'), email=session.get('email')).first()
    if user:
        session['id'] = user.id  # Store user ID in session
        return render_template("searching.html", username=session['username'], user_id=session['id'], email=session['email'], turfs=turf, reviews=reviews)
    else:
        return render_template("searching.html", turfs=turf, reviews=reviews)  # Adjust as needed
@app.route('/book/<date>/<int:turf_id>/<int:slot_number>', methods=['POST'])
def book(date, turf_id, slot_number):
    print(date,turf_id)
    # Parse the date from the URL
    date = datetime.strptime(date, '%Y-%m-%d').date()
    # Check if the slot exists in the database
    slot = BookingSlot.query.filter_by(turf_id=turf_id, date=date, slot_number=slot_number).first()
    print(slot)
    print(slot.is_booked)
    if slot is None:
        return jsonify({"success": False, "message": "Invalid date or turf ID."}), 400
    if slot.is_booked:
        return jsonify({"success": False, "message": "Slot already booked."}), 400
    # Mark the slot as booke
    slot.is_booked = True
    db.session.commit()  # Commit the changes to the database
    return jsonify({"success": True, "message": "Slot booked successfully."}), 200

@app.route('/get_star/<int:turf_id>',  methods=['GET'])
def get_star(turf_id):
    print('starworking')
    a ="null"
    count = Reviews.query.filter_by(turf_id=turf_id).filter(Reviews.rating.isnot(None)).count()
    # Sum the ratings for the given turf_id
    total_rating = Reviews.query.filter_by(turf_id=turf_id).with_entities(func.sum(Reviews.rating)).scalar() or 0
    # Calculate the average rating if there are any reviews
    if count > 0:
        average_rating = total_rating / count
    else:
        average_rating = 0  # or None, depending on your preferenc
    return jsonify({"turf_id": turf_id, "rating": average_rating}), 200
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
@app.route('/reviewing',methods=['POST'])
def reviewing():
    turf_id = request.form.get('turf')
    user_id = request.form.get('user')
    review = request.form.get('review')
    print("revienig")

    newreview = Reviews (
        turf_id=turf_id,
        user_id=user_id,
        review=review
    )
    db.session.add(newreview)
    db.session.commit()
    return jsonify({"turf_id": turf_id,"user_id": user_id, "message": "Slot booked successfully."}), 200
@app.route("/ratingstar", methods=['POST'])
def rating():
    turf_id = request.form.get('turfid')
    user_id = request.form.get('userid')
    rating = request.form.get('star-radio')
    print(rating)
    ratingstar = Reviews.query.filter_by(turf_id=turf_id, user_id=user_id).first()
    print(ratingstar)
    ratingstar.rating=rating
    db.session.commit()
    return jsonify({"success": True, "message": "Slot booked successfully."}), 200

@app.route("/logout")
def logout():
    session.pop('username', None)
    session.pop('email', None)
    session.pop('phone', None)
    return redirect(url_for('home'))


if __name__ == '__main__':
    with app.app_context():  # Create an application context
        # Test the database connection
        try:
            # Use the session to execute a simple query with text()
            db.session.execute(text("SELECT 1"))  # Test the connection
            print("Database connection successful.")
            initialize_booking_slots()
        except Exception as e:
            logging.error(f"Database connection error: {e}")
            print("Database connection failed. Check your database settings.")

        db.create_all()  # Create the database tables
    app.run(debug=True)