import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthState, User, RegisterData } from "../types/User";

interface AuthContextValue extends Omit<AuthState, "isLoading"> {
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "auth-user";
const USERS_STORAGE_KEY = "university-site-users";

interface StoredUser extends User {
  password?: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializar usuarios por defecto si no existen
  useEffect(() => {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      const defaultUsers: StoredUser[] = [
        {
          id: "admin-1",
          email: "admin@universidad.com",
          password: "admin",
          name: "Admin",
          lastName: "Sistema",
          role: "admin",
          program: "Administración",
          enrollmentDate: new Date(),
          status: "active",
        },
        {
          id: "prof-1",
          email: "prof@universidad.com",
          password: "prof",
          name: "Profesor",
          lastName: "Demo",
          role: "professor",
          professorId: "PROF-001",
          program: "Ingeniería",
          enrollmentDate: new Date(),
          status: "active",
        },
      ];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!email || !password) return false;

      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const users: StoredUser[] = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : [];

      const foundUser = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!foundUser) {
        return false;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = foundUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const users: StoredUser[] = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : [];

      if (users.some((u) => u.email === data.email)) {
        throw new Error("El usuario ya existe");
      }

      const newUser: StoredUser = {
        id:
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 15),
        email: data.email,
        password: data.password,
        name: data.name,
        lastName: data.lastName,
        role: data.role,
        studentId:
          data.role === "student"
            ? Math.floor(Math.random() * 100000).toString()
            : undefined,
        professorId:
          data.role === "professor"
            ? "PROF-" + Math.floor(Math.random() * 1000).toString()
            : undefined,
        program: "Ingeniería de Software",
        semester: 1,
        enrollmentDate: new Date(),
        status: "active",
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      // Auto login después del registro
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    const updated: User = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
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
