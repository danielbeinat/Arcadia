import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthState, User, RegisterData } from "../types/User";
import { useNotifications } from "../Components/Notifications/NotificationSystem";
import { api } from "../services/api";

interface AuthContextValue extends Omit<AuthState, "isLoading"> {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (token) {
          const userProfile = await api.getProfile();
          setUser(userProfile);
        }
      } catch (error) {
        api.clearToken();
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      setUser(response.user);
      addNotification({
        type: "success",
        title: "¡Bienvenido!",
        message: `Hola de nuevo, ${response.user.name}`,
      });
      return true;
    } catch (error: any) {
      addNotification({
        type: "error",
        title: "Error de acceso",
        message: error.message || "Email o contraseña incorrectos",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.register(data);
      setUser(response.user);
      addNotification({
        type: "success",
        title: "¡Cuenta creada!",
        message: `Te has registrado exitosamente, ${response.user.name}`,
      });
      return true;
    } catch (error: any) {
      addNotification({
        type: "error",
        title: "Error de registro",
        message: error.message || "No se pudo completar el registro",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      addNotification({
        type: "info",
        title: "Sesión cerrada",
        message: "Has cerrado sesión correctamente",
      });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const updatedUser = await api.updateProfile(data);
      setUser(updatedUser);
      addNotification({
        type: "success",
        title: "Perfil actualizado",
        message: "Tus datos se han guardado correctamente",
      });
      return true;
    } catch (error: any) {
      addNotification({
        type: "error",
        title: "Error al actualizar",
        message: error.message || "No se pudieron guardar los cambios",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
