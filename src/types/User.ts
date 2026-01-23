export type UserRole = "student" | "professor" | "admin";

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
  enrollmentDate: Date;
  status: "active" | "inactive" | "suspended";
  gpa?: number;
  credits?: number;
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
}
