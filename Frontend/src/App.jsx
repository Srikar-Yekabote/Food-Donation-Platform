// App.jsx
import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/navbar';
import Login from './component/login';
import Register from './component/register';
import Logout from './component/logout';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [user, setUser] = useState(null);
  
  const handleLogin = useCallback((userData) => {
    setUser(userData);
  }, []);
  
  const handleLogout = useCallback(() => {
    // You might want to make an API call to invalidate the session on the server
    setUser(null);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} />
        <div className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<div className="p-8">Home Page Content</div>} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/available-food" element={<div className="p-8">Available Food Page</div>} />
            
            {/* Logout route - Fixed approach */}
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            
            {/* Protected donor routes */}
            <Route 
              path="/dashboard" 
              element={user && user.role === 'donor' ? <div className="p-8">Donor Dashboard</div> : <Navigate to="/login" />} 
            />
            <Route 
              path="/list-food" 
              element={user && user.role === 'donor' ? <div className="p-8">List Food</div> : <Navigate to="/login" />} 
            />
            <Route 
              path="/donor-analytics" 
              element={user && user.role === 'donor' ? <div className="p-8">Donor Analytics</div> : <Navigate to="/login" />} 
            />
            
            {/* Protected volunteer routes */}
            <Route 
              path="/volunteer-dashboard" 
              element={user && user.role === 'volunteer' ? <div className="p-8">Volunteer Dashboard</div> : <Navigate to="/login" />} 
            />
            <Route 
              path="/volunteer-analytics" 
              element={user && user.role === 'volunteer' ? <div className="p-8">Volunteer Analytics</div> : <Navigate to="/login" />} 
            />
            <Route 
              path="/pickup-location" 
              element={user && user.role === 'volunteer' ? <div className="p-8">Map View</div> : <Navigate to="/login" />} 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<div className="p-8">Page not found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;