from flask import Blueprint, jsonify, request
from app.services.user_service import UserService

user_blueprint = Blueprint("users", __name__)

@user_blueprint.route("/", methods=["GET"])
def get_users():
    users = UserService.get_users()
    return jsonify([{"id": user.id, "username": user.username, "email": user.email} for user in users])

@user_blueprint.route("/", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    user = UserService.add_user(username, email)
    return jsonify({"id": user.id, "username": user.username, "email": user.email}), 201
