import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedAdminRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("admin");

  useEffect(() => {
    if (!isAdminLoggedIn) {
      toast.error("Please login first 🚫");
    }
  }, [isAdminLoggedIn]);

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;