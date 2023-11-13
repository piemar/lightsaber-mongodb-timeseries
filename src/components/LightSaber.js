// LightSaber.js
import React from 'react';
import { ProgressBarComponent } from './UseHealth'; // Adjust import as needed

const LightSaber = ({ hue }) => {
    return (
        <div className={`lightsaber 'pulsate'}`} style={{ backgroundColor: `hsl(${hue}, 100%, 50%)`, width: '100vw', height: '90vh' }}>
          
          
        </div>
    );
};

export default LightSaber;
