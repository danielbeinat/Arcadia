import { Router } from "express";
import { AuthController } from "@/controllers/AuthController";
import { validateRequest } from "@/middleware/validation";
import { loginSchema, registerSchema } from "@/utils/validation";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/validate", authController.validateAccount);
router.post("/logout", authController.logout);

export default router;
