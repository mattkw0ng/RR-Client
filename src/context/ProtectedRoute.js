import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ requiredRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // If the user is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.includes(user.role)) {
    // If the user doesn't have the required role, redirect to home
    return <Navigate to="/" replace />;
  }

  // Render the child components if the user is authorized
  return <Outlet />;
};

export default ProtectedRoute;
