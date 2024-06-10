from flask import Flask, jsonify
from flask_cors import CORS
from api import getAllArticles

app = Flask(__name__)
CORS(app)

@app.route('/articles')
def articles():
    articles = getAllArticles()
    return jsonify(articles)

if __name__ == '__main__':
    app.run(debug=True)
