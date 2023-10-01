import os
from flask import Flask, jsonify, render_template, request
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS
from PIL import Image
from dotenv import load_dotenv
load_dotenv() 
app = Flask(__name__)
CORS(app)

# Set up MongoDB Atlas connection
# Load the MongoDB connection string from the environment variable
mongodb_uri = os.environ.get("MONGODB_URI")

# Check if the environment variable is set
if not mongodb_uri:
    raise Exception("MONGODB_URI environment variable is not set.")

# Set up MongoDB Atlas connection
mongo_client = MongoClient(mongodb_uri)
db = mongo_client["starwars"]
collection = db["timeseries"]

@app.route('/data', methods=['POST'])
def store_data():
    data = request.get_json()  # Assuming the data is sent as JSON
    timestamp = datetime.now()  # Generate a timestamp
    data['timestamp'] = timestamp  # Add the timestamp to the data
    
    # Store the device orientation data in the Time Series collection
    collection.insert_one(data)
    return "Data received and stored successfully!"

@app.route('/replay', methods=['GET'])
def get_replay_data():
    email = request.args.get('email')
    
    # Retrieve device orientation data based on the provided email
    replay_data = list(collection.find({'email': email}))
    
    # Exclude unnecessary fields like '_id' and 'email'
    replay_data = [{'alpha': data['alpha'], 'beta': data['beta'], 'gamma': data['gamma'],'hue': data['hue']} for data in replay_data]
    
    return jsonify(replay_data)

if __name__ == '__main__':
    app.run()
