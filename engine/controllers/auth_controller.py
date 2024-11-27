from flask_jwt_extended import get_jwt, get_jwt_identity, create_access_token
from .DAO.users_DAO import read_users
from hashlib import sha256

def check_if_admin():
    claims = get_jwt()  # Retrieves all claims from the JWT
    is_admin = claims.get("is_admin", False)
    return {"is_admin": is_admin}, 200

def login_user(**kwargs):
    username = kwargs.get("username")
    password = kwargs.get("password")
    print(username, password)

    # Get all users (ensure `read_users()` returns a list of dicts or objects with necessary fields)
    users = list(read_users())
    user = next((u for u in users if u.username == username), None)
    
    if user is None:
        return {"error": "User not found"}, 404
    
    # Validate password
    hashed_password = sha256(password.encode()).hexdigest()
    if hashed_password != user.password:
        return {"error": "Password is incorrect"}, 400
    
    # Create token with identity and additional claims
    additional_claims = {
        "user_id": str(user.user_id),
        "username": user.username,
        "is_admin": user.is_admin
    }
    access_token = create_access_token(identity=str(user.user_id), additional_claims=additional_claims)

    return {"status": "OK", "token": access_token}, 200
