import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  GraduationCap,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { NormalizedDegrees } from "../../assets/AllDegrees/AllDegrees";

export const DisplayDegree: React.FC = () => {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const career = NormalizedDegrees.find((item) => item.id === Number(careerId));

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-lg text-gray-600">Carrera no encontrada</p>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    navigate("/inscripciones", {
      state: {
        degree:
          career.category.charAt(0).toUpperCase() +
          career.category.slice(1).replace("-", " "),
        program: career.name,
        programType: career.type === "virtual" ? "virtual" : "presencial",
      },
    });
  };

  return (
    <div className="bg-gradient-to-b from-white to-slate-50">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[60vh] overflow-hidden"
      >
        <img
          src={career.image}
          alt={career.name}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 backdrop-blur-[1px]" />

        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-16 w-full">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-extrabold text-white max-w-3xl leading-tight"
            >
              {career.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-6"
            >
              <span className="px-4 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur">
                {career.type}
              </span>
              <span className="px-4 py-1 rounded-full bg-white/20 text-white text-sm backdrop-blur">
                {career.duration}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-10"
        >
          {/* INTRO */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Formamos profesionales preparados para el futuro
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Todas las asignaturas son teórico-prácticas, con una fuerte
              orientación profesional. Los estudiantes adquieren experiencia
              real desde el primer año, con docentes especializados y
              metodologías actuales.
            </p>
          </div>

          {/* INFO GRID */}
          <div className="grid sm:grid-cols-2 gap-6">
            {career.program !== "Curso" && career.title && (
              <div className="rounded-2xl bg-white p-6 shadow-sm border">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                  <GraduationCap className="text-indigo-600" />
                  Título obtenido
                </h3>
                <p className="text-gray-600">{career.title}</p>
              </div>
            )}

            <div className="rounded-2xl bg-white p-6 shadow-sm border">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                <Calendar className="text-indigo-600" />
                Duración
              </h3>
              <p className="text-gray-600">{career.duration}</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                <MapPin className="text-indigo-600" />
                Modalidad
              </h3>
              <p className="text-gray-600 capitalize">{career.type}</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
                <Clock className="text-indigo-600" />
                Horarios
              </h3>
              <p className="text-gray-600">{career.time}</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT CARD */}
        <motion.aside
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 shadow-xl h-fit sticky top-24"
        >
          <h3 className="text-2xl font-bold mb-4">
            ¿Te interesa esta carrera?
          </h3>
          <p className="text-white/90 mb-6">
            Iniciá tu inscripción y comenzá a construir tu futuro profesional
            con nosotros.
          </p>

          <button
            onClick={handleEnroll}
            className="w-full flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Inscribirme ahora
            <ArrowRight size={18} />
          </button>

          <p className="text-xs text-white/70 mt-4 text-center">
            Cupos limitados · Inicio próximo ciclo
          </p>
        </motion.aside>
      </section>
    </div>
  );
};
