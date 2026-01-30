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

      console.log("📝 Registration attempt:", registerData.email);

      // Check if user already exists
      const existingUser = await DatabaseService.findUserByEmail(
        registerData.email,
      );
      if (existingUser) {
        console.log("❌ User already exists:", registerData.email);
        throw new AppError("El usuario ya existe", 409);
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(
        registerData.password,
        saltRounds,
      );

      // Generate validation token
      const validationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date();
      tokenExpires.setHours(tokenExpires.getHours() + 24); // 24 hours

      // Create user data
      const userData = {
        email: registerData.email,
        name: registerData.name,
        lastName: registerData.lastName,
        role: registerData.role,
        program: registerData.program || "Sin programa",
        password: hashedPassword,
        studentId: registerData.studentId || null,
        professorId: registerData.professorId || null,
        semester: registerData.semester || null,
        enrollmentDate: new Date(),
        status: "PENDIENTE",
        validationToken,
        tokenExpires,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("💾 Creating user in database with PENDING status...");

      // Create user in database
      const user = await DatabaseService.createUser(userData);

      console.log("✅ User created successfully:", user.id);

      // Send Welcome Email with validation token (Non-blocking)
      EmailService.sendWelcomeEmail(
        user.email,
        user.name,
        validationToken,
      ).catch((err) => {
        console.error(
          "⚠️ Falló el envío del correo de bienvenida, pero el usuario fue creado:",
          err.message,
        );
      });

      // Generate JWT token
      const token = this.generateToken(user.id, user.email, user.role);

      const response: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          role: user.role,
          studentId: user.studentId,
          professorId: user.professorId,
          program: user.program,
          semester: user.semester,
          avatar: user.avatar,
          enrollmentDate: user.enrollmentDate,
          status: user.status,
          gpa: user.gpa,
          credits: user.credits,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };

      console.log(
        "🎉 Registration successful (Pending activation):",
        user.email,
      );

      res.status(201).json({
        success: true,
        data: response,
        message:
          "Usuario registrado. Por favor, revisa tu correo para validar tu cuenta.",
      });
    } catch (error) {
      console.error("❌ Registration error:", error);
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

      // We don't activate yet, we just confirm the email is valid
      // The status stays PENDING until admin approves
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

      console.log("🔑 Login attempt:", loginData.email);

      // Find user by email
      const user = await DatabaseService.findUserByEmail(loginData.email);
      if (!user) {
        console.log("❌ User not found:", loginData.email);
        throw new AppError("Credenciales inválidas", 401);
      }

      // Compare passwords (temporarily stored in password field)
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
          studentId: user.studentId,
          professorId: user.professorId,
          program: user.program,
          semester: user.semester,
          avatar: user.avatar,
          enrollmentDate: user.enrollmentDate,
          status: user.status,
          gpa: user.gpa,
          credits: user.credits,
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
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    );
  }
}
