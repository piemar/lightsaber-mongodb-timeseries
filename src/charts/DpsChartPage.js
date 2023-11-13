import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
export default function DPSChart(props) {
  const [data, setData] = useState([]);
  const REALM_APP_ID = props.realm;

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://data.mongodb-api.com/app/${REALM_APP_ID}/endpoint/dps`);
        if (!response.ok) {
          console.log(`HTTP error! status: ${response.status}`);
          return;
        }
        const newData = await response.json();
        if (Array.isArray(newData) && newData.length > 0) {
          setData(newData);
        }
      } catch (error) {
        console.error("Fetching error: ", error);
      }
    }, 500); // Every second

    return () => clearInterval(intervalId);
  }, [REALM_APP_ID]);

  // Check if data is not empty and is an array before rendering the chart
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data yet</div>;
  }  
  return (
          <LineChart
            
            height={400}
            
            series={[
              { data: data.map(item => item.dps), label: 'DPS', yAxisKey: 'leftAxisId',showMark: false },
              { data: data.map(item => item.AvgDps10), label: 'AverageDPS10', yAxisKey: 'leftAxisId',showMark: false },
              { data: data.map(item => item.AvgDps100), label: 'AverageDPS100', yAxisKey: 'leftAxisId',showMark: false }
            ]}
            xAxis={[{ scaleType: 'point', data: data.map(item => item.date) }]}
            yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
            rightAxis="rightAxisId"
          />
  );
}
