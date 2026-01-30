import { Router } from "express";
import { AuthController } from "@/controllers/AuthController";
import { validateRequest } from "@/middleware/validation";
import { loginSchema, registerSchema } from "@/utils/validation";
import { upload } from "@/middleware/upload";

const router = Router();
const authController = new AuthController();

router.post(
  "/register",
  upload.fields([
    { name: "dniUrl", maxCount: 1 },
    { name: "degreeUrl", maxCount: 1 },
  ]),
  validateRequest(registerSchema),
  authController.register,
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get("/validate", authController.validateAccount);
router.post("/logout", authController.logout);
router.post("/newsletter/subscribe", authController.subscribeNewsletter);

export default router;
