from flask import jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import timedelta
from bson import ObjectId

# def signup_controller(data):
#     db = current_app.config["MONGO_DB"]

#     if not data.get('email') or not data.get('password'):
#         return jsonify({"error": "Email and password required"}), 400

#     existing = db.voters.find_one({"email": data['email']})
#     if existing:
#         return jsonify({"error": "Email already registered"}), 409

#     hashed_password = generate_password_hash(data['password'])
#     db.voters.insert_one({
#         "email": data['email'],
#         "password": hashed_password,
#         "voted": False
#     })

#     return jsonify({"message": "Voter registered successfully"}), 201


# def login_controller(data):
#     db = current_app.config["MONGO_DB"]

#     voter = db.voters.find_one({"email": data.get('email')})
#     if not voter or not check_password_hash(voter['password'], data.get('password')):
#         return jsonify({"error": "Invalid email or password"}), 401

#     # ✅ Use string identity (email) and put role in additional_claims
#     access_token = create_access_token(
#         identity=str(voter['email']),  # ensures it's a string
#         additional_claims={"role": "voter"},
#         expires_delta=timedelta(hours=1)
#     )

#     return jsonify({"token": access_token}), 200

def vote_controller(data):
    db = current_app.config["MONGO_DB"]

    election_id = data.get("election_id")
    candidate_id = data.get("candidate_id")

    if not election_id or not candidate_id:
        return jsonify({"error": "Election ID and Candidate ID required"}), 400

    # Fetch the logged-in voter's info
    voter_email = get_jwt_identity()
    voter = db.users.find_one({"email": voter_email, "role": "voter"})

    if not voter:
        return jsonify({"error": "Voter not found"}), 404

    voted_elections = voter.get("voted_elections", [])
    if election_id in voted_elections:
        return jsonify({"error": "You have already voted in this election"}), 403

    # Fetch the election document
    election = db.elections.find_one({"_id": ObjectId(election_id)})
    if not election:
        return jsonify({"error": "Election not found"}), 404

    # Verify the candidate exists in this election
    candidate_found = False
    updated_candidates = []
    for candidate in election["candidates"]:
        if candidate["candidate_id"] == candidate_id:
            candidate["votes"] += 1
            candidate_found = True
        updated_candidates.append(candidate)

    if not candidate_found:
        return jsonify({"error": "Candidate not part of this election"}), 404

    # Update the votes in the election document
    db.elections.update_one(
        {"_id": ObjectId(election_id)},
        {"$set": {"candidates": updated_candidates}}
    )

    # Update voter's record with election_id to prevent double voting
    db.users.update_one(
        {"_id": voter["_id"]},
        {"$push": {"voted_elections": election_id}}
    )

    return jsonify({"message": "Vote cast successfully!"}), 200

def get_all_elections_controller():
    db = current_app.config["MONGO_DB"]
    elections = db.elections.find()

    results = []

    for election in elections:
        enriched_candidates = []
        for candidate in election.get("candidates", []):
            user = db.users.find_one({"_id": ObjectId(candidate["candidate_id"])})
            if user:
                enriched_candidates.append({
                    "candidate_id": str(candidate["candidate_id"]),
                    "name": user.get("name"),
                    "email": user.get("email")
                    # votes excluded here too
                })

        results.append({
            "election_id": str(election["_id"]),
            "election_name": election.get("election_name"),
            "candidates": enriched_candidates
        })

    return jsonify(results), 200


def get_single_election_controller(election_id):
    db = current_app.config["MONGO_DB"]

    try:
        election = db.elections.find_one({"_id": ObjectId(election_id)})
        if not election:
            return jsonify({"error": "Election not found"}), 404

        enriched_candidates = []
        for candidate in election.get("candidates", []):
            user = db.users.find_one({"_id": ObjectId(candidate["candidate_id"])})
            if user:
                enriched_candidates.append({
                    "candidate_id": str(candidate["candidate_id"]),
                    "name": user.get("name"),
                    "email": user.get("email")
                    # votes excluded intentionally
                })

        return jsonify({
            "election_id": str(election["_id"]),
            "election_name": election.get("election_name"),
            "candidates": enriched_candidates
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid Election ID"}), 400
