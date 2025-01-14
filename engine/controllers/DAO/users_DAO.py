from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from db import Base, Session
from hashlib import sha256
from flask import jsonify
from datetime import datetime
from controllers.mail_sending import send_mail_when_registered
from controllers.mail_sending import send_mail_when_unblocked
from controllers.mail_sending import send_mail_when_blocked
import pytz

class User(Base):
    __tablename__ = 'user'
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(32), unique=True, nullable=False)
    email = Column(String(64), unique=True, nullable=False)
    password = Column(String(128), nullable=False)  # Adjusted for bcrypt/argon2 hash
    first_name = Column(String(32), nullable=False)
    last_name = Column(String(32), nullable=False)
    address = Column(String(128))  # Adjusted for longer addresses
    city = Column(String(64))  # Adjusted for longer city names
    state = Column(String(64))
    phone_number = Column(String(32))  # Adjusted for international phone numbers
    is_admin = Column(Boolean, default=False, server_default="false")
    times_rejected = Column(Integer, default=0, server_default="0")
    is_blocked = Column(Boolean, default=False, server_default="false")
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, default=datetime.utcnow)
    first_login = Column(Boolean, default=True, server_default="true")


def create_user(username, email, password, first_name, last_name, address, city, state, phone_number):
    session = Session()
    try:
        new_user = User(
            username=username,
            email=email,
            password=sha256(password.encode()).hexdigest(),
            first_name=first_name,
            last_name=last_name,
            address=address,
            city=city,
            state=state,
            phone_number=phone_number,
            created_at=datetime.now(pytz.utc)
        )

        session.add(new_user)
        session.commit()
        print("Upisan u bazu")

        send_mail_when_registered(username, password, email)

        return jsonify({"message": "User created successfully", "user_id": new_user.user_id}), 201
    except Exception as e:
        session.rollback()
        print(e)
        return jsonify({"error": "An error occurred during registration"}), 500
    finally:
        session.close()




def read_users():
    session = Session()
    try:
        users = session.query(User).all()
        print(users)
        if users is None or len(users) == 0:
            return []
        return users
    except Exception as e:
        print(e)
        return []
    finally:
        session.close()


def read_user(user_id):
    session = Session()
    try:
        # Query the User model to find the user by their ID
        user = session.query(User).filter_by(user_id=user_id).first()
        if user:
            print(f"User found: {user}")
            # Convert user object to dictionary or use a to_dict method if you have one
            user_dict = {column.name: getattr(user, column.name) for column in User.__table__.columns}
            return user_dict
        else:
            print("User not found")
            return None  # No user found
    except Exception as e:
        print(f"Error: {e}")
        return None  # Return None in case of an exception
    finally:
        session.close()



def find_user_by_username_or_email(username=None, email=None):
    session = Session()
    try:
        query = session.query(User)
        if username:
            query = query.filter_by(username=username)
            print(f"Filtering by username: {username}")
        if email:
            query = query.filter_by(email=email)
            print(f"Filtering by email: {email}")
        print(f"Query: {query}")

        user = query.first()

        if user:
            user_dict = {column.name: getattr(user, column.name) for column in User.__table__.columns}
            return user_dict
        else:
            return None
    finally:
        session.close()
def read_blocked_users():
    session = Session()
    try:
        blocked_users = session.query(User).filter(User.is_blocked == True).all()
        return blocked_users
    except Exception as e:
        return None
    finally:
        session.close()

def update_user(user_id, **kwargs):
    session = Session()
    try:
        # Fetch the user to update
        user = session.query(User).filter_by(user_id=user_id).first()
        if not user:
            return None, "User not found"

        # Define read-only fields
        read_only_fields = {"created_at", "user_id"}

        # Update only allowed fields
        for key, value in kwargs.items():
            if key not in read_only_fields and hasattr(user, key):
                setattr(user, key, value)

        # Commit changes
        session.commit()
        print(user.first_name, user.last_name)
        return user, None
    except Exception as e:
        # Rollback on error
        session.rollback()
        raise e
    finally:
        session.close()

def delete_user(user_id):
    session = Session()
    try:
        user = read_user(user_id)
        if user is None:
            return None, "User not found"
        session.delete(user)
        session.commit()
        return user, None
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def block_user(user_id):
    session = Session()
    try:
        user = session.query(User).filter_by(user_id=user_id).first()
        if not user:
            return None, "User not found"

        user.is_blocked = True
        session.commit()
        print(f"User {user.username} has been blocked.")
        send_mail_when_blocked(user.username,user.email)  # Slanje mejla samo ovde
        return user, None
    except Exception as e:
        session.rollback()
        print(f"Error in block_user: {e}")
        raise e
    finally:
        session.close()

def update_times_rejected(user_id):
    session = Session()
    try:
        user = session.query(User).filter_by(user_id=user_id).first()
        if not user:
            return None, "User not found"

        print(f"User {user.username} current rejection count: {user.times_rejected}")
        if user.times_rejected == 2:  # Korisnik će biti blokiran kada odbijanje dostigne 3
            user.times_rejected += 1
            session.commit()
            print(f"User {user.username} reached rejection limit. Blocking...")
            block_user(user_id)  # Delegiramo blokiranje i slanje mejla funkciji `block_user`
        else:
            user.times_rejected += 1
            session.commit()
            print(f"User {user.username} rejection count increased to {user.times_rejected}.")
        return user, None
    except Exception as e:
        session.rollback()
        print(f"Error in update_times_rejected: {e}")
        raise e
    finally:
        session.close()



def unblock_user(user_id):
    session = Session()
    try:
        user = session.query(User).filter_by(user_id=user_id).first()  # Proveri korisnika unutar sesije
        if user is None:
            return None, "User not found"

        print("User pre: ", user.username, user.is_blocked)

        # Ažuriranje atributa
        user.is_blocked = False
        user.times_rejected = 0

        print("User posle: ", user.username, user.is_blocked, user.times_rejected)

        session.add(user)  # Osiguraj da je objekat u sesiji
        session.commit()

        print("Javljam mu da je odblokiran")
        send_mail_when_unblocked(user.username,user.email)
        print("Poslao mail")

        return user, None
    except Exception as e:
        session.rollback()
        print("Error:", str(e))
        raise e
    finally:
        session.close()


    
def search_users(query=None, address=None, city=None, state=None,user_id=None):
    session = Session()
    try:
        filters = []
        if query:
            filters.append(
                (User.username.ilike(f"%{query}%"))
                | (User.email.ilike(f"%{query}%"))
                | (User.first_name.ilike(f"%{query}%"))
                | (User.last_name.ilike(f"%{query}%"))
                | (User.phone_number.ilike(f"%{query}%"))
            )
        if address:
            filters.append(User.address.ilike(f"%{address}%"))
        if city:
            filters.append(User.city == city)
        if state:
            filters.append(User.state == state)
        if user_id:
            filters.append(User.user_id != user_id)

        users = session.query(User).filter(*filters).all()
        return [
            {column.name: getattr(user, column.name) for column in User.__table__.columns}
            for user in users
        ]
    except Exception as e:
        print(f"Error during search: {e}")
        return []
    finally:
        session.close()