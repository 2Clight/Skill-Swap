import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GetStarted from './components/GetStarted/GetStarted';
import LandingPage from './components/LandingPage/LandingPage';
import ProfileCompletion from './components/ProfileCompletion/ProfileCompletion';  // Import ProfileCompletion
import Dashboard from './components/Dashboard/Dashboard';  // Import Dashboard
import AdminDashboard from './components/AdminDashboard/AdminDashboard';  // Import AdminDashboard
import Certificate from './components/Certificate/Certificate';  // Import Certificate


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/GetStarted" element={<GetStarted />} />
        <Route exact path="/ProfileCompletion" element={<ProfileCompletion />} />
        <Route exact path="/Dashboard" element={<Dashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} /> 
        <Route path="/Certificate" element={<Certificate />} /> 
      </Routes>
    </Router>
  );
}

export default App;
