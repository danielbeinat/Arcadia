// import { useParams } from "react-router-dom";
// import { AllDegrees } from "../../assets/AllDegrees/AllDegrees";

// export const DisplayDegree: React.FC = () => {
//   const { careerId } = useParams();
//   const career = AllDegrees.find((item) => item.id === Number(careerId));

//   if (!career) {
//     return <div>Career not found</div>;
//   }

//   return (
//     <>
//       <div className="flex flex-col gap-12 mb-20">
//         <div className="w-full relative">
//           <img
//             className="md:w-full md:h-[300px] object-cover brightness-[80%]"
//             src={career.image}
//             alt={career.name}
//           />
//           <h1 className="absolute md:bottom-5 md:left-5 bottom-2 left-3  md:text-[50px] text-3xl text-white font-bold">
//             {career.name}
//           </h1>
//         </div>
//         <hr />
//         <div className="flex flex-col px-10 gap-10 ">
//           <div className="flex flex-col gap-5">
//             <h1 className="text-3xl">
//               Profesionales innovadores y comprometidos con el medio
//             </h1>
//             <p>
//               Todas las asignaturas son teórico-prácticas, con regímenes
//               específicos según el área a la que pertenezcan. En la mayoría de
//               las materias los prácticos tienen asistencia obligatoria con un
//               80%, más la aprobación de los mismos como requisitos para aprobar
//               la cursada.
//             </p>
//           </div>
//           <div className="flex w-full">
//             <div className="flex flex-col gap-5 bg-slate-100 md:p-10 p-5 md:w-full">
//               {(career.Type === "presencial" || career.Type === "virtual") && (
//                 <div>
//                   <h1 className="font-bold text-lg">Titulo:</h1>
//                   <p>{career.title}</p>
//                 </div>
//               )}

//               <hr className="border border-gray-300" />
//               <div className="flex gap-16">
//                 <div>
//                   <h1 className="font-bold text-lg">Duracion:</h1>
//                   <p>{career.duration}</p>
//                 </div>
//                 <div>
//                   <h1 className="font-bold text-lg">Modalidad:</h1>
//                   <p>{career.Type}</p>
//                 </div>
//               </div>
//               <hr className="border border-gray-300" />
//               <div>
//                 <h1 className="font-bold text-lg">Horarios:</h1>
//                 <p>{career.Time}</p>
//               </div>
//             </div>
//             <div className="w-full hidden md:block">
//               <img className="w-[500px] h-auto" src={career.image} />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };
import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MapPin, GraduationCap, Calendar } from "lucide-react";
import { AllDegrees } from "../../assets/AllDegrees/AllDegrees";

export const DisplayDegree: React.FC = () => {
  const { careerId } = useParams();
  const career = AllDegrees.find((item) => item.id === Number(careerId));

  if (!career) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
          <p className="text-xl text-gray-600">Carrera no encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[40vh] md:h-[50vh] overflow-hidden"
      >
        <img
          className="w-full h-full object-cover"
          src={career.image}
          alt={career.name}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="container mx-auto px-4 py-8">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white"
            >
              {career.name}
            </motion.h1>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Profesionales innovadores y comprometidos con el medio
          </h2>
          <p className="text-lg text-gray-600">
            Todas las asignaturas son teórico-prácticas, con regímenes
            específicos según el área a la que pertenezcan. En la mayoría de las
            materias los prácticos tienen asistencia obligatoria con un 80%, más
            la aprobación de los mismos como requisitos para aprobar la cursada.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gray-50 rounded-lg shadow-lg p-8 flex-1"
          >
            {(career.Type === "presencial" || career.Type === "virtual") && (
              <div className="mb-6">
                <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-2">
                  <GraduationCap className="mr-2" />
                  Título
                </h3>
                <p className="text-gray-600">{career.title}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div>
                <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-2">
                  <Calendar className="mr-2" />
                  Duración
                </h3>
                <p className="text-gray-600">{career.duration}</p>
              </div>
              <div>
                <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-2">
                  <MapPin className="mr-2" />
                  Modalidad
                </h3>
                <p className="text-gray-600">{career.Type}</p>
              </div>
            </div>

            <div>
              <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-2">
                <Clock className="mr-2" />
                Horarios
              </h3>
              <p className="text-gray-600">{career.Time}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="hidden md:block flex-1"
          >
            <img
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src={career.image}
              alt={`Imagen de ${career.name}`}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
