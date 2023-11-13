import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TOTAL_LIFE = 8000;
export const ProgressBarComponent =  ({ health, shouldPulsate }) => {
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
    backgroundColor: health > 20 ? 'green' : 'red',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: shouldPulsate ? 'pulsate 1s infinite alternate' : 'none'
  };
  return (
  <div className="health-bar lightsaber" style={healthBarStyle}>
    <div className="health" style={healthStyle}>
      {health}%
    </div>
  </div>
  );
};


export const UseHealth = (realmAppId, initialHealth, shouldPulsate = true) => {
  const [health, setHealth] = useState(initialHealth);
  const navigate = useNavigate();
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://data.mongodb-api.com/app/${realmAppId}/endpoint/swosh`);
        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`);
          return;
        }
        const result = await response.json();

        if (result.numberOfHits !== undefined) {
          const newHealth = Math.round(Math.max((1 - (result.numberOfHits / TOTAL_LIFE)) * 100, 0));
          setHealth(newHealth);
          if(newHealth===0){
            navigate('/boss');;
          }
        }
      } catch (error) {
        console.error("Fetching error: ", error);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [realmAppId,navigate]);



  return { health,setHealth };
};
