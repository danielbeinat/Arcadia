import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthState, User, RegisterInput } from "../types/User";
import { useNotifications } from "../Components/Notifications/NotificationSystem";
import { api } from "../services/api";
import { supabase } from "../lib/supabase";

interface AuthContextValue extends Omit<AuthState, "isLoading"> {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterInput) => Promise<boolean>;
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
    let isInitialized = false;

    const initializeAuth = async () => {
      if (isInitialized) return;
      isInitialized = true;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          try {
            const userProfile = await api.getProfile();
            setUser(userProfile);
          } catch (profileError) {
            console.error("Profile error:", profileError);
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    initializeAuth();

    return () => subscription.unsubscribe();
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

  const register = async (data: RegisterInput): Promise<boolean> => {
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
