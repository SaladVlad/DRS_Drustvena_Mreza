from flask import Blueprint, jsonify, request
from controllers.admin_controller import *

#Blueprint 
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin', methods=['GET'])
def get_users():
    return get_all_users()