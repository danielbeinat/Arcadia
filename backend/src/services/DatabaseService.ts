import { prisma } from "@/lib/prisma";
import {
  UserRole,
  UserStatus,
  DegreeType,
  CourseStatus,
  EnrollmentStatus,
} from "@prisma/client";

export class DatabaseService {
  // --- User Methods ---
  static async createUser(userData: any) {
    // Map role and status to uppercase for Prisma enums
    const data = {
      ...userData,
      role: userData.role
        ? (userData.role.toUpperCase() as UserRole)
        : UserRole.STUDENT,
      status: userData.status
        ? (userData.status.toUpperCase() as UserStatus)
        : UserStatus.PENDIENTE,
    };

    return await prisma.user.create({ data });
  }

  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateUser(id: string, userData: any) {
    const data = { ...userData };
    if (data.role) data.role = data.role.toUpperCase() as UserRole;
    if (data.status) data.status = data.status.toUpperCase() as UserStatus;

    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async findByRole(role: string) {
    return await prisma.user.findMany({
      where: { role: role.toUpperCase() as UserRole },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getStats() {
    const [total, students, professors, admins, active] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: UserRole.STUDENT } }),
      prisma.user.count({ where: { role: UserRole.PROFESSOR } }),
      prisma.user.count({ where: { role: UserRole.ADMIN } }),
      prisma.user.count({ where: { status: UserStatus.APROBADO } }),
    ]);

    return {
      total,
      students,
      professors,
      admins,
      active,
    };
  }

  static async updatePassword(id: string, newPassword: string) {
    await prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        updatedAt: new Date(),
      },
    });
  }

  static async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }

  static async findUserByValidationToken(token: string) {
    return await prisma.user.findFirst({
      where: {
        validationToken: token,
        tokenExpires: {
          gt: new Date(),
        },
      },
    });
  }

  static async activateUser(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.APROBADO,
        validationToken: null,
        tokenExpires: null,
        updatedAt: new Date(),
      },
    });
  }

  static async rejectUser(id: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.RECHAZADO,
        updatedAt: new Date(),
      },
    });
  }

  static async getPendingUsers() {
    return await prisma.user.findMany({
      where: { status: UserStatus.PENDIENTE },
      orderBy: { createdAt: "desc" },
    });
  }

  // --- Courses Methods ---
  static async getAllCourses() {
    return await prisma.course.findMany({
      where: { status: CourseStatus.ACTIVE },
      orderBy: { createdAt: "desc" },
      include: {
        professor: true,
        degree: true,
      },
    });
  }

  static async findCourseById(id: string) {
    return await prisma.course.findUnique({
      where: { id },
      include: {
        professor: true,
        degree: true,
      },
    });
  }

  static async createCourse(courseData: any) {
    const data = {
      ...courseData,
      status: courseData.status
        ? (courseData.status.toUpperCase() as CourseStatus)
        : CourseStatus.ACTIVE,
    };
    return await prisma.course.create({ data });
  }

  static async updateCourse(id: string, courseData: any) {
    const data = { ...courseData };
    if (data.status) data.status = data.status.toUpperCase() as CourseStatus;

    return await prisma.course.update({
      where: { id },
      data,
    });
  }

  static async deleteCourse(id: string) {
    // Soft delete
    await prisma.course.update({
      where: { id },
      data: { status: CourseStatus.INACTIVE },
    });
  }

  static async findCoursesByProfessor(professorId: string) {
    return await prisma.course.findMany({
      where: {
        professorId,
        status: CourseStatus.ACTIVE,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findCoursesByDegree(degreeId: string) {
    return await prisma.course.findMany({
      where: {
        degreeId,
        status: CourseStatus.ACTIVE,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // --- Degrees Methods ---
  static async getAllDegrees() {
    return await prisma.degree.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  static async findDegreeById(id: string) {
    return await prisma.degree.findUnique({
      where: { id },
    });
  }

  static async createDegree(degreeData: any) {
    const data = {
      ...degreeData,
      type: degreeData.type
        ? (degreeData.type.replace("-", "_").toUpperCase() as DegreeType)
        : DegreeType.ON_CAMPUS,
    };
    return await prisma.degree.create({ data });
  }

  static async updateDegree(id: string, degreeData: any) {
    const data = { ...degreeData };
    if (data.type)
      data.type = data.type.replace("-", "_").toUpperCase() as DegreeType;

    return await prisma.degree.update({
      where: { id },
      data,
    });
  }

  static async deleteDegree(id: string) {
    await prisma.degree.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // --- Enrollment Methods ---
  static async enrollStudent(studentId: string, courseId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Check if course exists and has space
      const course = await tx.course.findUnique({
        where: { id: courseId },
      });

      if (!course) throw new Error("Curso no encontrado");
      if (course.currentStudents >= course.maxStudents) {
        throw new Error("El curso ya está lleno");
      }

      // 2. Check if student is already enrolled
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId,
          },
        },
      });

      if (
        existingEnrollment &&
        existingEnrollment.status === EnrollmentStatus.ENROLLED
      ) {
        throw new Error("El estudiante ya está inscrito en este curso");
      }

      // 3. Create or update enrollment
      const enrollment = await tx.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId,
            courseId,
          },
        },
        create: {
          studentId,
          courseId,
          status: EnrollmentStatus.ENROLLED,
        },
        update: {
          status: EnrollmentStatus.ENROLLED,
          updatedAt: new Date(),
        },
      });

      // 4. Update course student count
      await tx.course.update({
        where: { id: courseId },
        data: { currentStudents: { increment: 1 } },
      });

      return enrollment;
    });
  }

  static async dropStudent(studentId: string, courseId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Find enrollment
      const enrollment = await tx.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId,
          },
        },
      });

      if (!enrollment || enrollment.status !== EnrollmentStatus.ENROLLED) {
        return false;
      }

      // 2. Update enrollment status
      await tx.enrollment.update({
        where: { id: enrollment.id },
        data: {
          status: EnrollmentStatus.DROPPED,
          updatedAt: new Date(),
        },
      });

      // 3. Update course student count
      const course = await tx.course.findUnique({
        where: { id: courseId },
        select: { currentStudents: true },
      });

      if (course && course.currentStudents > 0) {
        await tx.course.update({
          where: { id: courseId },
          data: { currentStudents: { decrement: 1 } },
        });
      }

      return true;
    });
  }

  static async getStudentEnrollments(studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        course: {
          include: {
            professor: true,
            degree: true,
          },
        },
      },
    });

    return enrollments.map((e) => e.course);
  }

  static async getCourseStudents(courseId: string) {
    return await prisma.enrollment.findMany({
      where: {
        courseId,
        status: EnrollmentStatus.ENROLLED,
      },
      include: {
        student: true,
      },
    });
  }
}
