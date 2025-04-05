import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import AuthPage from './comp/LoginPage'
import Dashboard from './comp/Dashboard'

// Function to get cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Check for user_email cookie on component mount and when cookie changes
  useEffect(() => {
    const checkAuth = () => {
      const userEmail = getCookie('user_email');
      setIsLoggedIn(!!userEmail); // Convert to boolean (true if exists, false if not)
    };
    
    // Check initially
    checkAuth();
    
    // Set up an interval to check periodically (optional)
    const intervalId = setInterval(checkAuth, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Create a function to handle logout (can be passed to components that need it)
  const handleLogout = () => {
    // Clear the user_email cookie
    document.cookie = 'user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <AuthPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
