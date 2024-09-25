from faker import Faker
from models import db, User, JournalEntry
from werkzeug.security import generate_password_hash
from datetime import datetime
from app import app

# Initialize Faker
fake = Faker()

# Number of users and journal entries to seed
NUM_USERS = 5
NUM_JOURNAL_ENTRIES = 20

# List of possible categories for journal entries
categories = ['Personal', 'Work', 'Travel', 'Health', 'Education', 'Finance']

def seed_users():
    print("Seeding users...")
    for _ in range(NUM_USERS):
        username = fake.user_name()
        email = fake.email()
        password = generate_password_hash('password123')

        user = User(username=username, email=email, password=password)
        db.session.add(user)
    
    db.session.commit()
    print(f"Seeded {NUM_USERS} users successfully.")

def seed_journal_entries():
    print("Seeding journal entries...")
    users = User.query.all()  # Get all seeded users

    for _ in range(NUM_JOURNAL_ENTRIES):
        title = fake.sentence(nb_words=6)
        content = fake.paragraph(nb_sentences=5)
        category = fake.random.choice(categories)
        date = fake.date_time_this_year()

        # Assign the entry to a random user
        user = fake.random.choice(users)

        entry = JournalEntry(
            title=title,
            content=content,
            category=category,
            date=date,
            user_id=user.id
        )
        db.session.add(entry)

    db.session.commit()
    print(f"Seeded {NUM_JOURNAL_ENTRIES} journal entries successfully.")

def main():
    with app.app_context():
        # Drop and create the tables first (optional)
        db.drop_all()
        db.create_all()

        # Seed users and journal entries
        seed_users()
        seed_journal_entries()

if __name__ == '__main__':
    main()
