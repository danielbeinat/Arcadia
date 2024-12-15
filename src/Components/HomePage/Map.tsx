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
                href="https://www.google.com/maps/place/Av.+Santa+Fe+123,+C1123AAA+CABA,+Argentina/@-34.5968801,-58.3832717,17z"
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
