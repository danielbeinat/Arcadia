import { Response, NextFunction } from "express";
import { DatabaseService } from "@/services/DatabaseService";
import { AuthenticatedRequest, ApiResponse } from "@/types";
import { AppError } from "@/middleware/errorHandler";

export class DegreeController {
  getAllDegrees = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const degrees = await DatabaseService.getAllDegrees();

      res.status(200).json({
        success: true,
        data: degrees,
        message: "Carreras obtenidas exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  getDegreeById = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de carrera requerido", 400);
      const degree = await DatabaseService.findDegreeById(id);

      if (!degree) {
        throw new AppError("Carrera no encontrada", 404);
      }

      res.status(200).json({
        success: true,
        data: degree,
        message: "Carrera obtenida exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  createDegree = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const degreeData = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newDegree = await DatabaseService.createDegree(degreeData);

      res.status(201).json({
        success: true,
        data: newDegree,
        message: "Carrera creada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  updateDegree = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de carrera requerido", 400);
      const degreeData = {
        ...req.body,
        updatedAt: new Date().toISOString(),
      };
      const updatedDegree = await DatabaseService.updateDegree(id, degreeData);

      if (!updatedDegree) {
        throw new AppError("Carrera no encontrada", 404);
      }

      res.status(200).json({
        success: true,
        data: updatedDegree,
        message: "Carrera actualizada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteDegree = async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new AppError("ID de carrera requerido", 400);
      await DatabaseService.deleteDegree(id);

      res.status(200).json({
        success: true,
        message: "Carrera eliminada exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
