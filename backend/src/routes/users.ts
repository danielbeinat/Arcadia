import { Router } from 'express';
import { UserController } from '@/controllers/UserController';
import { authenticate, authorize } from '@/middleware/auth';
import { UserRole } from '@/types';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize('ADMIN'), userController.getAllUsers);
router.get('/pending', authorize('ADMIN'), userController.getPendingUsers);
router.post('/approve/:id', authorize('ADMIN'), userController.approveUser);
router.post('/reject/:id', authorize('ADMIN'), userController.rejectUser);
router.get('/stats', authorize('ADMIN'), userController.getUserStats);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);

// Admin/Professor routes for student management
router.get('/students', authorize('ADMIN', 'PROFESSOR'), userController.getStudents);
router.get('/professors', authorize('ADMIN'), userController.getProfessors);

// Individual user routes (Admin only)
router.get('/:id', authorize('ADMIN'), userController.getUserById);
router.put('/:id', authorize('ADMIN'), userController.updateUser);
router.delete('/:id', authorize('ADMIN'), userController.deleteUser);

export default router;
