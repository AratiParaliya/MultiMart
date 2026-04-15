import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // ❌ Not logged in
    if (!token) {
        return <Navigate to="/SignIn" />;
    }

    // ❌ Admin only route
    if (adminOnly && user?.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;