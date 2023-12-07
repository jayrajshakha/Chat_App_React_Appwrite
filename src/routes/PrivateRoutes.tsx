import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PrivateRoutes = () => {
  const { user } = useAuth();

  
  return user?.$id ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
