
import React, { useState, useEffect } from 'react';
export default function DarthVader(props)
{
  const [health, setHealth] = useState(props.health);
  useEffect(() => {
    setHealth(props.health);
  }, [health,props])
  return (
    <>
      <div className="health-bar">
        <div className="health" style={{ width: `${health}%`, transition: 'width 0.5s' }}>
          {health}%
        </div>
      </div>
      
    </>
  );
}
