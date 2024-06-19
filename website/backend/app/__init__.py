from flask import Flask
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from app import routes

app = Flask(__name__)

app.config.from_object('config.dev_config')

client = MongoClient(app.config['MONGO_URI'])
db = client[app.config['MONGO_DBNAME']]
