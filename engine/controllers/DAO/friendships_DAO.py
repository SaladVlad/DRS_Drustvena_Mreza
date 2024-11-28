from sqlalchemy import Column, Integer, Enum , ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from db import Base, Session
from datetime import datetime
import pytz
from .users_DAO import User

class Friendship(Base):
    __tablename__ = 'friendship'
    
    user_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True, nullable=False)  # Primary key part 1
    friend_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True, nullable=False)  # Primary key part 2
    initiator_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)  # ID of the request initiator
    status = Column(Enum('pending', 'accepted', 'rejected'), default='pending', nullable=False)  # Friendship status
    created_at = Column(TIMESTAMP, default=datetime.now(pytz.utc), nullable=False)  # Timestamp of creation

    # Relationships
    requester = relationship("User", foreign_keys=[initiator_id])
    user = relationship("User", foreign_keys=[user_id])
    friend = relationship("User", foreign_keys=[friend_id])


def get_friends(user_id):
    session = Session()
    try:
        friendships = session.query(Friendship).filter(
            ((Friendship.user_id == user_id) | (Friendship.friend_id == user_id)) &
            (Friendship.status == 'accepted')
        ).all()

        friend_ids = {
            friendship.friend_id if friendship.user_id == user_id else friendship.user_id
            for friendship in friendships
        }
        print(friend_ids)
        return friend_ids
    except Exception as e:
        print(e)
        return set()
    finally:
        session.close()

def send_friend_request(user_id, friend_id):
    session = Session()
    try:
        # Ensure user_id is always the smaller ID
        if user_id > friend_id:
            user_id, friend_id = friend_id, user_id

        existing_request = session.query(Friendship).filter(
            (Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)
        ).first()

        if existing_request:
            raise ValueError("Friendship request already exists")
        
        new_request = Friendship(user_id=user_id, friend_id=friend_id, initiator_id=user_id, status='pending')
        session.add(new_request)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def respond_to_friend_request(user_id, friend_id, status):  # Accept or reject a request
    session = Session()
    try:
        # Ensure user_id is always the smaller ID
        if user_id > friend_id:
            user_id, friend_id = friend_id, user_id

        friendship = session.query(Friendship).filter_by(user_id=user_id, friend_id=friend_id).first()
        if friendship:
            friendship.status = status
            session.commit()
    except Exception as e:
        session.rollback()
        print(e)
        raise e
    finally:
        session.close()


def get_pending_requests(user_id):
    session = Session()
    try:
        pending_requests = session.query(Friendship).filter(
            (Friendship.user_id == user_id) & (Friendship.status == 'pending')
        ).all()
        
        requesters = [{
            'user_id': friendship.user_id,
            'friend_id': friendship.friend_id,
            'initiator_id': friendship.initiator_id
        } for friendship in pending_requests]
        
        return requesters
    except Exception as e:
        print(e)
        return []
    finally:
        session.close()

def delete_friendship(user_id, friend_id):
    session = Session()
    try:
        # Ensure user_id is always the smaller ID
        if user_id > friend_id:
            user_id, friend_id = friend_id, user_id

        friendship = session.query(Friendship).filter_by(user_id=user_id, friend_id=friend_id).first()
        if friendship:
            session.delete(friendship)
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

#FRIENDSHIP DAO DONE?