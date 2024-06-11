import bcrypt
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import DuplicateKeyError
import os


#################################### CONNEXION DB ####################################
mongodb_password = os.environ.get("MONGODB_PASSWORD")
mongoURI = f"mongodb+srv://florianpescot4:{mongodb_password}@clusterbotvinted.f4tqrc2.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBotVinted"

client = MongoClient(mongoURI, server_api=ServerApi('1'))
db = client.Articles
articles_collection = db.Articles
users_collection = db.Users

#################################### FUNCTIONS ####################################

def getAllArticles():
    articles = list(articles_collection.find())
    for article in articles:
        article["_id"] = str(article["_id"])
    return articles

def register_user(username, password):
    if users_collection.find_one({"username": username}):
        raise DuplicateKeyError("Username already exists")

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({"username": username, "password": hashed_pw})

def login_user(username, password):
    user = users_collection.find_one({"username": username})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return None
    user["_id"] = str(user["_id"])
    user.pop("password")
    return user