from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from db import Base, Session  # Uvozimo centralizovane definicije
from sqlalchemy import exc
import pytz
from hashlib import sha256
from flask import jsonify
from datetime import datetime

class User(Base):
    __tablename__ = 'user'
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(32), unique=True, nullable=False)
    email = Column(String(64), unique=True, nullable=False)
    password = Column(String(64), nullable=False)
    first_name = Column(String(32), nullable=False)
    last_name = Column(String(32), nullable=False)
    address = Column(String(64))
    city = Column(String(32))
    state = Column(String(32))
    phone_number = Column(String(16))
    is_admin = Column(Boolean, default=False)
    is_blocked = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, nullable=False)
    first_login = Column(Boolean, default=True)


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
        print(user_id)
        # Query the User model to find the user by their ID
        user = session.query(User).filter_by(user_id=user_id).first()

        if user:
            # Convert user object to dictionary or use a to_dict method if you have one
            user_dict = {column.name: getattr(user, column.name) for column in User.__table__.columns}
            return user_dict
        else:
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
        user = read_user(user_id)
        if user in None:
            return None, "User not found"
        user.is_blocked = True
        session.commit()
        return user, None
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def unblock_user(user_id):
    session = Session()
    try:
        user = read_user(user_id)
        if user is None:
            return None, "User not found"
        user.is_blocked = False
        session.commit()
        return user, None
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

    


