import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RequiredAuth = ({ children }) => {
  const location = useLocation();
  const login = useSelector((state) => state.auth.login);

  if (!login) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  return children;
};

export default RequiredAuth;
