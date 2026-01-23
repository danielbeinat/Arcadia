import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, UserCheck, GraduationCap, Flag } from "lucide-react";
import { NormalizedDegrees } from "../../assets/AllDegrees/AllDegrees";
import type { Degree } from "../../types/Degree";

export const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    window.scrollTo(0, 0);
    navigate(`/career/${id}`);
  };

  const degrees = NormalizedDegrees.filter(
    (item) => item.category === category,
  );

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 py-12 px-4 sm:px-6 lg:px-8 mb-12"
      >
        <h1 className="text-4xl md:text-5xl text-white font-bold uppercase text-center">
          {category}
        </h1>
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {degrees.map((item: Degree) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(item.id)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  {item.name}
                </h2>
                <div className="space-y-3">
                  <InfoItem
                    icon={<Calendar className="w-5 h-5" />}
                    label="Duración"
                    value={item.duration}
                  />
                  <InfoItem
                    icon={<UserCheck className="w-5 h-5" />}
                    label="Programa"
                    value={item.program}
                  />
                  {(item.type === "presencial" || item.type === "virtual") && (
                    <>
                      <InfoItem
                        icon={<Flag className="w-5 h-5" />}
                        label="Título"
                        value={item.title}
                      />
                      <InfoItem
                        icon={<GraduationCap className="w-5 h-5" />}
                        label="Grado"
                        value={item.degree}
                      />
                    </>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center text-gray-700">
    <div className="bg-indigo-100 rounded-full p-2 mr-3">{icon}</div>
    <div>
      <span className="font-semibold">{label}:</span> {value}
    </div>
  </div>
);
