import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material'; // Import Material-UI components
const TOTAL_LIFE = 8000;
export default function DarthVader(props) {
  const REALM_APP_ID = props.realm;
  const [health, setHealth] = useState(props.health);
  const [defeated, showDefeated] = useState(false);
  const [progressBar, showProgressBar] = useState(true);
  //const [data, setData] = useState(props.health);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://data.mongodb-api.com/app/` + REALM_APP_ID + `/endpoint/swosh`);
        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json(); 
              
        if(result.numberOfHits!==undefined){
          setHealth(Math.round(Math.max((0.4 - (result.numberOfHits / TOTAL_LIFE)) * 100, 0)));
          if (health===0){
            clearInterval(intervalId);
            showProgressBar(false);
            showDefeated(true);
          }
  
        }

      } catch (error) {
        console.error("Fetching error: ", error);
      }
    }, 1000); // Every second

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [health, REALM_APP_ID]);

  // Inline styles for the health bar and the Darth Vader background
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full viewport height
    backgroundSize: 'cover'
  };

  const healthBarStyle = {
    position: 'relative',
    width: '50%',
    height: '30px',
    backgroundColor: '#555'
  };

  const healthStyle = {
    width: `${health}%`,
    transition: 'width 0.5s',
    height: '100%',
    backgroundColor: 'green',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div className="App">

    {progressBar && (
    <div style={containerStyle} className="boundary lightsaber pulsate">
      <div className="health-bar" style={healthBarStyle}>
        <div className="health" style={healthStyle}>
          {health}%
        </div>
      </div>
    </div>
    )}
    {defeated && (
    <div style={containerStyle} className="boundary_defeated lightsaber">
      <div >
      <Typography variant="h4" style={{ textAlign: "center", color: "green" }}>
          <div style={{ animation: "pulsate 0.5s infinite alternate", marginTop: "30px" }}>You defeated Darth Vader</div>
        </Typography>

        
      </div>
    </div>
    )}

    </div>
  );
}
