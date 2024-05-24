import { PiStudentFill } from "react-icons/pi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";

export const Institution = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 gap-10 mt-10 px-10 py-10 bg-gradient-to-tr from-gray-700 to-gray-900 content-center items-center justify-items-center  ">
        <div className="flex flex-col items-center gap-3">
          <PiStudentFill color="white" size={60} />
          <h1 className="text-2xl text-white">1000</h1>
          <p className="text-white">Alumnos</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <FaBook color="white" size={60} />
          <h1 className="text-2xl text-white">10</h1>
          <p className="text-white">Programas y Cursos de Extensión</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <FaBookmark color="white" size={60} />
          <h1 className="text-2xl text-white">20</h1>
          <p className="text-white">Carreras de Grado y Posgrado</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <FaMapMarkerAlt color="white" size={60} />
          <h1 className="text-2xl text-white">5</h1>
          <p className="text-white">Instalaciones Educativas</p>
        </div>
      </div>
    </>
  );
};
