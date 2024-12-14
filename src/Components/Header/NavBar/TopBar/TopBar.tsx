// import { FaUser } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { redes } from "./Icons";

// interface Items {
//   icon: JSX.Element;
// }

// export const TopBar: React.FC = () => {
//   return (
//     <>
//       <div className="flex items-center justify-between bg-black md:px-10 px-4 py-1">
//         <div className="flex items-center gap-4">
//           <h1 className="text-sm text-white hidden md:flex font-medium">
//             Seguinos:
//           </h1>
//           <div className="flex items-center gap-2">
//             {redes.map((item: Items, i) => (
//               <a key={i}>{item.icon}</a>
//             ))}
//           </div>
//         </div>
//         <div className="hidden md:flex">
//           <h1 className="text-white text-sm font-bold">
//             Contactate Ingresantes 0900-123-4567 | Alumnos 0800-296-4385
//           </h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <Link
//             to={"/login"}
//             className="flex gap-2 items-center"
//             onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//           >
//             <FaUser className="text-white" />
//             <h1 className="text-white text-sm ">Mi cuenta</h1>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

import { Link } from "react-router-dom";
import { redes } from "./Icons";

interface Items {
  icon: JSX.Element;
}

export const TopBar: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/30">
      <div className="flex items-center justify-between px-4 md:px-10 py-2.5">
        {/* Social Media Section */}
        <div className="flex items-center gap-4">
          <h1 className="text-sm text-slate-300 hidden md:flex font-medium">
            Seguinos:
          </h1>
          <div className="flex items-center gap-3">
            {redes.map((item: Items, i) => (
              <a
                key={i}
                className="text-slate-400 hover:text-slate-200 transform hover:scale-110 transition-all duration-200"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="hidden md:block">
          <h1 className="text-slate-300 text-sm font-medium">
            <span className="text-slate-400">Contactate</span>{" "}
            <span className="bg-slate-800/50 px-3 py-1 rounded-full mx-1">
              Ingresantes 0900-123-4567
            </span>{" "}
            |{" "}
            <span className="bg-slate-800/50 px-3 py-1 rounded-full mx-1">
              Alumnos 0800-296-4385
            </span>
          </h1>
        </div>

        {/* User Account */}
        <Link
          to="/login"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="text-slate-400">{/* Keep your FaUser icon */}</span>
          <span className="text-sm font-medium">Mi cuenta</span>
        </Link>
      </div>
    </div>
  );
};
