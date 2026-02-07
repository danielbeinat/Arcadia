import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/User";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-600">
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    // Guardamos la ubicación actual para volver después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Si el rol no está permitido, redirigir a una página de no autorizado o al home
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
