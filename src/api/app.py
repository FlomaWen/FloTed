from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
from pymongo.errors import DuplicateKeyError
from api import getAllArticles, register_user, login_user

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY") 
jwt = JWTManager(app)

@app.route('/articles', methods=['GET'])
def articles():
    articles = getAllArticles()
    return jsonify(articles)

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    try:
        register_user(username, password)
    except DuplicateKeyError:
        return jsonify({"msg": "Username already exists"}), 409

    return jsonify({"msg": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    user = login_user(username, password)
    if not user:
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)

    return jsonify(access_token=access_token, refresh_token=refresh_token,user=user), 200

if __name__ == '__main__':
    app.run(debug=True)
