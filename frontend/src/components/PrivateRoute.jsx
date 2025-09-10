import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const payload = jwtDecode(token);

    if (allowedRole === 'owner' && !payload.is_owner) return <Navigate to="/login" replace />;
    if (allowedRole === 'transporter' && !payload.is_transporter) return <Navigate to="/login" replace />;
  } catch (err) {
    console.error('Invalid token:', err);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

