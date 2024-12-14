import Virtual from "../../assets/AllDegrees/Images/Virtual.webp";
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

export const Online = () => {
  const navigate = useNavigate();
  const handleCardClick = (id: number) => {
    window.scrollTo(0, 0);

    navigate(`/career/${id}`);
  };
  const Degree = AllDegrees.filter((item) => item.Type === "virtual");
  return (
    <>
      <div className="mb-20">
        <div className="w-full mt-10 md:h-[290px]">
          <img
            className="w-full rounded-t object-cover md:h-[290px]"
            src={Virtual}
            alt="virtual"
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 md:mt-20 mt-10 justify-items-center ">
          {Degree.map((item: Item) => (
            <article
              className="flex flex-col gap-3 lg:w-[340px] w-[290px] mb-10 shadow-lg rounded pb-5 transform transition duration-500 hover:scale-105 cursor-pointer"
              key={item.id}
              onClick={() => handleCardClick(item.id)}
            >
              <img
                src={item.image}
                alt="image"
                className="w-full h-[200px] object-cover rounded-t"
              />
              <h1 className="text-xl text-center text-gray-700 font-bold">
                {item.name}
              </h1>

              <div className="px-3 flex flex-col">
                <hr className=" border border-gray-300" />

                <div className="flex flex-col gap-3 mt-5">
                  <div className="  ">
                    <MdCalendarMonth className="inline mr-2 text-2xl bg-indigo-800 text-white p-1 rounded-full " />
                    <span>
                      <span className="font-bold">duracion:</span>{" "}
                      {item.duration}
                    </span>
                  </div>

                  <div className="">
                    <FaUserGraduate className="inline mr-2 text-2xl bg-indigo-800 text-white p-1 rounded-full" />
                    <span>
                      <span className="font-bold">Programa:</span>{" "}
                      {item.program}
                    </span>
                  </div>

                  <div className="">
                    <FaFlag className="inline mr-2 text-2xl bg-indigo-800 text-white p-1 rounded-full" />
                    <span>
                      <span className="font-bold">Titulo:</span> {item.title}
                    </span>
                  </div>

                  <div className="">
                    <GiGraduateCap className="inline mr-2 text-2xl bg-indigo-800 text-white p-1 rounded-full" />
                    <span className="font-bold">{item.degree}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div> */}

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
