import React from "react";
import { motion } from "framer-motion";

export const About: React.FC = () => {
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

  const values = [
    {
      title: "Excelencia académica",
      description:
        "Buscamos la excelencia en todo lo que hacemos, desde la enseñanza hasta la investigación y la prestación de servicios a la comunidad.",
      icon: "🎓",
    },
    {
      title: "Integridad",
      description:
        "Actuamos con honestidad, transparencia y responsabilidad en todas nuestras actividades.",
      icon: "⭐",
    },
    {
      title: "Respeto",
      description:
        "Valoramos la diversidad, promovemos un ambiente inclusivo y respetamos los derechos y opiniones de los demás.",
      icon: "🤝",
    },
    {
      title: "Innovación",
      description:
        "Fomentamos la creatividad y la búsqueda constante de nuevas soluciones para los desafíos del mundo actual.",
      icon: "💡",
    },
    {
      title: "Responsabilidad social",
      description:
        "Nos comprometemos a contribuir al desarrollo sostenible de la sociedad y a actuar de manera ética y responsable en todas nuestras acciones.",
      icon: "🌍",
    },
    {
      title: "Colaboración",
      description:
        "Promovemos el trabajo en equipo y la colaboración entre estudiantes, profesores, instituciones y la sociedad en general para lograr objetivos comunes.",
      icon: "👥",
    },
  ];

  const sections = [
    {
      title: "Misión",
      icon: "🎯",
      content: [
        "Nuestra misión es proporcionar una educación de calidad, basada en la excelencia académica y la investigación innovadora, para formar profesionales capaces de enfrentar los desafíos del mundo actual y contribuir al desarrollo de la sociedad.",
        "Para lograr nuestra misión, nos comprometemos a brindar programas académicos rigurosos que promuevan el pensamiento crítico, la creatividad y el trabajo en equipo. Además, fomentamos valores éticos y morales que guíen el comportamiento de nuestros estudiantes tanto en su vida profesional como personal.",
      ],
    },
    {
      title: "Visión",
      icon: "👁️",
      content: [
        "Nuestra visión es ser una institución líder a nivel nacional e internacional en la formación de profesionales en diversas disciplinas científicas, tecnológicas y humanísticas, reconocida por su excelencia académica, investigación de vanguardia y contribución al progreso de la sociedad.",
        "Aspiramos a crear un entorno académico dinámico que promueva la innovación y la colaboración entre estudiantes, profesores y la comunidad en general. Buscamos ser un referente en la generación de conocimiento que aborde los desafíos globales y contribuya a la mejora de la calidad de vida de las personas.",
      ],
    },
  ];

  const history = {
    title: "Historia",
    icon: "📚",
    content: [
      "Nuestra universidad fue fundada en 2010 con el objetivo de formar profesionales capaces de enfrentar los desafíos. Desde entonces, hemos crecido y nos hemos consolidado como una institución de prestigio, comprometida con la formación integral de nuestros estudiantes y el avance del conocimiento a través de la investigación.",
      "A lo largo de los años, hemos ampliado nuestra oferta académica, modernizado nuestras instalaciones y fortalecido nuestras alianzas con otras instituciones y empresas. Nuestros egresados ocupan posiciones destacadas en diversos campos profesionales y contribuyen de manera significativa al desarrollo económico, social y cultural del país.",
    ],
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-20">
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
              className="inline-block px-4 py-2 bg-indigo-50 rounded-full"
            >
              <span className="text-indigo-600 font-medium">
                Descubrí nuestra historia y valores
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Acerca de Nosotros
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-4xl">{section.icon}</span>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} className="text-gray-600 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-center mb-12"
            >
              Nuestros Valores
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-3xl">{value.icon}</span>
                    <h3 className="font-semibold text-gray-900">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl">{history.icon}</span>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  {history.title}
                </h2>
              </div>
              <div className="space-y-4">
                {history.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
