from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from db import Base, Session  # Uvozimo centralizovane definicije
from sqlalchemy import exc
from hashlib import sha256

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

def create_user(**kwargs):
    session = Session()  # Kreiranje sesije unutar funkcije, preporuceno da svaka fja ima svoju sesiju ka bazi
    try:
        new_user = User(**kwargs)
        new_user.password = sha256(new_user.password.encode()).hexdigest()
        new_user.is_admin = False
        new_user.is_blocked = False
        session.add(new_user)
        session.commit()
    except exc.IntegrityError as e:
            session.rollback()
    except Exception as e:
        session.rollback()
        return None, "Duplicate key error: user with ID {} already exists".format(kwargs['user_id'])
    finally:
        session.close()

def read_user(user_id):
    session = Session()
    try:
        print(user_id)
        return session.query(User).filter_by(user_id=user_id).first()
    except Exception as e:
        return None
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

def update_user(**kwargs):
    session = Session()
    try:
        user_id = kwargs['user_id']
        user = read_user(user_id)
        if user is None:
            return None, "User not found"
        for key, value in kwargs.items():
            if key != 'user_id':
                setattr(user, key, value)
        session.commit()
        return user, None
    except Exception as e:
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

def find_user_by_username_or_email(username=None, email=None):
    session = Session()
    try:
        query = session.query(User)
        if username:
            query = query.filter_by(username=username)
        if email:
            query = query.filter_by(email=email)
        return query.first()
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
    