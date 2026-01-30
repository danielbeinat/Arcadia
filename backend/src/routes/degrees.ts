import { Router } from 'express';
import { DegreeController } from '@/controllers/DegreeController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { degreeSchema } from '@/utils/validation';

const router = Router();
const degreeController = new DegreeController();

// Public routes
router.get('/', degreeController.getAllDegrees);
router.get('/:id', degreeController.getDegreeById);

// Protected routes (require authentication)
router.use(authenticate);

// Admin only routes
router.post('/', authorize('ADMIN'), validateRequest(degreeSchema), degreeController.createDegree);
router.put('/:id', authorize('ADMIN'), validateRequest(degreeSchema), degreeController.updateDegree);
router.delete('/:id', authorize('ADMIN'), degreeController.deleteDegree);

export default router;
