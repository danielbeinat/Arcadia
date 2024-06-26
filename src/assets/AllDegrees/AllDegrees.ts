interface Degrees {
  id: number;
  image: string;
  name: string;
  Type: string;
  duration: string;
  program: string;
  title?: string;
  degree?: string;
  category: string;
  Time: string;
}

export const AllDegrees: Degrees[] = [
  {
    id: 1,
    image:
      "https://img.freepik.com/foto-gratis/arreglo-articulos-viaje-bodegon_23-2149617684.jpg?t=st=1716355133~exp=1716358733~hmac=a964d6134a89dcccd513697330f91706c2ae2e216fcb9b32a2a8357ceaa7c1c8&w=900",
    name: "Licenciatura en turismo",
    Type: "presencial",
    duration: "4 años",
    program: "Carrera de Grado",
    title: "Licenciatura",
    degree: "Carrera con alcance nacional",
    category: "Humanidades",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 2,
    image:
      "https://img.freepik.com/foto-gratis/imagen-objetos-ingenieria-punto-vista-top-construction-trabajo-herramientas-ingenieria-vintage-efecto-filtro-retro-tono-enfoque-suave-enfoque-selectivo_1418-712.jpg?t=st=1716355183~exp=1716358783~hmac=41fab8cc7d01d79699dd7bf761cf4afb44a0d65e8c6353a68fac499af18e679c&w=900",
    name: "Arquitectura",
    Type: "presencial",
    duration: "5 años",
    program: "Carrera de Grado",
    title: "Arquitecto",
    degree: "Carrera con alcance nacional",
    category: "arquitectura",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 3,
    image:
      "https://img.freepik.com/foto-gratis/empresarios-que-firman-contrato_1098-21026.jpg?t=st=1716355219~exp=1716358819~hmac=d525ceae700814c7c354582b794a2749972d3a3eba3869059283dc183a32f36e&w=900",
    name: "Abogacía",
    Type: "presencial",
    duration: "4 años",
    program: "Carrera de Grado",
    title: "Abogado",
    degree: "Carrera con alcance nacional",
    category: "derecho",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 4,
    image:
      "https://img.freepik.com/foto-gratis/primer-plano-mujer-negocios-ocupada_1098-1687.jpg?t=st=1716355253~exp=1716358853~hmac=e365e78d12554c83625495363c9ae029fc94ae129d9063ee5c81176d21604eeb&w=900",
    name: "Contador Público",
    Type: "presencial",
    duration: "4 años",
    program: "Carrera de Grado",
    title: "Contador Público",
    degree: "Carrera con alcance nacional",
    category: "economicas",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 5,
    image:
      "https://img.freepik.com/foto-gratis/startup-empresario-trabajo-analisis-informacion-mercado_1421-221.jpg?t=st=1716324859~exp=1716328459~hmac=7b5fd81b35216d511a26afcc922a23690e74b2f259a4ee59acb8a5f307338a93&w=900",
    name: "Licenciatura en Administración",
    Type: "presencial",
    duration: "4 años",
    program: "Carrera de Grado",
    title: "Administrador",
    degree: "Carrera con alcance nacional",
    category: "economicas",
    Time: "08:30 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 6,
    image:
      "https://img.freepik.com/foto-gratis/materiales-construccion-borradores-cerca-computadora-portatil_23-2147831947.jpg?t=st=1716355310~exp=1716358910~hmac=b712ef21b72ca33cc52adff67434f916727b84fb7c6302b60b8bd8664e8d25f5&w=900",
    name: "Ingeniería Civil",
    Type: "presencial",
    duration: "5 años",
    program: "Carrera de Grado",
    title: "Ingeniero Civil",
    degree: "Carrera con alcance nacional",
    category: "ingenieria",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 7,
    image:
      "https://img.freepik.com/foto-gratis/manos-doctora-irreconocible-escribiendo-forma-escribiendo-teclado-portatil_1098-20374.jpg?t=st=1716355353~exp=1716358953~hmac=13a672b9182d678e394ac3a180449be552bf3d1a5107f76a70deee4ac6902a65&w=900",
    name: "Medicina",
    Type: "presencial",
    duration: "6 años",
    program: "Carrera de Grado",
    title: "Médico",
    degree: "Carrera con alcance nacional",
    category: "salud",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 8,
    image:
      "https://img.freepik.com/foto-gratis/chica-joven-vista-lateral-hablando-terapeuta_23-2150136592.jpg?t=st=1716324979~exp=1716328579~hmac=7a03981427e8df0ff594ecbc5a3ba7c42c639821b8617d04f1b4195b3108d0c1&w=900",
    name: "Psicología",
    Type: "presencial",
    duration: "5 años",
    program: "Carrera de Grado",
    title: "Psicólogo",
    degree: "Carrera con alcance nacional",
    category: "psicologia",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNoaWNvJTIwcHJvZ3JhbWFuZG98ZW58MHx8MHx8fDA%3D",
    name: "Desarrollo de Software",
    Type: "virtual",
    duration: "3 años",
    program: "Carrera de Grado",
    title: "Desarrollador de Software",
    degree: "Carrera con alcance nacional",
    category: "informatica",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Licenciatura en Educación",
    Type: "virtual",
    duration: "4 años",
    program: "Carrera de Grado",
    title: "Licenciado en Educación",
    degree: "Carrera con alcance nacional",
    category: "humanidades",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 11,
    image:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFya2V0aW5nfGVufDB8fDB8fHww",
    name: "Marketing Digital",
    Type: "virtual",
    duration: "3 años",
    program: "Carrera de Grado",
    title: "Licenciado",
    degree: "Carrera con alcance nacional",
    category: "informatica",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 12,
    image:
      "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlzZSVDMyVCMW8lMjBncmFmaWNvfGVufDB8fDB8fHww",
    name: "Diseño Gráfico",
    Type: "virtual",
    duration: "2 años",
    program: "Carrera de Grado",
    title: "Licenciado",
    degree: "Carrera con alcance nacional",
    category: "informatica",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 13,
    image:
      "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZ3JhbWFkb3IlMjBhbmFsaXN0YXxlbnwwfHwwfHx8MA%3D%3D",
    name: "Analista de Sistemas",
    Type: "virtual",
    duration: "3 años",
    program: "Carrera de Grado",
    title: "Analista de Sistemas",
    degree: "Carrera con alcance nacional",
    category: "informatica",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 14,
    image:
      "https://img.freepik.com/foto-gratis/vista-lateral-hombre-que-trabaja-proyecto-energia-eolica-ecologica-planes-papel_23-2148847790.jpg?t=st=1716325348~exp=1716328948~hmac=b018df3e4382acec85c27253bfaa6e700b54ffcfa7b6a0725cbe77a754355497&w=1060",
    name: "Gestión Ambiental",
    Type: "virtual",
    duration: "3 años",
    program: "Carrera de Grado",
    title: "Licenciado",
    degree: "Carrera con alcance nacional",
    category: "humanidades",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 15,
    image:
      "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=2002&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Comercio Exterior",
    Type: "virtual",
    duration: "3 años",
    program: "Carrera de Grado",
    title: "Licenciado",
    degree: "Carrera con alcance nacional",
    category: "economiacas",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },
  {
    id: 16,
    image:
      "https://img.freepik.com/foto-gratis/joven-candidata-entrevistada-empleador_1153-3932.jpg?t=st=1716325273~exp=1716328873~hmac=84f1cf1c3c9204bc08691a24e08aed185ea7e747320f5070f5eb61895bc68bb0&w=900",
    name: "Recursos Humanos",
    Type: "virtual",
    duration: "3 años",
    program: "Carrera de Grado",
    title: "Licenciado",
    degree: "Carrera con alcance nacional",
    category: "humanidades",
    Time: "08:00 a 12:30 / 14:00 a 18:00 / 18:00 a 20:30",
  },

  {
    id: 17,
    image:
      "https://img.freepik.com/foto-gratis/hombre-trabajando-innovaciones-energeticas-su-portatil_23-2148820170.jpg?t=st=1716356600~exp=1716360200~hmac=01ef9c500c1ddb18c7081e13568ba9cf82872ab552ed8bd8c59f83cf529b37d0&w=900",
    name: "Ciencias de Datos",
    Type: "hibrida",
    duration: "8 meses",
    program: "Curso",
    category: "informatica",
    Time: "lunes, miércoles y viernes de 18:00 a 20: 30.",
  },

  {
    id: 18,
    image:
      "https://img.freepik.com/foto-gratis/camara-profesional-borroso_169016-10249.jpg?t=st=1716356640~exp=1716360240~hmac=7edcd6d8cac2f8e370f50fd4ceb973f7844cef5b18e69d8a084a4b0023e0ab5d&w=900",
    name: "Curso Fotografia",
    Type: "hibrida",
    duration: "10 meses",
    program: "Curso",
    category: "bellas artes",
    Time: " lunes, miércoles y viernes de 18:00 a 20:30.",
  },

  {
    id: 19,
    image:
      "https://img.freepik.com/foto-gratis/mujeres-afroamericanas-sentadas-mesa-cerca-documento-pluma-figura-martillo_23-2148042596.jpg?t=st=1716356692~exp=1716360292~hmac=8bd3de08dd3355555b3d5fd85297ff9e6da8b1c870dc067ac2aa6ae7bec58ad5&w=900",
    name: "Curso Coaching Jurídico",
    Type: "hibrida",
    duration: "1 año",
    program: "Curso",
    category: "derecho",
    Time: " lunes, miércoles y viernes de 18:00 a 20:30.",
  },

  {
    id: 20,
    image:
      "https://img.freepik.com/foto-gratis/coding-man_1098-18084.jpg?t=st=1716356760~exp=1716360360~hmac=c04b0b4b661ed521ba5178e00b27a70ae064ca3fa9dd3bb3c13af1243f98cc03&w=900",
    name: "Desarrollo Web Full Stack ",
    Type: "hibrida",
    duration: "5 meses",
    program: "Curso",
    category: "informatica",
    Time: " lunes, miércoles y viernes de 18:00 a 20:30.",
  },

  {
    id: 21,
    image:
      "https://img.freepik.com/foto-gratis/bitcoin-es-nuevo-concepto-dinero-virtual-graficos-fondo-digital-monedas-imagen-letra-b_169016-4596.jpg?t=st=1716356783~exp=1716360383~hmac=e1616ee974f0e45e455fc1bca6711b3f98ed86810413f044bb61d54e2860a0bb&w=1060",
    name: "Introducción a las Criptomonedas",
    Type: "hibrida",
    duration: "3 meses",
    program: "Curso",
    category: "informatica",
    Time: " lunes, miércoles y viernes de 18:00 a 20:30.",
  },

  {
    id: 22,
    image:
      "https://img.freepik.com/foto-gratis/mujer-trabajando-proyectos-ambientales_23-2148829295.jpg?t=st=1716356815~exp=1716360415~hmac=9a043e9b1c868b84200a818125e8a118f8620baccdb95311376aca4a9fca3294&w=1060",
    name: "Mercado de Capitales ",
    Type: "hibrida",
    duration: "4 meses",
    program: "Curso",

    category: "economias",
    Time: " lunes, miércoles y viernes de 18:00 a 20:30.",
  },

  {
    id: 23,
    image:
      "https://img.freepik.com/foto-gratis/hombre-negocios-trabajando-computadora-portatil-reunion_53876-20836.jpg?t=st=1716356933~exp=1716360533~hmac=d9ecbd9d8cb52b2c3fa8bdea77b621dd25ef6266adcc582aad9eda98157c0975&w=900",
    name: "Práctica Sistema Tango",
    Type: "hibrida",
    duration: "2 meses",
    program: "Curso",
    category: "informatica",
    Time: " lunes, miércoles y viernes de 18:00 a 20:30.",
  },

  {
    id: 24,
    image:
      "https://img.freepik.com/foto-gratis/primer-plano-empresario-trabajando_23-2148242698.jpg?t=st=1716356961~exp=1716360561~hmac=f6052dddbeafdd369f2caecb0eb186e6318288a04c3b324b06da75df9c1d2f91&w=900",
    name: "Derecho y Tecnología",
    Type: "hibrida",
    duration: "4 meses",
    program: "Curso",
    category: "informatica",
    Time: " lunes, miércoles y viernes de 18:00 a 20:30.",
  },
];
