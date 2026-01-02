import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user"); // Or your auth check

  if (!user) {
    // Not logged in, redirect to login/sign-in
    return <Navigate to="/" replace />;
  }

  // Logged in, render children components (dashboard)
  return children;
};

export default ProtectedRoute;
