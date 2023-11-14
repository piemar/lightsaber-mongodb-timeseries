import React, { useEffect, useState } from 'react';
import { Button, CssBaseline } from '@mui/material'; // Import Material-UI components
import {UseHealth,ProgressBarComponent} from '../components/UseHealth';
import LightSaber from '../components/LightSaber';
import SignUpForm from '../components/SignUpForm';
import BallGamePlayInformation from '../components/BallGamePlayInformation';
import ReplayGamePlay from '../components/ReplayGamePlay';
import BallGamePlay from '../components/BallGamePlay';
import { Howl } from 'howler';
import './../App.css';
function HomePage(props) {
  const { health } = UseHealth(props.realm, props.health, props.shouldPulsate);  
  const REALM_APP_ID = props.realm;
  var px = 50; // Position x and y
  var py = 50;
  var vx = 0.0; // Velocity x and y
  var vy = 0.0;

  var updateRate = 1 / 500; // Sensor refresh rate
  const [multiplierPoints, setMultiplierPoints] = useState(1);
  const [borderStateColor, setBorderStateColor] = useState("green");

  const [lightSaberPoints, setLightSaberPoints] = useState(500);
  const [email, setEmail] = useState(''); // State for email input
  const [showLightsaber, setShowLightsaber] = useState(false); // State to control lightsaber visibility
  const [showReplayGamePlay, setBoxContainer] = useState(false); // State to control for replay container
  const [showReplay, setReplay] = useState(false); // State to control lightsaber visibility
  const [signUpForm, setSignUpForm] = useState(true); // State to control lightsaber visibility
  const [hue, setHue] = useState(0); // Initialize hue to 0

  const [replayData, setReplayData] = useState([]); // State to store retrieved replay data
  const [boxRotation, setBoxRotation] = useState({ x: 0, y: 0, z: 0, hue: 0 }); // State to store 3D box rotation angles
  const [counter, setCounter] = useState(30);
  const [showBallGamePlay, setBallContainer] = useState(false);
  const [showBallGamePayInformation, setBallGamePlay] = useState(false);
  //const [health, setHealth] = useState(100);
  const [showBallTimeout, setShowBallTimeout] = useState(false);

  let audio;
  const playSound = () => {
    if (audio === undefined) {
      audio = new Howl({
        src: ['/lightsaber.mp3']
      });
    }

    audio.play();
  };
  const userAgent = navigator.userAgent;
  const getDevice = () => {
    if (/android/i.test(userAgent)) {
      return 'Android';
    }
    if (/iPhone/i.test(userAgent)) {
      return 'iPhone';
    }
    return 'Unknown Device';
  };

  const getBrowser = () => {
    if (/chrome/i.test(userAgent)) {
      return 'Chrome';
    }

    if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
      return 'Safari';
    }

    if (/firefox/i.test(userAgent)) {
      return 'Firefox';
    }

    if (/msie|trident/i.test(userAgent)) {
      return 'Internet Explorer';
    }

    if (/edge/i.test(userAgent)) {
      return 'Edge';
    }

    return 'Unknown Browser';
  };

  const deviceInfo = {
    deviceType: getDevice(),
    browserType: getBrowser()
  };

  const sendOrientationData = async (data) => {
    // Include email in the data to be sent
    const dataWithEmail = { ...data, email };
  
    try {
      // Send device orientation data to Flask REST endpoint
      const response = await fetch(`https://data.mongodb-api.com/app/${REALM_APP_ID}/endpoint/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithEmail),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Handle successful response here if needed
      
    } catch (error) {
      console.error('Error sending data to DataAPI:', error);
    }
  };
  

/*   const updateHealth = (h) => {
    if (h > 0) {
      return (h - 1);
    } else {
      handleReplay();

      return 0;
    }
  } */
  const handleDeviceMotion = (event) => {
    var acceleration = "";
    let hueValue = 0;
    var lbswish = false;


    if (event.accelerationIncludingGravity) {
      // Get acceleration data from device
      acceleration = event.accelerationIncludingGravity;
      const threshold = 15;
      // If acceleration is above threshold, play sound
      if (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) {
        lbswish = true;
        playSound();
      }

    }

    if (typeof event.beta !== 'undefined' && typeof event.gamma !== 'undefined') {
      const frontToBack_degrees = event.beta;
      const leftToRight_degrees = event.gamma;
      hueValue = (event.alpha + 360) % 360; // Ensure the hue is within 0-360 degrees
      setHue(hueValue);

      // Update velocity according to how tilted the phone is
      // Since phones are narrower than they are long, double the increase to the x velocity
      vx = vx + leftToRight_degrees * updateRate * 2;
      vy = vy + frontToBack_degrees * updateRate;

      // Update position and clip it to bounds
      px = px + vx * .5;
      if (px > 98 || px < 0) {
        px = Math.max(0, Math.min(98, px)) // Clip px between 0-98
        vx = 0;
      }

      py = py + vy * .5;
      if (py > 98 || py < 0) {
        py = Math.max(0, Math.min(98, py)) // Clip py between 0-98
        vy = 0;
      }

      const dot = document.getElementsByClassName("indicatorDot")[0]
      if (dot !== undefined) {
        dot.setAttribute('style', "left:" + (px) + "%;" +
          "top:" + (py) + "%;");
        dotWithinBorders(px, py);

      }
    }
    sendOrientationData({ deviceInfo: deviceInfo, swosh: lbswish, orientation: { alpha: event.alpha, beta: event.beta, gamma: event.gamma, hue: hueValue }, ballGame: { lightSaberPoints: lightSaberPoints, indicatorDotPx: px, indicatorDotPy: py }, acceleration: { x: acceleration.x, y: acceleration.y, z: acceleration.z } });


  };

  const dotWithinBorders = (px, py) => {
    if (px > 5 && px < 80 && py > 5 && py < 94) {
      setBorderStateColor("green");
      return true;

    } else {
      setLightSaberPoints((prevLightSaberPoints) => prevLightSaberPoints)
      setBorderStateColor("red");
      setMultiplierPoints(1);
      return false;
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setReplay(true);
    // Check if email is provided
    if (email) {
      // Show the lightsaber if email is provided        
      setSignUpForm(false);
      setBallGamePlay(true);
      setReplay(true);      
      setShowLightsaber(false);  // Hide the lightsaber initially                      
      if (window.DeviceMotionEvent === undefined) {
        window.addEventListener('deviceorientation', handleDeviceMotion);
      }
      else {
        window.addEventListener("devicemotion", handleDeviceMotion, true);
        window.addEventListener('deviceorientation', handleDeviceMotion);
      }
     

    } else {
      alert('Please provide an email address.');
    }
  };

  useEffect(() => {
    let timeoutId;
    if (showBallGamePayInformation) {
      timeoutId = setTimeout(() => {
        setBallContainer(true);
        setBallGamePlay(false); // Hide the ball game section after 5 seconds
        setShowBallTimeout(true); // Indicate that the 5 seconds have completed
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [showBallGamePayInformation])

  const handleReplay = async () => {
    window.removeEventListener("devicemotion", handleDeviceMotion, true);
    window.removeEventListener('deviceorientation', handleDeviceMotion);
    setShowLightsaber(false);
    setBoxContainer(true);
    setBallContainer(false);

    try {
        // Fetch device movements data for the provided email from the backend
        const response = await fetch(`https://data.mongodb-api.com/app/${REALM_APP_ID}/endpoint/replay?email=${email}`);
        const data = await response.json();

        setReplayData(data); // Store the retrieved data
        setReplay(true); // Start the replay animation
        updateBoxRotation(data);
    } catch (error) {
        console.error('Error retrieving replay data:', error);
    }
};

  const resetBoxRotation = () => {
    const rotationZ = `rotateZ(0deg)`;
    const rotationX = `rotateX(0deg)`;
    const rotationY = `rotateY(0deg)`;
    const hueValue = hue;
    setBoxRotation({ z: rotationZ, x: rotationX, y: rotationY, hue: hueValue });
  }

  // Function to replay recorded device orientation
  const updateBoxRotation = () => {
    resetBoxRotation();
    const orientationData = replayData;
    orientationData.forEach(item => {
      const { alpha, beta, gamma, hue } = item.orientation;
      // Calculate the rotation angles based on orientation data (adjust as needed)
      const rotationZ = `rotateZ(${alpha}deg)`;
      const rotationX = `rotateX(${beta}deg)`;
      const rotationY = `rotateY(${gamma}deg)`;
      const hueValue = hue;
      // Update the 3D box rotation
      setTimeout(() => {
        setBoxRotation({ z: rotationZ, x: rotationX, y: rotationY, hue: hueValue });
      }, 300); // Adjust the replay speed as needed

    });
  };

  const askForSensorAccess = () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') { // Check if the API exists
      DeviceMotionEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            // Permission granted. You can now add your event listeners here
            window.addEventListener('devicemotion', (event) => {
              // Handle the device motion event here
              console.log(event);
            });
          } else {
            console.log('Device motion permission not granted');
          }
        })
        .catch(console.error); // Handle any errors that occurred during the request
    } else {
      // The browser does not support the requestPermission API, assume permission is already granted
      window.addEventListener('devicemotion', (event) => {
        // Handle the device motion event here
        console.log(event);
      });
    }
  };

  useEffect(() => {
    let counterInterval;
    if (counter > 0 && !signUpForm && showBallTimeout) {  // Ensure counter only starts if the signUpForm is not visible
      counterInterval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
        setMultiplierPoints((prevMultiplierPoints) => prevMultiplierPoints + 1)
        if (borderStateColor === "green") {
          setLightSaberPoints((prevLightSaberPoints) => prevLightSaberPoints + 60 * multiplierPoints)
        }
      }, 1000);
    } else if (counter <= 0) {
      clearInterval(counterInterval);
      setBallContainer(false);
      if (!showReplayGamePlay) {
        setShowLightsaber(true);  // Show the lightsaber if counter reaches 0 and dot is within borders
      }
    }
    return () => {
      clearInterval(counterInterval);
    };
  }, [showReplayGamePlay, counter, showBallTimeout,signUpForm, lightSaberPoints, showLightsaber, multiplierPoints, borderStateColor]);

  return (

    <div className="App">

      <CssBaseline />
      
      {showLightsaber && <LightSaber hue={hue} />}
      {signUpForm && <SignUpForm email={email} setEmail={setEmail} handleSubmit={handleSubmit} />}
      {showBallGamePayInformation && <BallGamePlayInformation borderStateColor={borderStateColor} />}
      {showReplayGamePlay && <ReplayGamePlay boxRotation={boxRotation} />}
      {showBallGamePlay && (
                <BallGamePlay
                    borderColor={borderStateColor}
                    counter={counter}
                    lightSaberPoints={lightSaberPoints}
                    askForSensorAccess={askForSensorAccess} // Make sure this function is defined in HomePage
                />
            )}
      
      {showReplay && (
        <div className="DarthVader">

          <Button variant="contained" onClick={handleReplay} color="primary">Replay Movements</Button>
        </div>
      )}      

    </div>
  )
}

export default HomePage;
