import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './HomePage'; 
import DarthVader from './DarthVaderPage'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boss" element={<DarthVader health="100"/>} />
      </Routes>
    </Router>
  );
}

export default App;