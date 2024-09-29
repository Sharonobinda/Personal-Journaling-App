from flask import Flask, request, jsonify, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required,get_jwt, get_jwt_identity
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
from werkzeug.security import generate_password_hash
from datetime import timedelta
from models import db, User, JournalEntry

app = Flask(__name__)

# Configurations
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///journaling.db"
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['JWT_SECRET_KEY'] = 'jwtsecretkey'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your-email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your-email-password'
app.config['MAIL_DEFAULT_SENDER'] = 'your-email@gmail.com'

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
    username = data['username']
    email = data['email']
    password = data['password']

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200


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
    journal.title = data['title']
    journal.content = data['content']
    journal.category = data['category']

    db.session.commit()

    return jsonify({'message': 'Journal entry updated'}), 200

# Delete Journal Entry
@app.route('/journal/<int:journal_id>', methods=['DELETE'])
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
    email = data['email']

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'No account with that email'}), 404

    token = serializer.dumps(user.email, salt='password-reset-salt')
    reset_link = url_for('reset_password', token=token, _external=True)
    subject = "Password Reset Request"
    body = f'Hi {user.username},\nTo reset your password, click the following link: {reset_link}'

    msg = Message(subject, recipients=[user.email], body=body)
    mail.send(msg)

    return jsonify({'message': 'Password reset link sent'}), 200

# Reset Password
@app.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    try:
        email = serializer.loads(token, salt='password-reset-salt', max_age=3600)
    except:
        return jsonify({'error': 'Invalid or expired token'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    new_password = data['password']
    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200

# Update Username/Password
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

    if 'password' in data:
        user.password = generate_password_hash(data['password'])

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


if __name__ == '__main__':
    app.run()