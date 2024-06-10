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

#################################### FUNCTIONS ####################################

def getAllArticles():
    articles = list(articles_collection.find())
    for article in articles:
        article["_id"] = str(article["_id"])
    return articles