from sqlalchemy import Column, Integer, Enum , ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from db import Base, Session

class Friendship(Base):
    __tablename__ = 'friendship'
    friendship_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    friend_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)
    status = Column(Enum('pending', 'accepted', 'rejected'), default='pending')
    request_date = Column(TIMESTAMP,nullable=False)

    requester = relationship("User", foreign_keys=[user_id]) # odnos između klase Friendship i klase User
    friend = relationship("User", foreign_keys=[friend_id]) 

def send_friend_request(user_id, friend_id):
    session = Session()
    try:
        new_request = Friendship(user_id = user_id, friend_id = friend_id, status = 'pending')
        session.add(new_request)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def respond_to_friend_request(friendship_id, status): #accept/reject a request
    session = Session()
    try:
        friendship = session.query(Friendship).filter_by(friendship_id=friendship_id).first()
        if friendship:
            friendship.status = status
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def get_friends(user_id):
    session = Session()
    try:
        friendships = session.query(Friendship).filter(
        ((Friendship.user_id == user_id) | (Friendship.friend_id == user_id)), (Friendship.status == 'accepted')).all()
        return friendships
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def get_pending_requests(user_id):
    session = Session()
    try:
        requests = session.query(Friendship).filter_by(friend_id = user_id,status = 'pending').all()
        return requests
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def delete_friendship(friendship_id):
    session = Session()
    try:
        friendship = session.query(Friendship).filter_by(friendship_id=friendship_id).first()
        if friendship:
            session.delete(friendship)
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()