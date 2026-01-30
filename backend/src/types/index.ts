import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export type UserRole = "STUDENT" | "PROFESSOR" | "ADMIN";
export type UserStatus =
  | "PENDIENTE"
  | "APROBADO"
  | "RECHAZADO"
  | "INACTIVO"
  | "SUSPENDIDO";
export type DegreeType = "CARRERA" | "CURSO";
export type CourseStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type EnrollmentStatus =
  | "PENDIENTE"
  | "INSCRITO"
  | "RETIRADO"
  | "COMPLETADO";

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
  status: UserStatus;
  gpa?: number;
  credits?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Degree {
  id: string;
  name: string;
  description: string;
  type: DegreeType;
  duration: number; // in semesters
  credits: number;
  faculty: string;
  requirements: string[];
  subjects: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  semester: number;
  professorId: string;
  degreeId: string;
  schedule: string;
  classroom?: string;
  maxStudents: number;
  currentStudents: number;
  status: CourseStatus;
  prerequisites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: EnrollmentStatus;
  grade?: number;
  attendance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  program?: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
