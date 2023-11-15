import React from 'react';
import { Typography, Button } from '@mui/material';

const BallGaamePlay = ({ borderColor, counter, lightSaberPoints, askForSensorAccess }) => {
    return (
        <div className="DarthVader boundary dot_darth_vader" style={{ borderColor: borderColor }}>
            <Typography variant="h6" style={{ textAlign: "center", color: "white" }}>
                <div style={{ animation: "pulsate 0.5s infinite alternate", marginTop: "30px" }}>
                    Time Remaining: {counter}
                </div>

                <div className='div-with-bg'>
                    <div className='DarthVader' style={{ animation: "pulsate 0.5s infinite alternate" }}>
                        Light Saber Points: {lightSaberPoints}
                    </div>
                </div>
                <Button variant="contained" onClick={askForSensorAccess} color="primary">Ask for sensor</Button>
            </Typography>
            <div className="indicatorDot" style={{ left: "30%", top: "30%" }}></div>
        </div>
    );
};

export default BallGaamePlay;
