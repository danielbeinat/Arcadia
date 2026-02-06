import React from "react";
import { motion } from "framer-motion";

export const Services: React.FC = () => {
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

  const services = [
    {
      title: "Orientación Académica",
      description:
        "Nuestro equipo de asesores académicos está disponible para brindarte orientación personalizada en cada etapa de tu trayectoria académica.",
    },
    {
      title: "Servicios de Tutoría",
      description:
        "Nuestros tutores altamente capacitados ofrecen sesiones individuales y grupales para ayudarte a mejorar tus habilidades académicas.",
    },
    {
      title: "Biblioteca Universitaria",
      description:
        "Nuestra biblioteca cuenta con una vasta colección de recursos impresos y electrónicos en todas las áreas de estudio.",
    },
    {
      title: "Servicios de Salud",
      description:
        "La salud y el bienestar de nuestros estudiantes son nuestra prioridad. Nuestro centro de salud en el campus ofrece una variedad de servicios médicos.",
    },
    {
      title: "Actividades Extracurriculares",
      description:
        "Enriquece tu experiencia universitaria participando en nuestras actividades extracurriculares como equipos deportivos y clubes estudiantiles.",
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
          <motion.div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-50 rounded-full"
            >
              <span className="text-blue-600 font-medium">
                Nuestros Servicios
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Qué Ofrecemos
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 group hover:bg-blue-50/50 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:text-blue-600">
                  {service.title}
                </h2>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
