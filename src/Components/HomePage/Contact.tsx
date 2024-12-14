import React from "react";
import { motion } from "framer-motion";
import students from "../../assets/students.webp";

export const Contact: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl"></div>
              <img
                src={students}
                alt="students"
                className="rounded-3xl shadow-2xl object-cover w-full h-[800px]"
              />
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:w-1/2 w-full max-w-2xl"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
              <motion.div variants={itemVariants} className="text-center mb-10">
                <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                  Contactanos
                </span>
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                  ¿NECESITAS INFORMACIÓN?
                </h2>
                <p className="text-gray-600">
                  Completá tus datos y un asesor se comunicará en breve para
                  ayudarte.
                </p>
              </motion.div>

              <motion.form variants={containerVariants} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <input
                      type="text"
                      placeholder="Apellido"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500">
                    <option value="">Horario de Contacto</option>
                    {[
                      "09:00",
                      "11:00",
                      "13:00",
                      "15:00",
                      "17:00",
                      "19:00",
                      "21:00",
                    ].map((time) => (
                      <option key={time} value={time}>
                        {time} Hs
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500">
                    <option value="">Provincia</option>
                    {[
                      "Buenos Aires",
                      "Santa Fe",
                      "Chaco",
                      "Chubut",
                      "Misiones",
                      "Corrientes",
                      "Entre Ríos",
                      "Formosa",
                      "Jujuy",
                      "La Pampa",
                    ].map((provincia) => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500">
                      <option value="">Tipo de Carreras</option>
                      {[
                        "Carreras Cortas",
                        "Carreras de Grado",
                        "Carreras de Posgrado",
                        "Cursos y Diplomaturas",
                        "Educación Básica y Media",
                      ].map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500">
                      <option value="">Carrera</option>
                      {Array(7)
                        .fill("Undefined")
                        .map((_, index) => (
                          <option key={index} value={`option-${index}`}>
                            Undefined
                          </option>
                        ))}
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500">
                    <option value="">Modalidad</option>
                    {Array(7)
                      .fill("Undefined")
                      .map((_, index) => (
                        <option key={index} value={`option-${index}`}>
                          Undefined
                        </option>
                      ))}
                  </select>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    SOLICITAR INFORMACIÓN
                  </button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
