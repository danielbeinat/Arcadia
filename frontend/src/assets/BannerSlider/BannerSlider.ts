import banner from "./Images/banner.webp";
import banner2 from "./Images/banner2.webp";
import banner3 from "./Images/banner3.webp";

interface banner {
  id: number;
  image: string;
  title: string;
  description: string;
  to: string;
}

export const Banner: banner[] = [
  {
    id: 1,
    image: banner,
    title: "¡Inscripciones abiertas!",
    description:
      "Descubre nuestras emocionantes carreras universitarias y comienza tu camino hacia el éxito profesional. ¡Inscríbete ya!",
    to: "/inscripciones",
  },
  {
    id: 2,
    image: banner2,
    title: "¡Explora nuestras diversas carreras!",
    description:
      "Sumérgete en el mundo de la educación superior y descubre nuestras diversas carreras universitarias. Desde ciencias hasta humanidades, tenemos opciones para todos los intereses.",
    to: "/presenciales",
  },
  {
    id: 3,
    image: banner3,
    title: "¡Únete a nuestra comunidad estudiantil!",
    description:
      "Sé parte de una vibrante comunidad estudiantil donde podrás participar en actividades extracurriculares, eventos sociales y mucho más. ¡Descubre lo que te espera!",
    to: "/portal",
  },
];
