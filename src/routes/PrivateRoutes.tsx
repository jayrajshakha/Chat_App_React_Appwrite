import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoutes = () => {
  const { user, userSession } = useAuth();

  return user?.$id && userSession?.$id ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
