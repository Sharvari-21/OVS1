from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..controllers.admin_controller import (
    create_election_controller,
    get_status_controller,
    get_single_election_controller,
    get_all_elections_controller,
    add_candidate_controller
)
from app.utils.jwt_utils import admin_required
from bson import ObjectId

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
def get_single_election(election_id):
    return get_single_election_controller(election_id)

@admin_bp.route('/elections', methods=['GET'])
def get_all_elections():
    return get_all_elections_controller()

# ✅ NEW: Get all candidates
@admin_bp.route('/candidates', methods=['GET'])
@jwt_required()
@admin_required
def get_all_candidates():
    db = current_app.config["MONGO_DB"]
    candidates = list(db.users.find({"role": "candidate"}))

    result = [
        {
            "candidate_id": str(c["_id"]),
            "name": c["name"],
            "email": c["email"]
        } for c in candidates
    ]

    return jsonify(result), 200
