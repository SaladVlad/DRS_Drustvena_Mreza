from app.models.user import User
from app import db

class UserRepository:
    @staticmethod
    def get_all_users():
        return User.query.all()

    @staticmethod
    def create_user(username, email):
        user = User(username=username, email=email)
        db.session.add(user)
        db.session.commit()
        return user
