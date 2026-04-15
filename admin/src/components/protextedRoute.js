

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ not logged in
  if (!token) {
    return <Navigate to="http://localhost:3000/SignIn" />;
  }

  // ❌ not admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;

