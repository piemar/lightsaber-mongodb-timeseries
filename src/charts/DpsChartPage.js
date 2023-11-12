import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
export default function DPSChart(props) {
  const [data, setData] = useState([{
    "dps":2,
    "date":"2023-11-08T11:50:10.000+00:00",
    "AvgDps10":3,
    "AvgDps100":2
  }]); // Initial data

  const REALM_APP_ID = props.realm;
  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`https://data.mongodb-api.com/app/` + REALM_APP_ID + `/endpoint/dps`);
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
          <LineChart
            
            height={400}
            
            series={[
              { data: data.map(item => item.dps), label: 'DPS', yAxisKey: 'leftAxisId' },
              { data: data.map(item => item.AvgDps10), label: 'AverageDPS10', yAxisKey: 'leftAxisId' },
              { data: data.map(item => item.AvgDps100), label: 'AverageDPS10', yAxisKey: 'leftAxisId' }
            ]}
            xAxis={[{ scaleType: 'point', data: data.map(item => item.date) }]}
            yAxis={[{ id: 'leftAxisId' }, { id: 'rightAxisId' }]}
            rightAxis="rightAxisId"
          />
  );
}
