import presencial from "../../assets/AllDegrees/Images/presencial.webp";
import { AllDegrees } from "../../assets/AllDegrees/AllDegrees";
import { MdCalendarMonth } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { FaFlag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Item {
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

export const OnCampus: React.FC = () => {
  const navigate = useNavigate();
  const handleCardClick = (id: number) => {
    window.scrollTo(0, 0);
    navigate(`/career/${id}`);
  };

  const Degree = AllDegrees.filter((item) => item.Type === "presencial");
  return (
    <>
      <div className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full "
        >
          <img className="" src={presencial} alt="Presencial" />
        </motion.div>

        <div className="grid grid-cols-1 mt-[100px] px-4 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Degree.map((item: Item) => (
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
                  <div className="flex items-center text-gray-700">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <MdCalendarMonth className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold">Duración:</span>{" "}
                      {item.duration}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <FaUserGraduate className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold">Programa:</span>{" "}
                      {item.program}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <FaFlag className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold">Título:</span>{" "}
                      {item.title}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <div className="bg-indigo-100 rounded-full p-2 mr-3">
                      <GiGraduateCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold">Grado:</span>{" "}
                      {item.degree}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  );
};
