import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdminAuthHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);
    }
  }, [location]);

  return null;
};
export default AdminAuthHandler;