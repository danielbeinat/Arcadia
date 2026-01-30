import { z } from "zod";
import { UserRole, DegreeType, CourseStatus } from "@/types";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["STUDENT", "PROFESSOR", "ADMIN"]),
  program: z.string().optional(),
  dniUrl: z.string().optional(),
  degreeUrl: z.string().optional(),
  country: z.string().optional(),
  docType: z.string().optional(),
  docNumber: z.string().optional(),
  nationality: z.string().optional(),
  phonePrefix: z.string().optional(),
  phoneNumber: z.string().optional(),
  degree: z.string().optional(),
  programType: z.string().optional(),
  startPeriod: z.string().optional(),
});

export const degreeSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  type: z.enum(["CARRERA", "CURSO"]),
  duration: z.number().min(1, "La duración debe ser al menos 1 semestre"),
  credits: z.number().min(1, "Los créditos deben ser al menos 1"),
  faculty: z.string().min(2, "La facultad debe tener al menos 2 caracteres"),
  requirements: z.array(z.string()).default([]),
  subjects: z.array(z.string()).default([]),
});

export const courseSchema = z.object({
  code: z.string().min(3, "El código debe tener al menos 3 caracteres"),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  credits: z.number().min(1, "Los créditos deben ser al menos 1"),
  semester: z.number().min(1, "El semestre debe ser al menos 1"),
  professorId: z.string().uuid("ID de profesor inválido"),
  degreeId: z.string().uuid("ID de carrera inválido"),
  schedule: z.string().min(5, "El horario debe tener al menos 5 caracteres"),
  classroom: z.string().optional(),
  maxStudents: z
    .number()
    .min(1, "El máximo de estudiantes debe ser al menos 1"),
  prerequisites: z.array(z.string()).default([]),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .optional(),
  avatar: z.string().url("URL de avatar inválida").optional(),
  program: z.string().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "La contraseña actual debe tener al menos 6 caracteres"),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().min(1, "La página debe ser al menos 1").default(1),
  limit: z.coerce
    .number()
    .min(1, "El límite debe ser al menos 1")
    .max(100, "El límite máximo es 100")
    .default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
