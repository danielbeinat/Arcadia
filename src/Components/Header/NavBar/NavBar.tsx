import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../../../assets/AllDegrees/Images/Logo.png";
import { Link } from "react-router-dom";

interface Sublink {
  name: string;
  to: string;
}

interface LinkItem {
  name: string;
  to?: string;
  sublinks: Sublink[];
}

const navigationLinks: LinkItem[] = [
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
  const [isShow, setIsShow] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleLinkClick = () => {
    setOpenSubmenu(null);
    setIsShow(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-gray-50"
      }`}
    >
      <div className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="flex items-center justify-between py-4 px-6 lg:px-10 gap-8 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => {
              setIsShow(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img className="w-[150px] h-[50px]" src={logo} alt="" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block flex-1">
            <ul className="flex justify-center gap-8">
              {navigationLinks.map((link, index) => (
                <li key={link.name} className="relative group">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleSubmenuToggle(index)}
                  >
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 ease-in-out"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <span className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 ease-in-out">
                        {link.name}
                      </span>
                    )}
                    {link.sublinks.length > 0 && (
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-indigo-600 transition-colors" />
                    )}
                  </div>
                  {openSubmenu === index && link.sublinks.length > 0 && (
                    <ul className="absolute bg-white z-10 w-48 mt-2 py-1 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-200 ease-in-out">
                      {link.sublinks.map((sublink) => (
                        <li key={sublink.name}>
                          <Link
                            to={sublink.to}
                            onClick={handleLinkClick}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ease-in-out"
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

          {/* Desktop Inscription Button */}
          <Link
            to="/inscripciones"
            className="hidden md:block text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl px-5 py-2.5 hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Inscripciones
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsShow(!isShow)}
            className="md:hidden rounded-lg p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile Navigation */}
          {isShow && (
            <div className="top-[80px] z-50 w-full px-4 h-screen md:hidden right-0 absolute bg-white  transition-all duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-4">
                    {navigationLinks.map((link, index) => (
                      <li key={link.name}>
                        <div
                          className="flex items-center justify-between"
                          onClick={() => handleSubmenuToggle(index)}
                        >
                          {link.to ? (
                            <Link
                              to={link.to}
                              onClick={handleLinkClick}
                              className="text-lg text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                            >
                              {link.name}
                            </Link>
                          ) : (
                            <span className="text-lg text-gray-700 font-medium">
                              {link.name}
                            </span>
                          )}
                          {link.sublinks.length > 0 && (
                            <ChevronDown
                              className={`w-5 h-5 text-gray-500 transition-all duration-200 ${
                                openSubmenu === index
                                  ? "rotate-180 text-indigo-600"
                                  : ""
                              }`}
                            />
                          )}
                        </div>
                        {openSubmenu === index && link.sublinks.length > 0 && (
                          <ul className="mt-2 ml-4 space-y-2">
                            {link.sublinks.map((sublink) => (
                              <li key={sublink.name}>
                                <Link
                                  to={sublink.to}
                                  onClick={handleLinkClick}
                                  className="block text-gray-600 hover:text-indigo-600 transition-all duration-200"
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
                  <div className="py-4 border-t border-gray-100">
                    <Link
                      to="/inscripciones"
                      onClick={handleLinkClick}
                      className="block w-full text-center text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl px-4 py-3 font-medium hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Inscripciones
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
