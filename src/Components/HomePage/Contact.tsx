import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import students from "../../assets/AllDegrees/Images/students.webp";

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    horario: "",
    provincia: "",
    tipoCarrera: "",
    carrera: "",
    modalidad: "",
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío al servidor
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    
    setIsSubmitting(false);
    setShowSuccess(true);

    // Resetear formulario después de 4 segundos
    setTimeout(() => {
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        horario: "",
        provincia: "",
        tipoCarrera: "",
        carrera: "",
        modalidad: "",
      });
      setShowSuccess(false);
    }, 4000);
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
              {showSuccess ? (
                /* Success Message */
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-3">¡Solicitud Enviada!</h3>
                  <p className="text-slate-600 text-lg max-w-md">
                    Gracias por tu interés. Un asesor se comunicará contigo en breve para brindarte toda la información que necesitas.
                  </p>
                </motion.div>
              ) : (
                <>
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

                  <motion.form 
                    variants={containerVariants} 
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div variants={itemVariants}>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Nombre"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                          disabled={isSubmitting}
                        />
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <input
                          type="text"
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          placeholder="Apellido"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          required
                          disabled={isSubmitting}
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={itemVariants}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Correo Electrónico"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        required
                        disabled={isSubmitting}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        placeholder="Teléfono"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        required
                        disabled={isSubmitting}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <select 
                        name="horario"
                        value={formData.horario}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500"
                        disabled={isSubmitting}
                      >
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
                      <select 
                        name="provincia"
                        value={formData.provincia}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500"
                        disabled={isSubmitting}
                      >
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
                        <select 
                          name="tipoCarrera"
                          value={formData.tipoCarrera}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500"
                          disabled={isSubmitting}
                        >
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
                        <select 
                          name="carrera"
                          value={formData.carrera}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500"
                          disabled={isSubmitting}
                        >
                          <option value="">Carrera</option>
                          {[
                            "Ingeniería en Sistemas",
                            "Licenciatura en Administración",
                            "Contador Público",
                            "Diseño Gráfico",
                            "Medicina",
                            "Arquitectura",
                            "Psicología",
                          ].map((carrera, index) => (
                            <option
                              key={index}
                              value={carrera.toLowerCase().replace(/\s+/g, "-")}
                            >
                              {carrera}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    </div>

                    <motion.div variants={itemVariants}>
                      <select 
                        name="modalidad"
                        value={formData.modalidad}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Modalidad</option>
                        {[
                          "Presencial",
                          "Virtual",
                          "Híbrido",
                          "Asincrónica",
                          "Mixta",
                        ].map((modalidad, index) => (
                          <option key={index} value={modalidad.toLowerCase()}>
                            {modalidad}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>ENVIANDO...</span>
                          </>
                        ) : (
                          "SOLICITAR INFORMACIÓN"
                        )}
                      </button>
                    </motion.div>
                  </motion.form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
