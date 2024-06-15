import Presencial from "../../assets/AllDegrees/Images/Presencial.webp";
import { AllDegrees } from "../../assets/AllDegrees/AllDegrees";
import { MdCalendarMonth } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { FaFlag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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
        <div className="w-full md:h-[290px]  mt-10">
          <img
            className="w-full md:h-[290px] object-cover rounded-t"
            src={Presencial}
            alt="Presencial"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:mt-20 mt-10 justify-items-center ">
          {Degree.map((item: Item) => (
            <article
              className="flex flex-col gap-3 md:w-[340px] w-[290px] mb-10 shadow-lg rounded pb-5 transform transition duration-500 hover:scale-105 cursor-pointer"
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
        </div>
      </div>
    </>
  );
};
