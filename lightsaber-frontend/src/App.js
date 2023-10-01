import React, { useEffect, useState } from 'react';
import { Howl } from 'howler'; 
import { Button, CssBaseline, TextField, Typography, Container } from '@mui/material'; // Import Material-UI components
import './App.css';

function App() {
  const [email, setEmail] = useState(''); // State for email input
  const [showLightsaber, setShowLightsaber] = useState(false); // State to control lightsaber visibility
  const [showBoxContainer, setBoxContainer] = useState(false); // State to control lightsaber visibility
  const [showReplay, setReplay] = useState(false); // State to control lightsaber visibility
  const [signUpForm, setSignUpForm] = useState(true); // State to control lightsaber visibility
  const [hue, setHue] = useState(0); // Initialize hue to 0
  const [audio] = useState(new Howl({ src: ['/lightsaber.mp3'] })); // Load audio file
  const [lastOrientation, setLastOrientation] = useState({ alpha: 0, beta: 0, gamma: 0, hue:0 });
  const [movementStopped, setMovementStopped] = useState(false);
  const [isPulsating, setIsPulsating] = useState(false);
  const [replayData, setReplayData] = useState([]); // State to store retrieved replay data
  const [replayIndex, setReplayIndex] = useState(0); // State to keep track of the current replay index
  const [boxRotation, setBoxRotation] = useState({ x: 0, y: 0, z: 0, hue:0 }); // State to store 3D box rotation angles
  
  const sendOrientationData = (data) => {
    // Include email in the data to be sent
    const dataWithEmail = { ...data, email };

    // Send device orientation data to Flask REST endpoint
    fetch('http://localhost:5000/data', {
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
        console.error('Error sending data to Flask:', error);
      });
  };

  const handleOrientation = (event) => {
    // Calculate hue based on alpha value and map it to a color range
    const hueValue = (event.alpha + 360) % 360; // Ensure the hue is within 0-360 degrees
    setHue(hueValue);

    if (hueValue !== hue) {
      audio.play(); // Play audio when the color changes
    }

    // Check if movement has stopped
    const isMovementStopped =
      Math.abs(event.alpha - lastOrientation.alpha) < 1 &&
      Math.abs(event.beta - lastOrientation.beta) < 1 &&
      Math.abs(event.gamma - lastOrientation.gamma) < 1;
      if(showReplay==false){
        sendOrientationData({ alpha: event.alpha, beta: event.beta, gamma: event.gamma, hue:hueValue });
      }
    if (isMovementStopped) {
      setMovementStopped(true);
    } else {
      setMovementStopped(false);
    }

    // Update the last orientation
    setLastOrientation({ alpha: event.alpha, beta: event.beta, gamma: event.gamma, hue:hueValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReplay(true);
    // Check if email is provided
    if (email) {
      // Show the lightsaber if email is provided
      setReplay(true);
      setShowLightsaber(true);
      setSignUpForm(false)            
      // Start listening for device orientation
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      alert('Please provide an email address.');
    }
  };

  const handleReplay = () => {
    setShowLightsaber(false);
    setBoxContainer(true)
    // Fetch device movements data for the provided email from the backend
    fetch(`http://localhost:5000/replay?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        setReplayData(data); // Store the retrieved data
        setReplay(true); // Start the replay animation
        setReplayIndex(0); // Reset the replay index to the beginning
        
      })
      .catch((error) => {
        console.error('Error retrieving replay data:', error);
      });
  };

  // Function to update the 3D box rotation based on orientation data
  const updateBoxRotation = (orientationData) => {
    const { alpha, beta, gamma, hue } = orientationData;
    // Calculate the rotation angles based on orientation data (adjust as needed)
    const rotationZ = `rotateZ(${alpha}deg)`;
    const rotationX = `rotateX(${beta}deg)`;
    const rotationY = `rotateY(${gamma}deg)`;
    const hueValue = hue;
    

    // Update the 3D box rotation
    setBoxRotation({ z: rotationZ, x: rotationX, y: rotationY, hue: hueValue  });
  };

  useEffect(() => {
    let replayTimer;

    if (showReplay && replayIndex < replayData.length) {
      const eventData = replayData[replayIndex];      
      //handleOrientation(eventData);

      // Update the 3D box rotation based on the replayed data
      updateBoxRotation(eventData);

      replayTimer = setTimeout(() => {
        setReplayIndex((prevIndex) => prevIndex + 1);
      }, 100); // Adjust the replay speed as needed
    } 

    return () => {
      clearTimeout(replayTimer);
    };
  }, [showReplay, replayIndex, replayData]);

  return (
    <div className="App">
      <CssBaseline />

      {showBoxContainer && (
        <div className="box-container">
          
          <div className="box" style={{backgroundColor: `hsl(${boxRotation.hue}, 100%, 50%)`, transform: `${boxRotation.x} ${boxRotation.y} ${boxRotation.z}` }}/>
        </div>
      )}


  
      
      {showLightsaber && (
        <div className={`lightsaber ${isPulsating ? 'pulsate' : ''}`} style={{ backgroundColor: `hsl(${hue}, 100%, 50%)`, width: '100vw', height: '90vh' }}>
        </div>
       )}  
      {signUpForm && (
        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="h5">
            Lightsaber Motion Control
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
          {showReplay && (
            <Button variant="contained" onClick={handleReplay} color="primary">Replay Movements</Button>
          )}

    </div>
  );
}

export default App;
