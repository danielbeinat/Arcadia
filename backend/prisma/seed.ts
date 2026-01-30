import {
  PrismaClient,
  UserRole,
  UserStatus,
  DegreeType,
  CourseStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 0. Create an Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@arcadia.edu" },
    update: {},
    create: {
      email: "admin@arcadia.edu",
      password: adminPassword,
      name: "Admin",
      lastName: "Principal",
      role: UserRole.ADMIN,
      program: "Administración",
      status: UserStatus.APROBADO,
    },
  });

  console.log("✅ Admin created (admin@arcadia.edu / admin123)");

  // 1. Create a Professor
  const hashedPassword = await bcrypt.hash("prof123", 10);
  const professor = await prisma.user.upsert({
    where: { email: "profesor@arcadia.edu" },
    update: {},
    create: {
      email: "profesor@arcadia.edu",
      password: hashedPassword,
      name: "Dr. Roberto",
      lastName: "García",
      role: UserRole.PROFESSOR,
      program: "Ingeniería",
      status: UserStatus.APROBADO,
    },
  });

  console.log("✅ Professor created");

  // 2. Create Degrees
  const degreeIng = await prisma.degree.create({
    data: {
      name: "Ingeniería en Sistemas",
      description:
        "Carrera enfocada en el desarrollo de software y gestión de sistemas complejos.",
      type: DegreeType.CARRERA,
      duration: 10,
      credits: 300,
      faculty: "Facultad de Ingeniería",
      requirements: ["Secundario completo", "Examen de ingreso"],
      subjects: ["Matemática I", "Programación I", "Sistemas Operativos"],
    },
  });

  const degreeDis = await prisma.degree.create({
    data: {
      name: "Diseño Gráfico",
      description: "Carrera creativa enfocada en la comunicación visual.",
      type: DegreeType.CARRERA,
      duration: 8,
      credits: 240,
      faculty: "Facultad de Artes",
      requirements: ["Secundario completo"],
      subjects: ["Dibujo I", "Teoría del Color", "Diseño Digital"],
    },
  });

  console.log("✅ Degrees created");

  // 3. Create Courses
  await prisma.course.create({
    data: {
      code: "ING101",
      name: "Programación I",
      description: "Introducción a la lógica de programación y algoritmos.",
      credits: 10,
      semester: 1,
      professorId: professor.id,
      degreeId: degreeIng.id,
      schedule: "Lunes y Miércoles 18:00 - 20:00",
      classroom: "Aula 302",
      maxStudents: 30,
    },
  });

  await prisma.course.create({
    data: {
      code: "DIS101",
      name: "Fundamentos del Diseño",
      description: "Bases teóricas y prácticas del diseño visual.",
      credits: 8,
      semester: 1,
      professorId: professor.id,
      degreeId: degreeDis.id,
      schedule: "Martes y Jueves 10:00 - 12:00",
      classroom: "Taller A",
      maxStudents: 25,
    },
  });

  console.log("✅ Courses created");
  console.log("🚀 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
