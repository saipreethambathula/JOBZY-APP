import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const CustomerProtectedRoute = () => {
  const token = Cookies.get("token");
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;

  if (!token || !user || user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default CustomerProtectedRoute;
