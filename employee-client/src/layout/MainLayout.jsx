import { useNavigate, useRoutes } from "react-router-dom";
import { useAuth } from "../lib/hooks/useAuth";
import LoginPage from "../pages/LoginPage";
import { useEffect } from "react";
import RouteBuilder from "../router/RouteBuilder";

const MainLayout = () => {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const getRoutes = () => {
    if (isLoggedIn) {
      return RouteBuilder(role);
    }
    return [];
  };

  const routing = useRoutes([
    { path: "", element: <LoginPage /> },
    ...getRoutes(),
  ]);

  useEffect(() => {
    if (!isLoggedIn) navigate("");
  }, [isLoggedIn]);

  return <>{routing}</>;
};
export default MainLayout;
