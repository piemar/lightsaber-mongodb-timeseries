// ShowBallGame.js
import React from 'react';
import { Typography } from '@mui/material';

const BallGamePlayInformation = ({ borderStateColor }) => {
    return (
        <div className="DarthVader boundary holdgameplay" style={{ borderColor: borderStateColor }}>
          <Typography variant="h6" style={{ textAlign: "center", color: "white" }}>
            <div style={{ animation: "pulsate 0.5s infinite alternate", marginTop: "30px" }}>Hold your device flat, game starts in 5 seconds</div>
          </Typography>
        </div>
    );
};

export default BallGamePlayInformation;
