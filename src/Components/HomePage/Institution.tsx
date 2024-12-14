// import { PiStudentFill } from "react-icons/pi";
// import { FaMapMarkerAlt, FaBookmark, FaBook } from "react-icons/fa";

// interface InfoItem {
//   icon: JSX.Element;
//   count: number;
//   description: string;
// }

// const institutionInfo: InfoItem[] = [
//   {
//     icon: <PiStudentFill color="white" size={60} />,
//     count: 1000,
//     description: "Alumnos",
//   },
//   {
//     icon: <FaBook color="white" size={60} />,
//     count: 10,
//     description: "Programas y Cursos de Extensión",
//   },
//   {
//     icon: <FaBookmark color="white" size={60} />,
//     count: 20,
//     description: "Carreras de Grado y Posgrado",
//   },
//   {
//     icon: <FaMapMarkerAlt color="white" size={60} />,
//     count: 5,
//     description: "Instalaciones Educativas",
//   },
// ];

// export const Institution: React.FC = () => {
//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 gap-10 mt-10 px-10 py-10 bg-gradient-to-tr from-gray-700 to-gray-900 content-center items-center justify-items-center">
//         {institutionInfo.map((item, index) => (
//           <div
//             key={index}
//             className="flex flex-col items-center gap-3 text-center"
//           >
//             {item.icon}
//             <h1 className="text-2xl text-white">{item.count}</h1>
//             <p className="text-white">{item.description}</p>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, Building } from "lucide-react";

interface InfoItem {
  icon: React.ReactNode;
  count: number;
  description: string;
}

const institutionInfo: InfoItem[] = [
  {
    icon: <Users size={40} />,
    count: 1000,
    description: "Alumnos",
  },
  {
    icon: <BookOpen size={40} />,
    count: 10,
    description: "Programas y Cursos de Extensión",
  },
  {
    icon: <GraduationCap size={40} />,
    count: 20,
    description: "Carreras de Grado y Posgrado",
  },
  {
    icon: <Building size={40} />,
    count: 5,
    description: "Instalaciones Educativas",
  },
];

export const Institution: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestra Institución en Números
          </h2>
          <p className="text-xl text-blue-100">
            Descubre el impacto de nuestra comunidad educativa
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {institutionInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white bg-opacity-10 rounded-lg p-6 text-center transform hover:scale-105 transition duration-300"
            >
              <div className="inline-block p-3 bg-blue-500 rounded-full mb-4">
                {React.cloneElement(item.icon as React.ReactElement, {
                  className: "text-white",
                })}
              </div>
              <motion.h3
                className="text-4xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                {item.count}
              </motion.h3>
              <p className="text-blue-100">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
