import React from "react";
import { motion } from "framer-motion";
import { MdCalendarMonth } from "react-icons/md";
import { FaUserGraduate, FaFlag } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";

export interface DegreeItem {
  id: number;
  image: string;
  name: string;
  Type: string;
  duration: string;
  program: string;
  title?: string;
  degree?: string;
  category: string;
  Time: string;
  description?: string;
  date?: string;
}

interface DegreeCardProps {
  item: DegreeItem;
  onClick: (id: number) => void;
}

export const DegreeCard: React.FC<DegreeCardProps> = ({ item, onClick }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col"
      onClick={() => onClick(item.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <span className="absolute top-4 left-4 px-4 py-1.5 text-xs font-bold rounded-full bg-white/90 text-indigo-700 shadow-lg backdrop-blur">
          {item.category}
        </span>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <h2 className="text-xl font-extrabold text-gray-900 mb-4 leading-snug line-clamp-2">
          {item.name}
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <InfoRow
            icon={<MdCalendarMonth />}
            label="Duración"
            value={item.duration}
          />
          <InfoRow
            icon={<FaUserGraduate />}
            label="Programa"
            value={item.program}
          />

          {item.title && (
            <InfoRow icon={<FaFlag />} label="Título" value={item.title} />
          )}

          {item.degree && (
            <InfoRow
              icon={<GiGraduateCap />}
              label="Grado"
              value={item.degree}
            />
          )}
        </div>

        <div className="mt-auto pt-6">
          <div className="w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm group-hover:bg-indigo-700 transition">
            Ver más información
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
      {icon}
    </div>
    <div className="leading-tight">
      <span className="block text-xs font-medium text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  </div>
);
