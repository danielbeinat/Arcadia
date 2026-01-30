import { Response, NextFunction } from "express";
import { DatabaseService } from "@/services/DatabaseService";
import { AuthenticatedRequest, ApiResponse } from "@/types";
import { AppError } from "@/middleware/errorHandler";

export class CourseController {
  getAllCourses = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const courses = await DatabaseService.getAllCourses();

      res.status(200).json({
        success: true,
        data: courses,
        message: "Cursos obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getCourseById = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de curso requerido", 400);
      const course = await DatabaseService.findCourseById(id);

      if (!course) {
        throw new AppError("Curso no encontrado", 404);
      }

      res.status(200).json({
        success: true,
        data: course,
        message: "Curso obtenido exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  createCourse = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const courseData = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newCourse = await DatabaseService.createCourse(courseData);

      res.status(201).json({
        success: true,
        data: newCourse,
        message: "Curso creado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  updateCourse = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de curso requerido", 400);
      const courseData = {
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      const updatedCourse = await DatabaseService.updateCourse(id, courseData);

      if (!updatedCourse) {
        throw new AppError("Curso no encontrado", 404);
      }

      res.status(200).json({
        success: true,
        data: updatedCourse,
        message: "Curso actualizado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de curso requerido", 400);
      await DatabaseService.deleteCourse(id);

      res.status(200).json({
        success: true,
        message: "Curso eliminado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  enrollInCourse = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const { id: courseId } = req.params;
      if (!courseId) throw new AppError("ID de curso requerido", 400);
      const enrollment = await DatabaseService.enrollStudent(
        req.user.userId,
        courseId,
      );

      res.status(201).json({
        success: true,
        data: enrollment,
        message: "Inscripción realizada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  dropCourse = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const { id: courseId } = req.params;
      if (!courseId) throw new AppError("ID de curso requerido", 400);
      const dropped = await DatabaseService.dropStudent(
        req.user.userId,
        courseId,
      );

      if (!dropped) {
        throw new AppError("Inscripción no encontrada", 404);
      }

      res.status(200).json({
        success: true,
        message: "Curso abandonado exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getEnrolledCourses = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const courses = await DatabaseService.getStudentEnrollments(
        req.user.userId,
      );

      res.status(200).json({
        success: true,
        data: courses,
        message: "Cursos inscritos obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getMyCourses = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const courses = await DatabaseService.findCoursesByProfessor(
        req.user.userId,
      );

      res.status(200).json({
        success: true,
        data: courses,
        message: "Cursos del profesor obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getCourseStudents = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id: courseId } = req.params;
      if (!courseId) throw new AppError("ID de curso requerido", 400);
      const students = await DatabaseService.getCourseStudents(courseId);

      res.status(200).json({
        success: true,
        data: students,
        message: "Estudiantes del curso obtenidos exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
