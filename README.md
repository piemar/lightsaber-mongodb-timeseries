# Lightsaber Motion Control

Lightsaber Motion Control is a web application designed to showcase the timeseries collection capabilities of MongoDB by storing precise device motion data. The frontend is built with React, and the backend is implemented using Flask. This repository contains both the frontend and backend code.

## Requirements

- Node.js and npm or yarn for the frontend.
- Python for the backend.
- MongoDB Atlas for precise data storage.

## lightsaber-frontend

The `lightsaber-frontend` is responsible for displaying the lightsaber interface and capturing detailed device motion data to dynamically change the lightsaber's color in real-time.

### What the Frontend Does

1. **User Interface**: The frontend presents an engaging user interface featuring a virtual lightsaber.

2. **Device Orientation**: It utilizes the `window.addEventListener('deviceorientation', handleOrientation)` to capture precise data from the device's gyroscope and accelerometer. This data includes information about the device's orientation in three dimensions: alpha (rotation around the z-axis), beta (rotation around the x-axis), and gamma (rotation around the y-axis).

3. **Color Control**: The alpha value from the device orientation data is meticulously mapped to control the hue of the lightsaber's color. As the user moves their device, the lightsaber's color dynamically changes to reflect the device's orientation.

4. **Audio Feedback**: To enhance the user experience, audio feedback is provided when the lightsaber's color changes. An audio file (`lightsaber.mp3`) is played using the Howler library.

5. **Pulsating Animation**: To make the lightsaber's color change more visually captivating, a pulsating animation is applied whenever the color changes.

6. **Data Transmission**: Device orientation data is continuously sent to the backend server via a Flask REST endpoint (`/data`) in the form of a JSON object.

### Setup

1. Clone this repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the `lightsaber-frontend` directory:

   ```bash
   cd lightsaber-frontend
   ```

3. Install the required dependencies using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the frontend application:

   ```bash
   npm start
   # or
   yarn start
   ```

5. Open your web browser and go to `http://localhost:3000` to experience the Lightsaber Motion Control interface.

## lightsaber-backend

The `lightsaber-backend` is responsible for receiving the intricate device orientation data from the frontend and storing it systematically in a MongoDB database.

### What the Backend Does

1. **Flask Web Server**: The backend is implemented using Flask, a Python web framework. It establishes a Flask web server that listens for incoming requests on `http://localhost:5000`.

2. **MongoDB Atlas Integration**: The backend is seamlessly integrated with MongoDB Atlas, a cloud-based database service. It connects to a MongoDB database hosted on Atlas using the MongoClient.

3. **Data Reception**: The backend provides a single REST endpoint (`/data`) that expects incoming POST requests with detailed JSON data. This endpoint diligently receives the device orientation data transmitted by the frontend.

4. **Data Storage**: The received device orientation data is systematically stored in a MongoDB collection named `timeseries`. Each data point is meticulously associated with a timestamp, allowing for precise tracking of when the data was received.

5. **CORS Configuration**: Cross-Origin Resource Sharing (CORS) is configured to facilitate secure communication with the frontend, even if the frontend is hosted on a different domain or port.

6. **Response**: Upon successfully receiving and storing the data, the endpoint responds promptly with a confirmation message, indicating that the data has been received and stored accurately.

### Setup

1. Ensure that Python is installed on your system.

2. Navigate to the `lightsaber-backend` directory:

   ```bash
   cd lightsaber-backend
   ```

3. Install the required Python dependencies using pip:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:

   ```bash
   python app.py
   ```

The backend server will be operational and accessible at `http://localhost:5000`.


Feel free to customize and extend this project as needed to create an immersive and interactive lightsaber motion control experience for showcasing MongoDB's timeseries collection capabilities. May the Force be with you! 🌌🚀