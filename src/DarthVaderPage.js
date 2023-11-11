import React, { useState, useEffect } from 'react';

export default function DarthVader(props) {
  const REALM_APP_ID = props.realm;
  const [health, setHealth] = useState(props.health);
  //const [data, setData] = useState(props.health);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://data.mongodb-api.com/app/` + REALM_APP_ID + `/endpoint/swosh`);
        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`)
        }
        const data2 = await response.json();        
        if(data2.numberOfHits!==undefined){
          console.log(data2.numberOfHits);
        // Assuming the response returns the amount to deduct
        setHealth((currentHealth) => Math.max(currentHealth - data2[0].numberOfHits/1000, 0));
        }

      } catch (error) {
        console.error("Fetching error: ", error);
      }
    }, 1000); // Every second

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

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
    backgroundColor: '#555',
  };

  const healthStyle = {
    width: `${health}%`,
    transition: 'width 0.5s',
    height: '100%',
    backgroundColor: 'green',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    
    <div style={containerStyle} className='boundary lightsaber pulsate'>
      <div className="health-bar" style={healthBarStyle}>
        <div className="health" style={healthStyle}>
          {health}%
        </div>
      </div>
    </div>
  );
}
