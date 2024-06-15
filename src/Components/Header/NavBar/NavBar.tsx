import { IoMdMenu, IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState } from "react";
import universidad from "../../../assets/universidad.webp";

interface Sublink {
  name: string;
  to: string;
}

interface LinkItem {
  name: string;
  to?: string;
  sublinks: Sublink[];
}

const links: LinkItem[] = [
  { name: "Inicio", to: "/", sublinks: [] },
  {
    name: "Ingresantes",
    sublinks: [
      { name: "Información", to: "/info" },
      { name: "Requisitos", to: "/requisitos" },
    ],
  },
  {
    name: "Carreras",
    sublinks: [
      { name: "Carreras online", to: "/online" },
      { name: "Carreras presenciales", to: "/presenciales" },
    ],
  },
  {
    name: "Alumnos",
    sublinks: [
      { name: "Portal", to: "/portal" },
      { name: "Servicios", to: "/servicios" },
    ],
  },
  { name: "Cursos", to: "/cursos", sublinks: [] },
  { name: "Nosotros", to: "/about", sublinks: [] },
];

export const NavBar = () => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleLinkClick = () => {
    setOpenSubmenu(null);
    setIsShow(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center justify-between py-4 px-10 gap-16">
      <Link
        to={"/"}
        className="flex items-center gap-2"
        onClick={() => {
          setIsShow(false);
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <img src={universidad} alt="universidad" className="w-12" />
        <div className="flex flex-col">
          <h1 className="text-xl leading-none font-bold">Instituto</h1>
          <h1 className="text-xl leading-none font-bold">Arcadia</h1>
        </div>
      </Link>

      <nav className="hidden md:block">
        <ul className="flex gap-10">
          {links.map((link, index: number) => (
            <li key={link.name} className="relative">
              <div
                className="flex gap-1 items-center cursor-pointer"
                onClick={() => handleSubmenuToggle(index)}
              >
                {link.to ? (
                  <Link to={link.to} className="text-xl">
                    {link.name}
                  </Link>
                ) : (
                  <span className="text-xl">{link.name}</span>
                )}
                {link.sublinks.length > 0 && <IoMdArrowDropdown />}
              </div>
              {openSubmenu === index && link.sublinks.length > 0 && (
                <ul className="absolute bg-white z-10 border-t-2 border-blue-500 w-40 shadow-lg mt-2 p-2 rounded">
                  {link.sublinks.map((sublink) => (
                    <li key={sublink.name}>
                      <Link
                        to={sublink.to}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        {sublink.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <Link
        to={"/inscripciones"}
        className="text-xl bg-blue-500 text-white md:block hidden rounded px-4 py-2"
      >
        Inscripciones
      </Link>

      <div>
        <button onClick={() => setIsShow(!isShow)}>
          {isShow ? (
            <IoMdClose className="md:hidden text-3xl" />
          ) : (
            <IoMdMenu className="md:hidden text-3xl" />
          )}
        </button>
        {isShow && (
          <nav className="top-[90px] z-50 w-full h-screen md:hidden right-0 absolute bg-white p-10 transition-all duration-300 ease-in-out">
            <ul className="flex flex-col gap-10">
              {links.map((link, index) => (
                <li key={link.name} className="relative">
                  <div
                    className="flex gap-1 items-center cursor-pointer"
                    onClick={() => handleSubmenuToggle(index)}
                  >
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-xl"
                        onClick={
                          link.name === "Cursos" ||
                          link.name === "Nosotros" ||
                          link.name === "Inicio"
                            ? handleLinkClick
                            : undefined
                        }
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <span className="text-xl">{link.name}</span>
                    )}
                    {link.sublinks.length > 0 && <IoMdArrowDropdown />}
                  </div>
                  {openSubmenu === index && link.sublinks.length > 0 && (
                    <ul className="mt-2">
                      {link.sublinks.map((sublink) => (
                        <li key={sublink.name}>
                          <Link
                            to={sublink.to}
                            onClick={handleLinkClick}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                          >
                            {sublink.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <Link
                to={"/inscripciones"}
                className="text-lg px-4 py-2 w-full text-center bg-blue-500 text-white rounded"
                onClick={() => {
                  setIsShow(false);
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Inscripciones
              </Link>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};
