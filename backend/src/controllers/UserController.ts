import { Response, NextFunction } from "express";
import { DatabaseService } from "@/services/DatabaseService";
import { EmailService } from "@/services/EmailService";
import { AuthenticatedRequest, ApiResponse } from "@/types";
import { AppError } from "@/middleware/errorHandler";
import bcrypt from "bcryptjs";

export class UserController {
  getPendingUsers = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await DatabaseService.getPendingUsers();

      res.status(200).json({
        success: true,
        data: users.map((u) => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        }),
        message: "Usuarios pendientes obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  approveUser = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de usuario requerido", 400);
      const user = await DatabaseService.findUserById(id);

      if (!user) {
        throw new AppError("Usuario no encontrado", 404);
      }

      const updatedUser = await DatabaseService.activateUser(id);

      // Enviar correo de aprobación
      await EmailService.sendApprovalEmail(updatedUser.email, updatedUser.name);

      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: "Usuario aprobado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  rejectUser = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de usuario requerido", 400);
      const user = await DatabaseService.findUserById(id);

      if (!user) {
        throw new AppError("Usuario no encontrado", 404);
      }

      const updatedUser = await DatabaseService.rejectUser(id);

      // Enviar correo de rechazo
      await EmailService.sendRejectionEmail(
        updatedUser.email,
        updatedUser.name,
      );

      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: "Usuario rechazado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await DatabaseService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users.map((u) => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        }),
        message: "Usuarios obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de usuario requerido", 400);
      const user = await DatabaseService.findUserById(id);

      if (!user) {
        throw new AppError("Usuario no encontrado", 404);
      }

      const { password, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: "Usuario obtenido exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const user = await DatabaseService.findUserById(req.user.userId);

      if (!user) {
        throw new AppError("Usuario no encontrado", 404);
      }

      const { password, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: "Perfil obtenido exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const updatedUser = await DatabaseService.updateUser(req.user.userId, {
        ...req.body,
        updatedAt: new Date().toISOString(),
      });

      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: "Perfil actualizado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  updatePassword = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const { currentPassword, newPassword } = req.body;

      const user = await DatabaseService.findUserByEmail(req.user.email);
      if (!user || !user.password) {
        throw new AppError("Usuario no encontrado", 404);
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isValidPassword) {
        throw new AppError("Contraseña actual incorrecta", 400);
      }

      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      await DatabaseService.updatePassword(req.user.userId, hashedNewPassword);

      res.status(200).json({
        success: true,
        message: "Contraseña actualizada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de usuario requerido", 400);
      const updatedUser = await DatabaseService.updateUser(id, {
        ...req.body,
        updatedAt: new Date().toISOString(),
      });

      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({
        success: true,
        data: userWithoutPassword,
        message: "Usuario actualizado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de usuario requerido", 400);
      await DatabaseService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getStudents = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const students = await DatabaseService.findByRole("STUDENT");

      res.status(200).json({
        success: true,
        data: students.map((s) => {
          const { password, ...studentWithoutPassword } = s;
          return studentWithoutPassword;
        }),
        message: "Estudiantes obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getProfessors = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const professors = await DatabaseService.findByRole("PROFESSOR");

      res.status(200).json({
        success: true,
        data: professors.map((p) => {
          const { password, ...profWithoutPassword } = p;
          return profWithoutPassword;
        }),
        message: "Profesores obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getUserStats = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const stats = await DatabaseService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
        message: "Estadísticas obtenidas exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
