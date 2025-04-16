from app import mongo

def create_user(data):
    return mongo.db.users.insert_one(data)

def find_user_by_email(email):
    return mongo.db.users.find_one({"email": email})

def find_user_by_id(user_id):
    return mongo.db.users.find_one({"_id": user_id})
