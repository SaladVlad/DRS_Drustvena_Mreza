from app.repositories.user_repository import UserRepository

class UserService:
    @staticmethod
    def get_users():
        return UserRepository.get_all_users()

    @staticmethod
    def add_user(username, email):
        return UserRepository.create_user(username, email)
