import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { DatabaseService } from "@/services/DatabaseService";
import { EmailService } from "@/services/EmailService";
import {
  AuthenticatedRequest,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types";
import { AppError } from "@/middleware/errorHandler";

export class AuthController {
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const registerData: RegisterRequest = req.body;
      console.log("📝 Datos de registro recibidos (validados):", {
        ...registerData,
        password: "[REDACTED]",
      });

      const email = registerData.email.toLowerCase().trim();

      // Validar Email (Gmail, Outlook, Hotmail)
      const allowedDomains = ["gmail.com", "outlook.com", "hotmail.com"];
      const emailDomain = email.split("@")[1];

      if (!emailDomain || !allowedDomains.includes(emailDomain)) {
        console.warn("⚠️ Dominio de email no permitido:", emailDomain);
        throw new AppError(
          "El correo debe ser una dirección de Gmail, Outlook o Hotmail.",
          400,
        );
      }

      // Validar Password (Mayúscula, minúscula, número y min 8 caracteres)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(registerData.password)) {
        console.warn("⚠️ Contraseña no cumple requisitos de seguridad");
        throw new AppError(
          "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número.",
          400,
        );
      }

      const existingUser = await DatabaseService.findUserByEmail(email);
      if (existingUser) {
        console.warn("⚠️ Intento de registro con email ya existente:", email);
        throw new AppError("El usuario ya existe", 409);
      }

      console.log("🔐 Hasheando contraseña...");
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(
        registerData.password,
        saltRounds,
      );

      console.log("🎫 Generando token de validación...");
      const validationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Manejar archivos subidos a Cloudinary (vía Multer)
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      console.log("📁 Archivos recibidos:", Object.keys(files || {}));

      const dniUrl = files?.dniUrl
        ? (files.dniUrl[0] as any).path
        : registerData.dniUrl;
      const degreeUrl = files?.degreeUrl
        ? (files.degreeUrl[0] as any).path
        : registerData.degreeUrl;

      const userData: any = {
        email,
        name: registerData.name.trim(),
        lastName: registerData.lastName.trim(),
        role: registerData.role,
        program: registerData.program || "Sin programa",
        password: hashedPassword,
        semester: 1,
        enrollmentDate: new Date(),
        status: "PENDIENTE",
        dniUrl,
        degreeUrl,
        country: registerData.country,
        docType: registerData.docType,
        docNumber: registerData.docNumber,
        nationality: registerData.nationality,
        phonePrefix: registerData.phonePrefix,
        phoneNumber: registerData.phoneNumber,
        degree: registerData.degree,
        programType: registerData.programType,
        startPeriod: registerData.startPeriod,
        validationToken,
        tokenExpires,
      };

      if ((registerData as any).studentId)
        userData.studentId = (registerData as any).studentId;
      if ((registerData as any).professorId)
        userData.professorId = (registerData as any).professorId;

      console.log("💾 Creando usuario en la base de datos...");
      const user = await DatabaseService.createUser(userData);
      console.log("✅ Usuario creado con éxito:", user.id);

      EmailService.sendWelcomeEmail(
        user.email,
        user.name,
        validationToken,
      ).catch((err) => {
        console.error(
          "⚠️ Falló el envío del correo de bienvenida:",
          err.message,
        );
      });

      const token = this.generateToken(user.id, user.email, user.role);

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
          studentId: user.studentId ?? undefined,
          professorId: user.professorId ?? undefined,
          program: user.program,
          semester: user.semester ?? undefined,
          avatar: user.avatar ?? undefined,
          dniUrl: user.dniUrl ?? undefined,
          degreeUrl: user.degreeUrl ?? undefined,
          country: user.country ?? undefined,
          docType: user.docType ?? undefined,
          docNumber: user.docNumber ?? undefined,
          nationality: user.nationality ?? undefined,
          phonePrefix: user.phonePrefix ?? undefined,
          phoneNumber: user.phoneNumber ?? undefined,
          degree: user.degree ?? undefined,
          programType: user.programType ?? undefined,
          startPeriod: user.startPeriod ?? undefined,
          enrollmentDate: user.enrollmentDate,
          status: user.status as any,
          gpa: user.gpa ?? undefined,
          credits: user.credits ?? undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };

      res.status(201).json({
        success: true,
        data: response,
        message:
          "Usuario registrado. Por favor, revisa tu correo para validar tu cuenta.",
      });
    } catch (error) {
      next(error);
    }
  };

  validateAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        throw new AppError("Token de validación inválido", 400);
      }

      const user = await DatabaseService.findUserByValidationToken(token);
      if (!user) {
        throw new AppError("Token inválido o expirado", 400);
      }

      await DatabaseService.updateUser(user.id, {
        validationToken: null,
        tokenExpires: null,
      });

      res.status(200).json({
        success: true,
        message: "Cuenta validada exitosamente. Tu solicitud está en revisión.",
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const loginData: LoginRequest = req.body;
      const email = loginData.email.toLowerCase().trim();

      const user = await DatabaseService.findUserByEmail(email);
      if (!user) {
        throw new AppError("Credenciales inválidas", 401);
      }

      if (user.status === "RECHAZADO") {
        throw new AppError(
          "Tu solicitud ha sido rechazada. Contacta con soporte.",
          403,
        );
      }

      if (user.status === "INACTIVO") {
        throw new AppError("Tu cuenta está inactiva.", 403);
      }

      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.password,
      );
      if (!isPasswordValid) {
        console.log("❌ Invalid password for:", loginData.email);
        throw new AppError("Credenciales inválidas", 401);
      }

      // Generate JWT token
      const token = this.generateToken(user.id, user.email, user.role);

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
          studentId: user.studentId ?? undefined,
          professorId: user.professorId ?? undefined,
          program: user.program,
          semester: user.semester ?? undefined,
          avatar: user.avatar ?? undefined,
          enrollmentDate: user.enrollmentDate,
          status: user.status as any,
          gpa: user.gpa ?? undefined,
          credits: user.credits ?? undefined,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };

      console.log("✅ Login successful for:", user.email);

      res.json({
        success: true,
        data: response,
        message: "Inicio de sesión exitoso",
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      next(error);
    }
  };

  subscribeNewsletter = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.body;
      if (!email) {
        throw new AppError("El email es requerido", 400);
      }

      // Validar formato de email simple
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new AppError("Email inválido", 400);
      }

      await EmailService.sendNewsletterSubscriptionEmail(email);

      res.status(200).json({
        success: true,
        message: "Suscripción exitosa. Revisa tu correo.",
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      console.log("🚪 Logout request");

      res.json({
        success: true,
        message: "Sesión cerrada exitosamente",
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
      next(error);
    }
  };

  private generateToken(userId: string, email: string, role: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError("JWT secret not configured", 500);
    }

    return jwt.sign(
      {
        userId,
        email,
        role,
      },
      secret,
      {
        expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
      },
    );
  }
}
