import React, { useState, useEffect } from 'react';
import {UseHealth,ProgressBarComponent} from '../components/UseHealth';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function DarthVader(props) {
  const navigate = useNavigate();
  const { health, setHealth } = UseHealth(props.realm, props.health, props.shouldPulsate);
  const REALM_APP_ID = props.realm;
  const [defeated, showDefeated] = useState(false);  
    useEffect(() => {      
      const intervalId = setInterval(async () => {
            if (health===0){
              clearInterval(intervalId);
              //showProgressBar(false);
              showDefeated(true);
            }    
      }, 1000); // Every second  
      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }, [health]);
    const restartGame = async () => {
      setHealth(props.health);
      showDefeated(false);
      await fetch(`https://data.mongodb-api.com/app/${REALM_APP_ID}/endpoint/reset`);
      navigate('/');;
        
    };
  return (
    <div className="AppDarthVader">
      {!defeated && (
        <div className="boundary" style={{display:"flex", justifyContent: "center",alignItems: "center",height: "100vh", backgroundSize: "cover"}}>
          <ProgressBarComponent health={health} shouldPulsate={false} />
        </div>
      )}
      {defeated && (
        <div className="boundary_defeated">
          <Typography variant="h4" style={{ textAlign: "center", color: "green" }}>
            <div style={{color:'turquoise',fontWeight:700, animation: "pulsate 0.5s infinite alternate", marginTop: "30px" }}>
              You defeated Darth Vader
            </div>
          </Typography>
          <div style={{display:"flex", justifyContent: "center",alignItems: "center",height: "100vh", backgroundSize: "cover"}}>
          <Button variant="contained" color="primary" onClick={restartGame} >
            Restart Game
          </Button>
          </div>
        </div>
      )}
    </div>
  );}
