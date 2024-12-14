// import React from "react";
// import { FaRegClock } from "react-icons/fa6";
// import { FaWhatsapp } from "react-icons/fa";
// import { LuMapPin } from "react-icons/lu";
// import { IoMailOutline } from "react-icons/io5";

// export const Map: React.FC = () => {
//   return (
//     <React.Fragment>
//       <section className="bg-gray-100">
//         <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
//           <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900">
//               SEDES Y PUNTOS DE ARCADIA
//             </h2>
//             <p className="mt-4 text-lg text-gray-500">
//               Encontrá tu sede o punto Arcadia
//             </p>
//           </div>
//           <div className="mt-16 lg:mt-20">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="rounded-lg overflow-hidden">
//                 <iframe
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.779308127539!2d-58.38155998417005!3d-34.60368418045968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf0501fa9f%3A0x29ae95d5a4d4748c!2sObelisco%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1620138277034!5m2!1sen!2sar"
//                   width="100%"
//                   height="480"
//                   style={{ border: 0 }}
//                   loading="lazy"
//                   title="Location Map"
//                 ></iframe>
//               </div>
//               <div>
//                 <div className="max-w-full mx-auto rounded-lg overflow-hidden">
//                   <div className="px-6 py-4 flex flex-col gap-1 ">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Nuestra sede principal
//                     </h3>
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
//                         <LuMapPin className="text-xl bg-gray-700 rounded-full text-white" />
//                       </div>
//                       <p className="mt-1 text-gray-600">
//                         Buenos Aires - CABA - Av. Santa Fe 123{" "}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="border-t border-gray-200 flex flex-col gap-2 px-6 py-6">
//                     <h3 className="text-lg font-medium text-gray-900 ">
//                       Horarios
//                     </h3>
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
//                         <FaRegClock className="text-xl bg-gray-700 text-white" />
//                       </div>
//                       <p className="mt-1 text-gray-600">
//                         Lunes a Viernes: 8am - 20:30pm
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
//                         <FaRegClock className="inline text-xl bg-gray-700 text-white" />
//                       </div>
//                       <p className="mt-1 text-gray-600">Sábado: 10am - 4pm</p>
//                     </div>
//                   </div>
//                   <div className="border-t border-gray-200 flex flex-col gap-2 px-6 py-4">
//                     <h3 className="text-lg font-medium text-gray-900">
//                       Contacto
//                     </h3>
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
//                         <IoMailOutline className="inline  text-xl bg-gray-700 text-white" />
//                       </div>
//                       <p className="mt-1 text-gray-600">
//                         Email: Arcadia@gmail.com
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
//                         <FaWhatsapp className="inline  text-xl bg-gray-700  text-white" />
//                       </div>
//                       <p className="mt-1 text-gray-600">
//                         Teléfono: +54 11 1234 5678
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </React.Fragment>
//   );
// };

// import React from "react";
// import { motion } from "framer-motion";
// import { MapPin, Clock, Mail, Phone, ExternalLink } from "lucide-react";

// export const Map: React.FC = () => {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//     },
//   };

//   return (
//     <section className="bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
//             SEDES Y PUNTOS DE ARCADIA
//           </h2>
//           <p className="text-xl text-gray-600">
//             Encontrá tu sede o punto Arcadia
//           </p>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           <motion.div
//             className="rounded-lg overflow-hidden shadow-lg"
//             whileHover={{ scale: 1.02 }}
//             transition={{ duration: 0.2 }}
//           >
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.779308127539!2d-58.38155998417005!3d-34.60368418045968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf0501fa9f%3A0x29ae95d5a4d4748c!2sObelisco%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1620138277034!5m2!1sen!2sar"
//               width="100%"
//               height="450"
//               style={{ border: 0 }}
//               loading="lazy"
//               title="Location Map"
//             ></iframe>
//           </motion.div>

//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="bg-white rounded-lg shadow-lg overflow-hidden"
//           >
//             <div className="p-6">
//               <motion.h3
//                 variants={itemVariants}
//                 className="text-2xl font-semibold text-gray-900 mb-6"
//               >
//                 Nuestra sede principal
//               </motion.h3>

