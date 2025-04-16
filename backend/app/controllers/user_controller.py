from flask import jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import timedelta

# 🚀 VOTER SIGNUP (adds user with role 'voter')
def signup_voter_controller(data):
    db = current_app.config["MONGO_DB"]

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400

    existing = db.users.find_one({"email": data['email']})
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = generate_password_hash(data['password'])
    db.users.insert_one({
        "email": data['email'],
        "password": hashed_password,
        "role": "voter"
    })

    return jsonify({"message": "Voter registered successfully"}), 201

# 🚀 LOGIN (for both Admin and Voter)
def login_user_controller(data, expected_role):
    db = current_app.config["MONGO_DB"]

    user = db.users.find_one({"email": data.get('email'), "role": expected_role})
    if not user or not check_password_hash(user['password'], data.get('password')):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity=user['email'],
        additional_claims={"role": expected_role},
        expires_delta=timedelta(hours=1)
    )

    return jsonify({"access_token": access_token}), 200

def create_admin_controller(data):
    db = current_app.config["MONGO_DB"]

    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password required"}), 400

    existing = db.users.find_one({"email": data['email']})
    if existing:
        return jsonify({"error": "Email already exists"}), 409

    hashed_password = generate_password_hash(data['password'])
    db.users.insert_one({
        "email": data['email'],
        "password": hashed_password,
        "role": "admin"
    })

    return jsonify({"message": "Admin created successfully"}), 201