from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from ..controllers.voter_controller import vote_controller, get_all_elections_controller, get_single_election_controller

voter_bp = Blueprint('voter', __name__)

@voter_bp.route('/vote', methods=['POST'])
@jwt_required()
def vote():
    try:
        print("----- /vote called -----")
        print("Headers:", dict(request.headers))
        print("Raw Data:", request.data.decode('utf-8'))
        print("JSON:", request.get_json(silent=True))

        email = get_jwt_identity()  # identity is now a string (email)
        claims = get_jwt()

        print("JWT Identity (email):", email)
        print("JWT Claims:", claims)

        if claims.get('role') != 'voter':
            return jsonify({"msg": "Unauthorized"}), 403

        data = request.get_json()
        if not data:
            return jsonify({"msg": "Missing JSON in request"}), 400

        return vote_controller(data)

    except Exception as e:
        print("Exception occurred:", str(e))
        return jsonify({"msg": f"Something went wrong: {str(e)}"}), 500

@voter_bp.route('/elections', methods=['GET'])
@jwt_required()
def get_all_elections():
    return get_all_elections_controller()

@voter_bp.route('/election/<election_id>', methods=['GET'])
@jwt_required()
def get_single_election(election_id):
    return get_single_election_controller(election_id)
    