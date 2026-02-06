import React from "react";
import { Login } from "../Count/Login";
import { Dashboard } from "./Dashboard";
import { useAuth } from "../../hooks/useAuth";

export const Portal: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return <>{isAuthenticated ? <Dashboard /> : <Login />}</>;
};
