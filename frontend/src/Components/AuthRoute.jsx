import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const AuthRoute = () => {
  const { user } = useContext(UserContext);

  return user.token ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;
