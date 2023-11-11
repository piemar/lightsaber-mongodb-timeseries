import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './HomePage'; 
import DarthVader from './DarthVaderPage'; 
import DashBoard from './DashBoardPage'; 
function App() {
  const REALM_APP_ID = "starwars-lightsaber-timeseries-onvhi"  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home realm={REALM_APP_ID}/>} />
        <Route path="/boss" element={<DarthVader health="100" realm={REALM_APP_ID}/>} />
        <Route path="/chart" element={<DashBoard realm={REALM_APP_ID}/>} />
      </Routes>
    </Router>
  );
}

export default App;