import { Request, Response, NextFunction } from "express";
import { EmailService } from "../services/EmailService";
import { AppError } from "../middleware/errorHandler";

export class ContactController {
  submitContactForm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        nombre,
        apellido,
        email,
        telefono,
        provincia,
        tipoCarrera,
        modalidad,
      } = req.body;

      if (!nombre || !email) {
        throw new AppError("Nombre y email son requeridos", 400);
      }

      await EmailService.sendContactInquiryEmail({
        nombre,
        apellido,
        email,
        telefono,
        provincia,
        tipoCarrera,
        modalidad,
        source: "contact_form",
      });

      res.status(200).json({
        success: true,
        message: "Solicitud enviada correctamente. Un asesor se contactará pronto.",
      });
    } catch (error) {
      next(error);
    }
  };

  submitChatbotInquiry = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { nombre, email, mensaje } = req.body;

      if (!nombre || !email) {
        throw new AppError("Nombre y email son requeridos", 400);
      }

      await EmailService.sendContactInquiryEmail({
        nombre,
        email,
        mensaje,
        source: "chatbot",
      });

      res.status(200).json({
        success: true,
        message: "Consulta enviada correctamente.",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const contactController = new ContactController();
