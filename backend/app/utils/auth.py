# app/utils/auth.py
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

def check_password(pw_hash, password):
    return bcrypt.check_password_hash(pw_hash, password)

# ✅ Corrected generate_token function
def generate_token(identity, role):
    # identity must be a string (like email or user_id)
    # additional_claims will hold role or any custom data
    return create_access_token(identity=identity, additional_claims={"role": role})
