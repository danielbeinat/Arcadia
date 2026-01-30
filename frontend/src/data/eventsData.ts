import type { UniversityEvent } from "../types/Event";

export const mockEvents: UniversityEvent[] = [
  {
    id: "1",
    title: "Inicio de Clases - Primer Semestre",
    description:
      "Comienzo oficial del período lectivo 2025. Reunión de bienvenida para estudiantes nuevos.",
    date: new Date("2025-02-03T09:00:00"),
    location: "Aula Magna Central",
    category: "academic",
    type: "celebration",
    organizer: "Dirección Académica",
    capacity: 500,
    registeredCount: 342,
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    tags: ["bienvenida", "estudiantes-nuevos", "inicio-semestre"],
    isRequired: true,
    reminderTimes: [1440, 60, 15], // 1 día, 1 hora, 15 minutos antes
  },
  {
    id: "2",
    title: "Taller de Inteligencia Artificial",
    description:
      "Introducción práctica a los conceptos fundamentales de IA y Machine Learning.",
    date: new Date("2025-02-10T14:00:00"),
    endDate: new Date("2025-02-10T17:00:00"),
    location: "Laboratorio de Informática - Edificio B",
    category: "academic",
    type: "workshop",
    organizer: "Departamento de Ciencias de la Computación",
    capacity: 30,
    registeredCount: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    tags: ["IA", "machine-learning", "tecnología", "workshop"],
    registrationDeadline: new Date("2025-02-08T23:59:59"),
    reminderTimes: [2880, 1440, 60], // 2 días, 1 día, 1 hora antes
  },
  {
    id: "3",
    title: "Feria de Carreras y Profesiones",
    description:
      "Encuentro con empresas y profesionales de diversas áreas. Oportunidades de prácticas y empleo.",
    date: new Date("2025-02-15T10:00:00"),
    endDate: new Date("2025-02-15T18:00:00"),
    location: "Centro de Convenciones Universitario",
    category: "social",
    type: "celebration",
    organizer: "Departamento de Orientación Profesional",
    capacity: 1000,
    registeredCount: 756,
    imageUrl:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
    tags: ["empleo", "prácticas", "profesiones", "networking"],
    reminderTimes: [4320, 1440, 60], // 3 días, 1 día, 1 hora antes
  },
  {
    id: "4",
    title: "Seminario de Investigación Científica",
    description:
      "Presentación de los últimos avances en investigación desarrollados en nuestra universidad.",
    date: new Date("2025-02-20T16:00:00"),
    location: "Auditorio Principal - Facultad de Ciencias",
    category: "academic",
    type: "lecture",
    organizer: "Vicerrectoría de Investigación",
    capacity: 200,
    registeredCount: 145,
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    tags: ["investigación", "ciencia", "avances", "seminario"],
    reminderTimes: [1440, 240, 60], // 1 día, 4 horas, 1 hora antes
  },
  {
    id: "5",
    title: "Campeonato Interfacultades de Fútbol",
    description:
      "Torneo anual entre las diferentes facultades de la universidad. ¡Ven a apoyar a tu facultad!",
    date: new Date("2025-02-22T15:00:00"),
    endDate: new Date("2025-02-22T19:00:00"),
    location: "Campo Deportivo Universitario",
    category: "sports",
    type: "competition",
    organizer: "Departamento de Deportes",
    capacity: 2000,
    registeredCount: 1200,
    imageUrl:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800",
    tags: ["deportes", "fútbol", "competencia", "interfacultades"],
    reminderTimes: [2880, 1440, 180], // 2 días, 1 día, 3 horas antes
  },
  {
    id: "6",
    title: "Deadline - Inscripción a Materias",
    description:
      "Fecha límite para inscribir materias del primer semestre 2025.",
    date: new Date("2025-02-28T23:59:59"),
    location: "Sistema Online - Portal Estudiantil",
    category: "administrative",
    type: "deadline",
    organizer: "Secretaría Académica",
    tags: ["inscripción", "deadline", "materias", "obligatorio"],
    isRequired: true,
    reminderTimes: [4320, 2880, 1440, 240, 60], // 3 días, 2 días, 1 día, 4 horas, 1 hora antes
  },
  {
    id: "7",
    title: "Concierto de Música Clásica",
    description:
      "Presentación de la Orquesta Sinfónica Universitaria. Repertorio de compositores clásicos.",
    date: new Date("2025-03-05T20:00:00"),
    endDate: new Date("2025-03-05T22:00:00"),
    location: "Teatro Universitario",
    category: "cultural",
    type: "celebration",
    organizer: "Departamento de Arte y Cultura",
    capacity: 400,
    registeredCount: 378,
    imageUrl:
      "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=800",
    tags: ["música", "clásica", "concierto", "cultura"],
    registrationDeadline: new Date("2025-03-03T23:59:59"),
    reminderTimes: [2880, 1440, 240], // 2 días, 1 día, 4 horas antes
  },
  {
    id: "8",
    title: "Jornada de Voluntariado Social",
    description:
      "Participa en actividades de servicio comunitario. Colabora con organizaciones locales.",
    date: new Date("2025-03-10T08:00:00"),
    endDate: new Date("2025-03-10T14:00:00"),
    location: "Centro Comunitario - Barrio Universidad",
    category: "social",
    type: "meeting",
    organizer: "Dirección de Extensión Universitaria",
    capacity: 100,
    registeredCount: 67,
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    tags: ["voluntariado", "social", "comunidad", "servicio"],
    registrationDeadline: new Date("2025-03-08T23:59:59"),
    reminderTimes: [4320, 1440, 60], // 3 días, 1 día, 1 hora antes
  },
];

export const getUpcomingEvents = (days: number = 30): UniversityEvent[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return mockEvents
    .filter((event) => event.date >= now && event.date <= futureDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getEventsByCategory = (
  category: UniversityEvent["category"],
): UniversityEvent[] => {
  return mockEvents.filter((event) => event.category === category);
};

export const getEventsByType = (
  type: UniversityEvent["type"],
): UniversityEvent[] => {
  return mockEvents.filter((event) => event.type === type);
};

export const searchEvents = (query: string): UniversityEvent[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery) ||
      event.location.toLowerCase().includes(lowercaseQuery) ||
      event.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  );
};
