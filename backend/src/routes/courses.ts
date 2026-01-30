import { Router } from 'express';
import { CourseController } from '@/controllers/CourseController';
import { authenticate, authorize } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { courseSchema } from '@/utils/validation';

const router = Router();
const courseController = new CourseController();

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes
router.use(authenticate);

// Student routes
router.post('/:id/enroll', authorize('STUDENT'), courseController.enrollInCourse);
router.delete('/:id/enroll', authorize('STUDENT'), courseController.dropCourse);
router.get('/enrolled', authorize('STUDENT'), courseController.getEnrolledCourses);

// Professor routes
router.get('/my-courses', authorize('PROFESSOR'), courseController.getMyCourses);
router.get('/:id/students', authorize('PROFESSOR'), courseController.getCourseStudents);

// Admin only routes
router.post('/', authorize('ADMIN'), validateRequest(courseSchema), courseController.createCourse);
router.put('/:id', authorize('ADMIN'), validateRequest(courseSchema), courseController.updateCourse);
router.delete('/:id', authorize('ADMIN'), courseController.deleteCourse);

export default router;
