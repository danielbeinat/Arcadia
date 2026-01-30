import React from "react";
import {
  AllDegrees,
  NormalizedDegrees,
} from "../../assets/AllDegrees/AllDegrees";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DegreeCard } from "../../Components/DegreeCard/DegreeCard";

export const Online: React.FC = () => {
  const navigate = useNavigate();
  const handleCardClick = (id: number) => {
    window.scrollTo(0, 0);

    navigate(`/career/${id}`);
  };

  const handleEnroll = (item: any) => {
    window.scrollTo(0, 0);
    navigate("/inscripciones", {
      state: {
        degree:
          item.category.charAt(0).toUpperCase() +
          item.category.slice(1).replace("-", " "),
        program: item.name,
        programType: item.type === "virtual" ? "virtual" : "presencial",
      },
    });
  };

  const filteredDegrees = NormalizedDegrees.filter(
    (item) => item.type === "virtual",
  );
  return (
    <>
      <div className="mb-20">
        {/* Banner SVG como cabecera principal */}
        <div className="max-w-7xl mx-auto px-4 pt-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1200 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Background */}
              <rect width="1200" height="320" rx="24" fill="white" />

              {/* Left Gradient Shape */}
              <defs>
                <linearGradient
                  id="violetGradientOnline"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6D28D9" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>

              <path
                d="M0 0H340C260 80 260 240 340 320H0V0Z"
                fill="url(#violetGradientOnline)"
              />

              {/* Glass Icon Background */}
              <rect
                x="110"
                y="110"
                width="100"
                height="100"
                rx="20"
                fill="white"
                fillOpacity="0.15"
              />

              {/* Monitor Icon */}
              <rect
                x="130"
                y="140"
                width="60"
                height="40"
                rx="6"
                stroke="white"
                strokeWidth="3"
                fill="none"
              />
              <line
                x1="160"
                y1="180"
                x2="160"
                y2="195"
                stroke="white"
                strokeWidth="3"
              />
              <rect x="145" y="195" width="30" height="5" rx="2" fill="white" />

              {/* Text */}
              <text
                x="380"
                y="140"
                className="text-4xl font-black fill-gray-900"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Carreras Virtuales
              </text>
              <text
                x="380"
                y="180"
                className="text-lg fill-gray-500 font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Estudia a tu ritmo con nuestra plataforma de vanguardia
              </text>

              {/* Badges */}
              <rect
                x="380"
                y="210"
                width="140"
                height="32"
                rx="16"
                fill="#F3F4F6"
              />
              <text
                x="400"
                y="231"
                className="text-xs font-bold fill-gray-600 uppercase"
              >
                100% Online
              </text>

              <rect
                x="530"
                y="210"
                width="180"
                height="32"
                rx="16"
                fill="#EEF2FF"
              />
              <text
                x="550"
                y="231"
                className="text-xs font-bold fill-indigo-600 uppercase"
              >
                Campus 24/7
              </text>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDegrees.map((item) => (
            <DegreeCard
              key={item.id}
              item={item}
              onClick={() => handleCardClick(item.id)}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      </div>
    </>
  );
};
