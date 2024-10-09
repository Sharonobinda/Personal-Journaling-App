from flask import Flask, request, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required,get_jwt, get_jwt_identity
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from datetime import timedelta, datetime
from models import db, User, JournalEntry
import random, os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

postgres_pwd = os.getenv("POSTGRES_PWD")

#print(postgres_pwd)

app = Flask(__name__)

# Configurations
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://journal_db_wep0_user:{postgres_pwd}"
#"sqlite:///journaling.db"
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['JWT_SECRET_KEY'] = 'jwtsecretkey'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=72)
app.config['MAIL_SERVER']='sandbox.smtp.mailtrap.io'
app.config['MAIL_PORT'] = 2525
app.config['MAIL_USERNAME'] = '30a47e766060e3'
app.config['MAIL_PASSWORD'] = '89e8b686d89773'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = 'obindasharon6@gmail.com'


with app.app_context():
    # Serializer for generating secure tokens
    s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Initialize extensions
jwt = JWTManager(app)
CORS(app)
migrate = Migrate(app, db)
db.init_app(app)
bcrypt = Bcrypt(app)
mail = Mail(app)

# User Registration
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Validate username
    username = data.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    # Validate email
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    # Validate password
    password = data.get('password')
    if not password:
        return jsonify({"error": "Password is required"}), 400

    # Hash the password with bcrypt
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create the new user
    new_user = User(
        username=username,
        email=email,
        password=hashed_password
    )

    # Add user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# User Login
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if user:
        try:
            if bcrypt.check_password_hash(user.password, password):
                access_token = create_access_token(identity=user.id)
                return jsonify({"access_token": access_token}), 200
            else:
                return jsonify({"error": "Wrong credentials"}), 401
        except ValueError as e:
            print(f"Error verifying password hash: {e}")
            return jsonify({"error": "Internal server error"}), 500
    else:
        return jsonify({"error": "User not found"}), 404

# Fetch Current User
@app.route('/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        # You can add other fields as needed
    }

    return jsonify(user_data), 200


# Create Journal Entry
@app.route('/journal', methods=['POST'])
@jwt_required()
def create_journal():
    user_id = get_jwt_identity()
    data = request.get_json()

    entry = JournalEntry(
        title=data['title'],
        content=data['content'],
        category=data['category'],
        date=datetime.utcnow(),  # Set the current date and time
        user_id=user_id
    )

    db.session.add(entry)
    db.session.commit()

    return jsonify({'message': 'Journal entry created'}), 201

# View Journal Entries
@app.route('/journals', methods=['GET'])
@jwt_required()
def view_journals():
    user_id = get_jwt_identity()
    journals = JournalEntry.query.filter_by(user_id=user_id).all()
    journal_list = [{
        'id': journal.id,
        'title': journal.title,
        'content': journal.content,
        'category': journal.category,
        'date': journal.date
    } for journal in journals]

    return jsonify(journal_list), 200

# Edit Journal Entry
@app.route('/journal/<int:journal_id>', methods=['PUT'])
@jwt_required()
def edit_journal(journal_id):
    user_id = get_jwt_identity()
    journal = JournalEntry.query.filter_by(id=journal_id, user_id=user_id).first()

    if not journal:
        return jsonify({'error': 'Journal entry not found'}), 404

    data = request.get_json()
    journal.title = data.get('title', journal.title)
    journal.content = data.get('content', journal.content)
    journal.category = data.get('category', journal.category)

    db.session.commit()
    return jsonify({'message': 'Journal entry updated'}), 200


# Delete Journal Entry
@app.route('/journals/<int:journal_id>', methods=['DELETE'])
@jwt_required()
def delete_journal(journal_id):
    user_id = get_jwt_identity()
    journal = JournalEntry.query.filter_by(id=journal_id, user_id=user_id).first()

    if not journal:
        return jsonify({'error': 'Journal entry not found'}), 404

    db.session.delete(journal)
    db.session.commit()
    return jsonify({'message': 'Journal entry deleted'}), 200

# Request Password Reset
@app.route('/request-reset-password', methods=['POST'])
def request_reset_password():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message": "Email not found."}), 404

    token = s.dumps(email, salt='password-reset-salt')
    reset_url = f'http://localhost:5173/password-reset/{token}'

    try:
        send_email(user.email, reset_url)
        return jsonify({"message": "A password reset link has been sent."}), 200
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({"message": "An error occurred while processing your request."}), 500

# Reset Password
@app.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 415

    try:
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
    except SignatureExpired:
        return jsonify({"error": "The reset link has expired"}), 400
    except BadSignature:
        return jsonify({"error": "The reset link is invalid"}), 400

    data = request.get_json()
    new_password = data.get('password')

    if not new_password:
        return jsonify({"error": "New password is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User with this email does not exist"}), 404

    hashed_password = bcrypt.generate_password_hash(new_password)
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200

def send_email(to_email, reset_url):
    subject = "Password Reset Request"
    content = f"""
    Hello,

    We have received a request to reset your password. Please follow the reset instructions to 
    recover your password:

    {reset_url}

    If you did not make this request, contact Support or ignore this email and your password will 
    remain unchanged.

    Best,

    Journaling App
    """
    
    msg = Message(subject=subject, recipients=[to_email], body=content)
    
    try:
        mail.send(msg)
        print(f"Email sent successfully to {to_email}.")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        raise

    return True

#fetch profile
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()  # Get the user's ID from the JWT token

    # Fetch the user from the database based on their ID
    user = User.query.get(current_user_id)

    if user:
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }), 200
    else:
        return jsonify({'message': 'User not found'}), 404


# Update profile
@app.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if 'username' in data:
        user.username = data['username']

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200

# User Logout
BLACKLIST = set()
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decrypted_token):
    return decrypted_token['jti'] in BLACKLIST

@app.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    BLACKLIST.add(jti)
    return jsonify({"success": "Successfully logged out"}), 200


# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal server error"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200


if __name__ == '__main__':
    app.run()