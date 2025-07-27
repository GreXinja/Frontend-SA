import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from "./components/navbar";
import Login from './pages/auth/login';
import Signup from './pages/auth/Signup';
import Landing from './pages/landing';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import SoilInsights from './pages/insights/SoilInsights';
import SolarInsights from './pages/insights/SolarInsights';
import CropInsights from './pages/insights/CropInsights';
import SystemInsights from './pages/insights/SystemInsights';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize AOS and check login status on component mount
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });

    // Check if user is already logged in (e.g., from localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
        />
        {/* Protected insight routes */}
        <Route path="/insights/soil" element={isLoggedIn ? <SoilInsights /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/insights/solar" element={isLoggedIn ? <SolarInsights /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/insights/crop" element={isLoggedIn ? <CropInsights /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/insights/system" element={isLoggedIn ? <SystemInsights /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;