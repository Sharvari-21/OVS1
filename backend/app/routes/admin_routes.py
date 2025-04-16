from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..controllers.admin_controller import create_election_controller, get_status_controller, get_single_election_controller, get_all_elections_controller
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

from app.controllers.admin_controller import add_candidate_controller
from app.utils.jwt_utils import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/create-election', methods=['POST'])
@jwt_required()
@admin_required
def create_election():
    data = request.get_json()
    return create_election_controller(data)

@admin_bp.route('/status', methods=['GET'])
@jwt_required()
def status():
    identity = get_jwt_identity()
    if identity.get('role') != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403

    return get_status_controller()

@admin_bp.route('/add-candidate', methods=['POST'])
@jwt_required()
@admin_required
def add_candidate():
    data = request.get_json()
    return add_candidate_controller(data)

@admin_bp.route('/election/<election_id>', methods=['GET'])
@jwt_required()
def get_single_election(election_id):
    return get_single_election_controller(election_id)

@admin_bp.route('/elections', methods=['GET'])
@jwt_required()
def get_all_elections():
    return get_all_elections_controller()