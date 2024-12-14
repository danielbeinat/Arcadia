// import { Link } from "react-router-dom";

// export const Academy: React.FC = () => {
//   return (
//     <>
//       <div className="container mx-auto md:px-10 py-10 px-5 mt-10">
//         <h1 className="text-3xl text-center md:text-start font-bold py-5">
//           Áreas académicas
//         </h1>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-stretch content-center items-center place-items-center">
//           <Link
//             to={"area/informatica"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105"
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             Informatica
//           </Link>
//           <Link
//             to={"area/arquitectura"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             Arquitectura
//           </Link>
//           <Link
//             to={"area/derecho"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             Derecho
//           </Link>
//           <Link
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             to={"area/humanidades"}
//           >
//             Humanidades
//           </Link>
//           <Link
//             to={"area/bellas artes"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             Bellas artes
//           </Link>
//           <Link
//             to={"area/economicas"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             Economicas
//           </Link>
//           <Link
//             to={"area/ingenieria"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             Ingernieria
//           </Link>
//           <Link
//             to={"area/psicologia"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             psicologia
//           </Link>
//           <Link
//             to={"area/salud"}
//             className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
//             onClick={() => window.scrollTo(0, 0)}
//           >
//             salud
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Computer,
  Building2,
  Scale,
  Book,
  Palette,
  LineChart,
  Cog,
  Brain,
  Stethoscope,
  GraduationCap,
} from "lucide-react";

interface AcademicArea {
  name: string;
  icon: React.ReactNode;
  to: string;
}

const academicAreas: AcademicArea[] = [
  { name: "Informática", icon: <Computer />, to: "area/informatica" },
  { name: "Arquitectura", icon: <Building2 />, to: "area/arquitectura" },
  { name: "Derecho", icon: <Scale />, to: "area/derecho" },
  { name: "Humanidades", icon: <Book />, to: "area/humanidades" },
  { name: "Bellas Artes", icon: <Palette />, to: "area/bellas-artes" },
  { name: "Económicas", icon: <LineChart />, to: "area/economicas" },
  { name: "Ingeniería", icon: <Cog />, to: "area/ingenieria" },
  { name: "Psicología", icon: <Brain />, to: "area/psicologia" },
  { name: "Salud", icon: <Stethoscope />, to: "area/salud" },
];

export const Academy: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <GraduationCap className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Áreas Académicas
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestras diversas áreas de estudio y encuentra tu pasión
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {academicAreas.map((area, index) => (
            <motion.div
              key={area.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Link
                to={area.to}
                className="group block h-full bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {area.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {area.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Descubre programas y oportunidades en{" "}
                    {area.name.toLowerCase()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
