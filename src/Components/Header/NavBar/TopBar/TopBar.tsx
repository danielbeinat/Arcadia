import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { redes } from "./Icons";

interface Items {
  icon: JSX.Element;
}

export const TopBar: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between bg-black md:px-10 px-4 py-1">
        <div className="flex items-center gap-4">
          <h1 className="text-sm text-white hidden md:flex font-medium">
            Seguinos:
          </h1>
          <div className="flex items-center gap-2">
            {redes.map((item: Items, i) => (
              <a key={i}>{item.icon}</a>
            ))}
          </div>
        </div>
        <div className="hidden md:flex">
          <h1 className="text-white text-sm font-bold">
            Contactate Ingresantes 0900-123-4567 | Alumnos 0800-296-4385
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to={"/login"}
            className="flex gap-2 items-center"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <FaUser className="text-white" />
            <h1 className="text-white text-sm ">Mi cuenta</h1>
          </Link>
        </div>
      </div>
    </>
  );
};
