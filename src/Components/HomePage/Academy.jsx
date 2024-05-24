import React from "react";
import { Link } from "react-router-dom";

export const Academy = () => {
  return (
    <>
      <div className="container mx-auto md:px-10 py-10 px-5 mt-10">
        <h1 className="text-3xl text-center md:text-start font-bold py-5">
          Áreas académicas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-stretch content-center items-center place-items-center">
          <Link
            to={"area/informatica"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            onClick={() => window.scrollTo(0, 0)}
          >
            Informatica
          </Link>
          <Link
            to={"area/arquitectura"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            onClick={() => window.scrollTo(0, 0)}
          >
            Arquitectura
          </Link>
          <Link
            to={"area/derecho"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            onClick={() => window.scrollTo(0, 0)}
          >
            Derecho
          </Link>
          <Link
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            to={"area/humanidades"}
          >
            Humanidades
          </Link>
          <Link
            to={"area/bellas artes"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            onClick={() => window.scrollTo(0, 0)}
          >
            Bellas artes
          </Link>
          <Link
            to={"area/economicas"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            onClick={() => window.scrollTo(0, 0)}
          >
            Economicas
          </Link>
          <Link
            to={"area/ingenieria"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            onClick={() => window.scrollTo(0, 0)}
          >
            Ingernieria
          </Link>
          <Link
            to={"area/psicologia"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            onClick={() => window.scrollTo(0, 0)}
          >
            psicologia
          </Link>
          <Link
            to={"area/salud"}
            className="flex items-center justify-center bg-gradient-to-tr from-gray-700 to-gray-900 text-xl text-white font-bold shadow md:h-32 h-20 rounded cursor-pointer hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-1 hover:scale-105 "
            onClick={() => window.scrollTo(0, 0)}
          >
            salud
          </Link>
        </div>
      </div>
    </>
  );
};
