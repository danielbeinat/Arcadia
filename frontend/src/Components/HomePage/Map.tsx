import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Navigation2,
  Calendar,
  Building2,
} from "lucide-react";

export const Map: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-6 shadow-lg"
          >
            <Navigation2 className="w-10 h-10 text-blue-600" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Visitanos
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light">
            Encontrá nuestra sede y conocé nuestras instalaciones
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div
            className="lg:col-span-3"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200/50 h-full min-h-[500px] lg:min-h-[600px]"
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
            >
              <div className="relative h-full overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.779308127539!2d-58.38155998417005!3d-34.60368418045968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf0501fa9f%3A0x29ae95d5a4d4748c!2sObelisco%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1620138277034!5m2!1sen!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Location Map"
                  className="absolute inset-0 grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                />

                <div className="absolute top-6 left-6 glass px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-slate-800">
                      Instituto Arcadia
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="card-premium p-6 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                      Sede Principal
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        Abierto
                      </span>
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Buenos Aires - CABA
                      <br />
                      Av. Santa Fe 123
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card-premium p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-800">
                    Horarios de Atención
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-700 text-sm">
                        Lunes a Viernes
                      </span>
                    </div>
                    <span className="text-slate-600 text-sm font-semibold">
                      8:00 - 20:30
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium text-slate-700 text-sm">
                        Sábados
                      </span>
                    </div>
                    <span className="text-slate-600 text-sm font-semibold">
                      10:00 - 16:00
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card-premium p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                  Contacto
                </h3>

                <div className="space-y-3">
                  <a
                    href="mailto:Arcadia@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-600 group-hover:text-blue-600 transition-colors duration-200 text-sm">
                      Arcadia@gmail.com
                    </span>
                  </a>

                  <a
                    href="tel:+541112345678"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200">
                      <Phone className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-slate-600 group-hover:text-indigo-600 transition-colors duration-200 text-sm">
                      +54 11 1234 5678
                    </span>
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <a
                  href="https://www.google.com/maps/place/Av.+Santa+Fe+123,+C1123AAA+CABA,+Argentina/@-34.5968801,-58.3832717,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Ver en Google Maps</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
