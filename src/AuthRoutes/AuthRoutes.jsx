import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthProvider";

export const AuthRoutes = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    // user is not authenticated
    return <Navigate to="/admin/dashboard" />;
  }
  return children;
};
