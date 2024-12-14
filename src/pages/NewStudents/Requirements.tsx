import React from "react";
import { motion } from "framer-motion";

export const Requirements: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const academicRequirements = [
    {
      title: "Título de Educación Secundaria",
      description:
        "Para poder inscribirte en cualquiera de nuestras carreras, necesitas haber completado satisfactoriamente tu educación secundaria y contar con el título correspondiente.",
      icon: "🎓",
    },
    {
      title: "Documentación Oficial",
      description:
        "Deberás presentar documentación oficial que respalde tu identidad, como el documento nacional de identidad (DNI) o pasaporte.",
      icon: "📄",
    },
    {
      title: "Certificados de Cursos Preparatorios",
      description:
        "Dependiendo de la carrera, es posible que necesites haber completado ciertos cursos preparatorios específicos.",
      icon: "📚",
    },
  ];

  const additionalRequirements = [
    {
      title: "Requisitos por Carrera",
      description:
        "Cada programa puede tener requisitos adicionales únicos. Consulta los requisitos específicos de tu carrera de interés.",
      icon: "📋",
    },
    {
      title: "Documentación Extra",
      description:
        "Algunos programas requieren cartas de recomendación, portafolios o certificados de idiomas.",
      icon: "📎",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Header Section */}
          <motion.div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-50 rounded-full"
            >
              <span className="text-blue-600 font-medium">
                Todo lo que necesitás saber
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Requisitos de Inscripción
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Academic Requirements */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Requisitos Académicos
                  </h2>
                </div>
                <div className="space-y-6">
                  {academicRequirements.map((req, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-blue-50/50 p-4 rounded-xl transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {req.icon}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {req.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {req.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Additional Requirements */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Requisitos Adicionales
                  </h2>
                </div>
                <div className="space-y-6">
                  {additionalRequirements.map((req, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-indigo-50/50 p-4 rounded-xl transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {req.icon}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {req.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {req.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-8 p-6 bg-indigo-50/50 rounded-xl border border-indigo-100"
                >
                  <p className="text-gray-600 leading-relaxed">
                    <span className="text-indigo-600 font-semibold">
                      Nota importante:
                    </span>{" "}
                    Asegúrate de revisar la información detallada de la carrera
                    a la que deseas inscribirte para conocer todos los
                    requisitos específicos del programa.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
