import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SecureStorageService from "../store/secure-store";

export const AuthContext = createContext(undefined);

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedIsLoggedIn = SecureStorageService.getItem("isLoggedIn");
    return savedIsLoggedIn ? savedIsLoggedIn : false;
  });

  const [role, setRole] = useState(() => {
    return SecureStorageService.getItem("role");
  });

  const navigate = useNavigate();

  useEffect(() => {
    SecureStorageService.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (role) {
      SecureStorageService.setItem("role", role);
    } else {
      SecureStorageService.removeItem("role");
    }
  }, [role]);

  const login = (role, route) => {
    setIsLoggedIn(true);
    setRole(role);
    navigate(route);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(undefined);
    navigate("");
  };

  const isTeamLead = () => {
    return role === "TEAM_LEAD";
  };
  const isAdmin = async () => {
    return role === "ADMIN";
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, login, logout, isAdmin, isTeamLead }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
