import { Router } from "express";
import { contactController } from "../controllers/ContactController";

const router = Router();

router.post("/form", contactController.submitContactForm);
router.post("/chatbot", contactController.submitChatbotInquiry);

export default router;