//               <motion.div
//                 variants={itemVariants}
//                 className="flex items-center mb-6"
//               >
//                 <MapPin className="w-6 h-6 text-indigo-600 mr-3" />
//                 <p className="text-gray-700">
//                   Buenos Aires - CABA - Av. Santa Fe 123
//                 </p>
//               </motion.div>

//               <motion.h4
//                 variants={itemVariants}
//                 className="text-xl font-semibold text-gray-900 mb-4"
//               >
//                 Horarios
//               </motion.h4>

//               <motion.div
//                 variants={itemVariants}
//                 className="flex items-center mb-3"
//               >
//                 <Clock className="w-5 h-5 text-indigo-600 mr-3" />
//                 <p className="text-gray-700">Lunes a Viernes: 8am - 20:30pm</p>
//               </motion.div>

//               <motion.div
//                 variants={itemVariants}
//                 className="flex items-center mb-6"
//               >
//                 <Clock className="w-5 h-5 text-indigo-600 mr-3" />
//                 <p className="text-gray-700">Sábado: 10am - 4pm</p>
//               </motion.div>

//               <motion.h4
//                 variants={itemVariants}
//                 className="text-xl font-semibold text-gray-900 mb-4"
//               >
//                 Contacto
//               </motion.h4>

//               <motion.div
//                 variants={itemVariants}
//                 className="flex items-center mb-3"
//               >
//                 <Mail className="w-5 h-5 text-indigo-600 mr-3" />
//                 <p className="text-gray-700">Email: Arcadia@gmail.com</p>
//               </motion.div>

//               <motion.div variants={itemVariants} className="flex items-center">
//                 <Phone className="w-5 h-5 text-indigo-600 mr-3" />
//                 <p className="text-gray-700">Teléfono: +54 11 1234 5678</p>
//               </motion.div>
//             </div>

//             <motion.div
//               variants={itemVariants}
//               className="bg-gray-50 px-6 py-4"
//             >
//               <a
//                 href="https://goo.gl/maps/your-location-link"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
//               >
//                 <ExternalLink className="w-5 h-5 mr-2" />
//                 Ver en Google Maps
//               </a>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Navigation2,
} from "lucide-react";

export const Map: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-2 bg-indigo-100 rounded-2xl mb-6"
          >
            <Navigation2 className="w-8 h-8 text-indigo-600 animate-pulse" />
          </motion.div>
          <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            SEDES Y PUNTOS DE ARCADIA
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Descubrí tu sede más cercana
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="rounded-2xl overflow-hidden shadow-2xl bg-white"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative h-full overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.779308127539!2d-58.38155998417005!3d-34.60368418045968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf0501fa9f%3A0x29ae95d5a4d4748c!2sObelisco%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1620138277034!5m2!1sen!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Location Map"
                className="absolute inset-0"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="p-8">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-6"
              >
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-600 font-medium">
                  Sede Principal
                </span>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center mb-8 hover:bg-gray-50 p-4 rounded-xl transition-colors duration-200"
              >
                <div className="bg-indigo-100 p-3 rounded-xl mr-4">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Dirección</h4>
                  <p className="text-gray-600">
                    Buenos Aires - CABA - Av. Santa Fe 123
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Horarios de Atención
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Clock className="w-5 h-5 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-gray-900 font-medium">
                        Lunes a Viernes
                      </p>
                      <p className="text-gray-600">8:00 AM - 20:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <Clock className="w-5 h-5 text-indigo-600 mr-3" />
                    <div>
                      <p className="text-gray-900 font-medium">Sábados</p>
                      <p className="text-gray-600">10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-8">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  Información de Contacto
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center group">
                    <div className="bg-indigo-50 p-2 rounded-lg mr-3 group-hover:bg-indigo-100 transition-colors duration-200">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <a
                      href="mailto:Arcadia@gmail.com"
                      className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    >
                      Arcadia@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center group">
                    <div className="bg-indigo-50 p-2 rounded-lg mr-3 group-hover:bg-indigo-100 transition-colors duration-200">
                      <Phone className="w-5 h-5 text-indigo-600" />
                    </div>
                    <a
                      href="tel:+541112345678"
                      className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    >
                      +54 11 1234 5678
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="border-t border-gray-100 px-8 py-6"
            >
              <a
                href="https://goo.gl/maps/your-location-link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 group"
              >
                <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                Ver en Google Maps
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
