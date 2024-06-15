import { PiStudentFill } from "react-icons/pi";
import { FaMapMarkerAlt, FaBookmark, FaBook } from "react-icons/fa";

interface InfoItem {
  icon: JSX.Element;
  count: number;
  description: string;
}

const institutionInfo: InfoItem[] = [
  {
    icon: <PiStudentFill color="white" size={60} />,
    count: 1000,
    description: "Alumnos",
  },
  {
    icon: <FaBook color="white" size={60} />,
    count: 10,
    description: "Programas y Cursos de Extensión",
  },
  {
    icon: <FaBookmark color="white" size={60} />,
    count: 20,
    description: "Carreras de Grado y Posgrado",
  },
  {
    icon: <FaMapMarkerAlt color="white" size={60} />,
    count: 5,
    description: "Instalaciones Educativas",
  },
];

export const Institution: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 gap-10 mt-10 px-10 py-10 bg-gradient-to-tr from-gray-700 to-gray-900 content-center items-center justify-items-center">
        {institutionInfo.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 text-center"
          >
            {item.icon}
            <h1 className="text-2xl text-white">{item.count}</h1>
            <p className="text-white">{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};
