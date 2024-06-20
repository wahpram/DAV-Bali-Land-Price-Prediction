from flask import Flask
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from flask_cors import CORS

app = Flask(__name__, static_folder='../../frontend')

app.config.from_object('config.dev_config')
CORS(app) 
client = MongoClient(app.config['MONGO_URI'])
db = client[app.config['MONGO_DBNAME']]

from app import routes