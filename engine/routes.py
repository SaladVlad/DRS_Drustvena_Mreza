from flask import Blueprint, jsonify

#Blueprint 
api_bp = Blueprint('api', __name__)

@api_bp.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})