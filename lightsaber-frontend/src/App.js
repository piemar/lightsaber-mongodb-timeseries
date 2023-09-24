import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import { Howl } from 'howler'; // Import Howler for audio
import './App.css';

function App() {
  const [color, setColor] = useState('#FF0000'); // Default color is red
  const [audio] = useState(new Howl({ src: ['/lightsaber.mp3'] })); // Load audio file
  const [lastOrientation, setLastOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [movementStopped, setMovementStopped] = useState(false);
  const [isPulsating, setIsPulsating] = useState(false);

  useEffect(() => {
    const handleOrientation = (event) => {
      // Map device orientation alpha (0-360) to a color (0-360 degrees of hue)
      const hue = Math.floor(event.alpha) % 360;
      const newColor = `hsl(${hue}, 100%, 50%)`;

      if (newColor !== color) {
        setColor(newColor);
        audio.play(); // Play audio when the color changes
        setIsPulsating(true); // Start the pulsating animation
      }

      // Check if movement has stopped
      const isMovementStopped =
        Math.abs(event.alpha - lastOrientation.alpha) < 1 &&
        Math.abs(event.beta - lastOrientation.beta) < 1 &&
        Math.abs(event.gamma - lastOrientation.gamma) < 1;

      if (isMovementStopped) {
        if (!movementStopped) {
          // Movement has just stopped
          console.log('Movement stopped. Alpha:', event.alpha, 'Beta:', event.beta, 'Gamma:', event.gamma);
        }
        setMovementStopped(true);
      } else {
        setMovementStopped(false);
      }

      // Update the last orientation
      setLastOrientation({ alpha: event.alpha, beta: event.beta, gamma: event.gamma });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [color, audio, lastOrientation, movementStopped]);

  return (
    <div className="App">
      <h1>Lightsaber Motion Control</h1>
      <div className={`lightsaber ${isPulsating ? 'pulsate' : ''}`} style={{ backgroundColor: color }}></div>
      <div className="orientation-data">
        <p>Move your device to change the lightsaber color:</p>
        <p>Alpha: The device's motion around the z-axis ({'0° to 360°'})</p>
      </div>
      <div className="color-picker">
        <SketchPicker color={color} onChange={(newColor) => setColor(newColor.hex)} />
      </div>
    </div>
  );
}

export default App;
