import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import students from "../../assets/AllDegrees/Images/students.webp";

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={students}
                alt="Estudiantes universitarios"
                className="w-full h-[800px] object-cover scale-105 saturate-90 contrast-110 brightness-95"
              />

              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/70 via-indigo-700/40 to-transparent"></div>

              <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-24 left-[-80px] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

              <div className="absolute bottom-10 left-10 right-10">
                <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    Formación universitaria de calidad
                  </h3>
                  <p className="text-white/90 text-sm">
                    Acompañamos tu desarrollo académico y profesional desde el
                    primer día.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:w-1/2 w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 p-10"
          >
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  Solicitud enviada
                </h3>
                <p className="text-gray-600 max-w-md">
                  Un asesor académico se comunicará contigo a la brevedad.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                    Contacto académico
                  </span>
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                    ¿Querés estudiar con nosotros?
                  </h2>
                  <p className="text-gray-600">
                    Completá tus datos y un asesor te orientará personalmente.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FloatingInput label="Nombre" required />
                    <FloatingInput label="Apellido" required />
                  </div>

                  <FloatingInput
                    label="Correo electrónico"
                    type="email"
                    required
                  />
                  <FloatingInput label="Teléfono" required />

                  <FloatingSelect label="Provincia">
                    <option>Buenos Aires</option>
                    <option>Córdoba</option>
                    <option>Santa Fe</option>
                  </FloatingSelect>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FloatingSelect label="Tipo de carrera">
                      <option>Carreras de Grado</option>
                      <option>Posgrados</option>
                      <option>Cursos</option>
                    </FloatingSelect>

                    <FloatingSelect label="Modalidad">
                      <option>Presencial</option>
                      <option>Online</option>
                      <option>Híbrida</option>
                    </FloatingSelect>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition"
                  >
                    {isSubmitting
                      ? "Enviando..."
                      : "Solicitar asesor académico"}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FloatingInput = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <input
      {...props}
      placeholder=" "
      className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-gray-200 bg-white
      focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
    />
    <label
      className="absolute left-4 top-2 text-xs text-gray-500
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
      peer-focus:top-2 peer-focus:text-xs transition-all"
    >
      {label}
    </label>
  </div>
);

const FloatingSelect = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-gray-200 bg-white
      focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
    >
      <option value="" hidden />
      {children}
    </select>
    <label className="absolute left-4 top-2 text-xs text-gray-500 transition-all">
      {label}
    </label>
  </div>
);
