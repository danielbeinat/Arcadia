import React from "react";
import { motion } from "framer-motion";

export const Info: React.FC = () => {
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          <motion.div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-50 rounded-full"
            >
              <span className="text-blue-600 font-medium">
                Información General
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Ingresantes
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid gap-8">
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
                  Requisitos Académicos Obligatorios (RAO)
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Quienes ingresen a cualquiera de las carreras de la FCEyN y
                  hayan completado los requerimientos administrativos deberán
                  acreditar, previo a cursar las asignaturas correspondientes a
                  sus Planes de Estudio, los dos Requisitos Académicos
                  Obligatorios (RAO): Introducción a la Matemática -IAM- y el
                  Taller “Leer y Pensar la Ciencia” -TLPC-. Además, habrá 2
                  reuniones del Taller de Introducción a la Vida Universitaria
                  -TIVU-, de carácter no obligatorio.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
                  Introducción a la Matemática (IAM)
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  El curso Introducción a la Matemática se dictará en 2
                  ediciones equivalentes. Recordamos que la aprobación de este
                  requisito es obligatoria para continuar con las asignaturas
                  específicas de cada carrera.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
                  Herramientas Digitales (HD)
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Este curso cubre temas como el manejo de software de
                  ofimática, herramientas de comunicación en línea, y uso seguro
                  de Internet. La aprobación de este curso es obligatoria y se
                  ofrece en formato virtual para mayor flexibilidad.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
