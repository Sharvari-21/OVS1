from flask import Flask, current_app
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

load_dotenv()

jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # ✅ MongoDB Configuration
    mongo_uri = os.getenv("MONGO_URI")
    db_name = os.getenv("DB_NAME", "online_voting_system")

    if not mongo_uri:
        print("❌ MONGO_URI not found in environment.")
        app.config['MONGO_DB'] = None
        return app

    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        client.server_info()
        db = client[db_name]
        app.config['MONGO_CLIENT'] = client
        app.config['MONGO_DB'] = db
        print(f"✅ Connected to MongoDB Atlas database: {db_name}")
    except Exception as e:
        print(f"❌ MongoDB Atlas connection failed: {e}")
        app.config['MONGO_CLIENT'] = None
        app.config['MONGO_DB'] = None

    # ✅ JWT Configuration
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    jwt = JWTManager(app)

    # In-memory blocklist
    app.config['BLOCKLIST'] = {}

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        blocklist = current_app.config['BLOCKLIST']
        jti = jwt_payload["jti"]
        now = datetime.utcnow().timestamp()

        # Remove expired entries
        expired_keys = [j for j, exp in blocklist.items() if exp < now]
        for key in expired_keys:
            del blocklist[key]

        return jti in blocklist

    # ✅ Blueprint Imports
    from app.routes.admin_routes import admin_bp
    from app.routes.voter_routes import voter_bp
    from app.routes.user_routes import user_bp
    from app.utils.auth import auth_bp  # Make sure this exists

    # ✅ Register Blueprints
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(voter_bp, url_prefix="/voter")
    app.register_blueprint(auth_bp, url_prefix="/auth")  # Optional prefix

    return app
