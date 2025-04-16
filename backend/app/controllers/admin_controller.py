from flask import jsonify, current_app
from werkzeug.security import generate_password_hash
from bson import ObjectId

def create_election_controller(data):
    db = current_app.config["MONGO_DB"]

    election_name = data.get("election_name")
    candidate_ids = data.get("candidate_ids")  # List of candidate ObjectIds in string format

    if not election_name or not candidate_ids:
        return jsonify({"error": "Election name and candidate IDs are required"}), 400
    
    # Optional: check if an election already exists
    existing = db.elections.find_one({"election_name": election_name})
    if existing:
        return jsonify({"error": "Election with this title already exists"}), 409

    # Validate candidates exist and have role 'candidate'
    candidates = []
    for cid in candidate_ids:
        candidate = db.users.find_one({"_id": ObjectId(cid), "role": "candidate"})
        if candidate:
            candidates.append({
                "candidate_id": str(candidate["_id"]),
                "name": candidate["name"],
                "votes": 0
            })
        else:
            return jsonify({"error": f"Candidate with ID {cid} not found or invalid"}), 404

    election_data = {
        "election_name": election_name,
        "candidates": candidates,
        "status": "upcoming"  # You can later change this to "ongoing" or "ended"
    }

    db.elections.insert_one(election_data)

    return jsonify({"message": "Election created successfully"}), 201


def get_status_controller():
    db = current_app.config["MONGO_DB"]

    votes = list(db.votes.find({}, {"_id": 0, "candidate": 1}))
    total_votes = len(votes)
    count = {}

    for vote in votes:
        candidate = vote["candidate"]
        count[candidate] = count.get(candidate, 0) + 1

    if total_votes == 0:
        return jsonify({"message": "No votes cast yet"}), 200

    percentage = {
        candidate: round((count[candidate] / total_votes) * 100, 2)
        for candidate in count
    }

    return jsonify({
        "total_votes": total_votes,
        "percentage_results": percentage
    }), 200

from flask import jsonify, current_app

def add_candidate_controller(data):
    db = current_app.config["MONGO_DB"]

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    # Check for duplicate by email (unique identifier)
    existing = db.users.find_one({"email": email, "role": "candidate"})
    if existing:
        return jsonify({"error": "Candidate with this email already exists"}), 409

    db.users.insert_one({
        "name": name,
        "email": email,
        "password": generate_password_hash(password),
        "role": "candidate"
    })

    return jsonify({"message": "Candidate added successfully"}), 201

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
                    "email": user.get("email"),
                    "votes": candidate.get("votes", 0)
                })

        return jsonify({
            "election_id": str(election["_id"]),
            "election_name": election.get("election_name"),
            "candidates": enriched_candidates
        }), 200

    except Exception as e:
        return jsonify({"error": "Invalid Election ID"}), 400
    

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
                    "email": user.get("email"),
                    "votes": candidate.get("votes", 0)
                })

        results.append({
            "election_id": str(election["_id"]),
            "election_name": election.get("election_name"),
            "candidates": enriched_candidates
        })

    return jsonify(results), 200