import React, { useEffect, useState } from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

export default function BasicPie(props) {
  const REALM_APP_ID = props.realm;
  const [data, setData] = useState([{ id: 0, value: 10, label: '--' }]); // Initial data
  const TOTAL = data.map((item) => item.value).reduce((a, b) => a + b, 0);
  const getArcLabel = (params) => {    
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}% ${params.label}`;
  };
  const sizing = {
    margin: { right: -120 },
    width: 600,
    height: 500,
    legend: { hidden: true }
    
  };

  
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://data.mongodb-api.com/app/` + REALM_APP_ID + `/endpoint/devicetype`);
        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`);
          return;
        }
        const newData = await response.json();
        if(newData.length>0){
          setData(newData);
        }
        
      } catch (error) {
        console.error("Fetching error: ", error);
      }
    }, 500); // Every second

    return () => clearInterval(intervalId);
  }, [REALM_APP_ID]); // Empty dependency array

  return (

   <PieChart
      series={[
        {

          data,
          arcLabel: getArcLabel,
          outerRadius:190,
          innerRadius: 20,
          
          
        },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: 'white',
          fontSize: 14,
        },
      }}
      {...sizing}
    />    
    
  );
}
