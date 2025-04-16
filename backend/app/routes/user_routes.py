from flask import Blueprint, request, jsonify, current_app
from app.controllers.user_controller import signup_voter_controller, login_user_controller, create_admin_controller
from flask_jwt_extended import jwt_required, get_jwt

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/voter/signup', methods=['POST'])
def signup_voter():
    data = request.get_json()
    return signup_voter_controller(data)

@user_bp.route('/voter/login', methods=['POST'])
def login_voter():
    data = request.get_json()
    return login_user_controller(data, expected_role="voter")

@user_bp.route('/admin/login', methods=['POST'])
def login_admin():
    data = request.get_json()
    return login_user_controller(data, expected_role="admin")

@user_bp.route('/admin/create', methods=['POST'])
def create_admin():
    data = request.get_json()
    return create_admin_controller(data)

@user_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    exp_timestamp = get_jwt()["exp"]  # Get token's expiry time
    # Save in blocklist with expiry time
    current_app.config['BLOCKLIST'][jti] = exp_timestamp
    return jsonify({"message": "Successfully logged out"}), 200