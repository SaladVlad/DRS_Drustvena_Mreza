from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from db import Base, Session  # Uvozimo centralizovane definicije

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

def create_user(username, email, password, first_name, last_name, address=None, city=None, state=None, phone_number=None, is_admin=False):
    session = Session()  # Kreiranje sesije unutar funkcije, preporuceno da svaka fja ima svoju sesiju ka bazi
    try:
        new_user = User(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            address=address,
            city=city,
            state=state,
            phone_number=phone_number,
            is_admin=is_admin,
            is_blocked=False
        )
        session.add(new_user)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def read_user(user_id):
    session = Session()
    try:
        return session.query(User).filter_by(user_id=user_id).first()
    finally:
        session.close()

def read_users():
    session = Session()
    try:
        return session.query(User).all()
    finally:
        session.close()

def update_user(user_id, **kwargs):
    session = Session()
    try:
        user = read_user(user_id)
        if user:
            for key, value in kwargs.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def delete_user(user_id):
    session = Session()
    try:
        user = read_user(user_id)
        if user:
            session.delete(user)
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def block_user(user_id):
    session = Session()
    try:
        user = read_user(user_id)
        if user:
            user.is_blocked = True
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def unblock_user(user_id):
    session = Session()
    try:
        user = read_user(user_id)
        if user:
            user.is_blocked = False
            session.commit()
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
    finally:
        session.close()
    