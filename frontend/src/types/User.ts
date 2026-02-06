export type UserRole = "STUDENT" | "PROFESSOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  studentId?: string;
  professorId?: string;
  program: string;
  semester?: number;
  avatar?: string;
  enrollmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status: "APROBADO" | "ACTIVO" | "PENDIENTE" | "RECHAZADO" | "INACTIVO" | "SUSPENDIDO";
  gpa?: number;
  credits?: number;
  dniUrl?: string;
  degreeUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

export interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  program?: string;
  studentId?: string;
  professorId?: string;
  semester?: number;
  dniUrl?: string;
  degreeUrl?: string;
}
