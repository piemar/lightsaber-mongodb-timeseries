  import React, { useEffect, useState } from 'react';
  import { BarChart } from '@mui/x-charts/BarChart';
  const chartSetting = {
      xAxis: [
        {
          label: 'Damage',
        },
      ],
      
      height: 400,
      margin: { left: 200 }, // Adjust bottom margin
      
    };    

    
  const valueFormatter = (value) => `${value}`;
  export default function HorizontalBarChart(props) { 
    const REALM_APP_ID = props.realm;

    const [data, setData] = useState([{ id: 0, value: 10, label: 'series A' }]); // Initial data

    useEffect(() => {
      const intervalId = setInterval(async () => {
        try {
          const response = await fetch(`https://data.mongodb-api.com/app/${REALM_APP_ID}/endpoint/tophits`);
          if (!response.ok) {
            console.log(`HTTP error! status: ${response.status}`);
            return;
          }
          const newData = await response.json();
          if (Array.isArray(newData)) {
            setData(newData);
          }
        } catch (error) {
          console.error("Fetching error: ", error);
        }
      }, 500); // Every half second
  
      return () => clearInterval(intervalId);
    }, [REALM_APP_ID]); // Dependency array
  
    // Check if data is not empty and is an array before rendering the chart
    if (!Array.isArray(data) || data.length === 0) {
      return <div>No data availble yet</div>;
    }

    return (
      <BarChart
        dataset={data}
        yAxis={[{ scaleType: 'band', dataKey: 'id' }]}
        series={[{ dataKey: 'value', label: 'Leaderbord', valueFormatter }]}
        layout="horizontal"
        {...chartSetting}
      />
    );
  }