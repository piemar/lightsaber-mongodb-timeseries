from flask import Flask, render_template, request
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# Set up MongoDB Atlas connection
mongo_client = MongoClient("MONGODB_URI")
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

if __name__ == '__main__':
    app.run()
