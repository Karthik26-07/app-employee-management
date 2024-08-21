import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";

const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to={"/login"} />;
};
export default AuthGuard;
