// ShowBallBoxContainer.js
import React from 'react';
import { Typography } from '@mui/material';

const BallGamePlay = ({ boxRotation }) => {
    return (
        <Typography variant="h6" style={{ textAlign: "center", color: "Green" }}>
          <div className="box-container" style={{ width: "30vh", height: "50vh" }}>
            <div className="box" style={{ backgroundColor: `hsl(${boxRotation.hue}, 100%, 50%)`, transform: `${boxRotation.x} ${boxRotation.y} ${boxRotation.z}` }} />
          </div>
        </Typography>
    );
    
};

export default BallGamePlay;
