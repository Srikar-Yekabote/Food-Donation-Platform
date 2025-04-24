// Logout.jsx
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  return <Navigate to="/" />;
};

export default Logout;