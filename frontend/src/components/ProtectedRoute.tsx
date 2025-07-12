import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  // const isAuthenticated = true;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;