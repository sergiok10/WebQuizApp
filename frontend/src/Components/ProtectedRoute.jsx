import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, setUser } = useContext(UserContext);

  if (user.role !== requiredRole) {
    // If the user's role doesn't match the required role, navigate to the unauthorized page
    return <Navigate to="/unauthorized" />;
  }

  // Render the protected route if authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;
