import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, TextField, Typography, Container } from '@mui/material'; // Import Material-UI components
import { Howl } from 'howler';
import './App.css';
import DarthVader from './DarthVader';


function App() {
  const REALM_APP_ID = "starwars-lightsaber-timeseries-onvhi"
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
  const [showBoxContainer, setBoxContainer] = useState(false); // State to control for replay container
  const [showReplay, setReplay] = useState(false); // State to control lightsaber visibility
  const [signUpForm, setSignUpForm] = useState(true); // State to control lightsaber visibility
  const [hue, setHue] = useState(0); // Initialize hue to 0

  const [replayData, setReplayData] = useState([]); // State to store retrieved replay data
  const [boxRotation, setBoxRotation] = useState({ x: 0, y: 0, z: 0, hue: 0 }); // State to store 3D box rotation angles
  const [counter, setCounter] = useState(1);
  const [dotPanelGamePlay, setDotPanelGamePlay] = useState(false);
  const [health, setHealth] = useState(100);


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

  const sendOrientationData = (data) => {
    // Include email in the data to be sent
    const dataWithEmail = { ...data, email };

    // Send device orientation data to Flask REST endpoint
    // When running locally change to localhost,

    fetch(`https://data.mongodb-api.com/app/` + REALM_APP_ID + "/endpoint/data", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithEmail),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Handle successful response here if needed
      })
      .catch((error) => {
        console.error('Error sending data to DataAPI:', error);
      });
  };

  const updateHealth = (h) => {
    if (h > 0) {
      return (h - 1);
    } else {
      handleReplay();

      return 0;
    }
  }
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
        setHealth((prevHealth) => updateHealth(prevHealth));
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
      setReplay(true);
      setDotPanelGamePlay(true);
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

  const handleReplay = () => {
    window.removeEventListener("devicemotion", handleDeviceMotion, true);
    window.removeEventListener('deviceorientation', handleDeviceMotion);
    setShowLightsaber(false);
    setBoxContainer(true);
    setDotPanelGamePlay(false);
    // Fetch device movements data for the provided email from the backend
    fetch(`https://data.mongodb-api.com/app/` + REALM_APP_ID + `/endpoint/replay?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        setReplayData(data); // Store the retrieved data
        setReplay(true); // Start the replay animation
        updateBoxRotation(data);
      })
      .catch((error) => {
        console.error('Error retrieving replay data:', error);
      });
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
    if (counter > 0 && !signUpForm) {  // Ensure counter only starts if the signUpForm is not visible
      counterInterval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
        setMultiplierPoints((prevMultiplierPoints) => prevMultiplierPoints + 1)
        if (borderStateColor === "green") {
          setLightSaberPoints((prevLightSaberPoints) => prevLightSaberPoints + 60 * multiplierPoints)
        }
      }, 1000);
    } else if (counter <= 0) {
      clearInterval(counterInterval);
      setDotPanelGamePlay(false);
      if (!showBoxContainer) {
        setShowLightsaber(true);  // Show the lightsaber if counter reaches 0 and dot is within borders
      }
    }
    return () => {
      clearInterval(counterInterval);
    };
  }, [health, showBoxContainer, counter, signUpForm, lightSaberPoints, showLightsaber, multiplierPoints, borderStateColor]);

  return (
    <div className="App">
      {showLightsaber && (
        <DarthVader className="DarthVader" health={health} />
      )}
      <CssBaseline />



      {showLightsaber && (

        <div className={`lightsaber 'pulsate'}`} style={{ backgroundColor: `hsl(${hue}, 100%, 50%)`, width: '100vw', height: '90vh' }}>
        </div>

      )}
      {signUpForm && (

        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5" style={{ textAlign: "center" }}>
            Lightsaber Lores of MongoDB Time Series

          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Start
            </Button>
          </form>
        </Container>
      )}
      {dotPanelGamePlay && (

        <div className="DarthVader boundary" style={{ borderColor: `${borderStateColor}` }}>
          <Typography variant="h6" style={{ textAlign: "center", color: "Green" }}>
            <div style={{ animation: "pulsate 0.5s infinite alternate", marginTop: "30px" }}>Time Remaining: {counter}</div>

            <div className=' div-with-bg'>
              <div className='DarthVader' style={{ animation: "pulsate 0.5s infinite alternate" }}>Light Saber Points: {lightSaberPoints}</div>
            </div>
            <Button id="iosAccessSensor" onClick={askForSensorAccess} style={{ height: "50px" }}>Get Accelerometer Permissions</Button>
          </Typography>
          <div className="indicatorDot" style={{ left: "30%", top: "30%" }}></div>
        </div>
      )}

      {showBoxContainer && (


        <Typography variant="h6" style={{ textAlign: "center", color: "Green" }}>
          <div className="box-container" style={{ width: "30vh", height: "50vh" }}>
            <div className="box" style={{ backgroundColor: `hsl(${boxRotation.hue}, 100%, 50%)`, transform: `${boxRotation.x} ${boxRotation.y} ${boxRotation.z}` }} />
          </div>
        </Typography>

      )}

      {showReplay && (
        <div className="DarthVader">

          <Button variant="contained" onClick={handleReplay} color="primary">Replay Movements</Button>
        </div>
      )}
    </div>
  )
}

export default App;
