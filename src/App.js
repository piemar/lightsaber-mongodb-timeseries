import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/HomePage'; 
import DarthVader from './pages/DarthVaderPage'; 
import DashBoard from './pages/DashBoardPage'; 
import DPSChart from "./charts/DpsChartPage";
import DeviceTypeChart from './charts/DeviceTypeChartPage';
import LeaderBoardChart from './charts/LeaderBoardChartPage';

function App() {
  const REALM_APP_ID = "starwars-lightsaber-timeseries-ffzoo"  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home realm={REALM_APP_ID}/>} />
        <Route path="/boss" element={<DarthVader health="100" realm={REALM_APP_ID}/>} />
        <Route path="/dashboard" element={<DashBoard realm={REALM_APP_ID}/>} />
        <Route path="/dpsChart" element={<DPSChart realm={REALM_APP_ID}/>} />
        <Route path="/leaderboardChart" element={<LeaderBoardChart realm={REALM_APP_ID}/>} />
        <Route path="/devicetypeChart" element={<DeviceTypeChart realm={REALM_APP_ID}/>} />
      </Routes>
    </Router>
  );
}

export default App;