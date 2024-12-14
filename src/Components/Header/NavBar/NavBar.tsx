// import { IoMdMenu, IoMdArrowDropdown, IoMdClose } from "react-icons/io";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import universidad from "../../../assets/universidad.webp";

// interface Sublink {
//   name: string;
//   to: string;
// }

// interface LinkItem {
//   name: string;
//   to?: string;
//   sublinks: Sublink[];
// }

// const links: LinkItem[] = [
//   { name: "Inicio", to: "/", sublinks: [] },
//   {
//     name: "Ingresantes",
//     sublinks: [
//       { name: "Información", to: "/info" },
//       { name: "Requisitos", to: "/requisitos" },
//     ],
//   },
//   {
//     name: "Carreras",
//     sublinks: [
//       { name: "Carreras online", to: "/online" },
//       { name: "Carreras presenciales", to: "/presenciales" },
//     ],
//   },
//   {
//     name: "Alumnos",
//     sublinks: [
//       { name: "Portal", to: "/portal" },
//       { name: "Servicios", to: "/servicios" },
//     ],
//   },
//   { name: "Cursos", to: "/cursos", sublinks: [] },
//   { name: "Nosotros", to: "/about", sublinks: [] },
// ];

// export const NavBar = () => {
//   const [isShow, setIsShow] = useState<boolean>(false);
//   const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

//   const handleSubmenuToggle = (index: number) => {
//     setOpenSubmenu(openSubmenu === index ? null : index);
//   };

//   const handleLinkClick = () => {
//     setOpenSubmenu(null);
//     setIsShow(false);
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <div className="flex items-center justify-between py-4 px-10 gap-16">
//       <Link
//         to={"/"}
//         className="flex items-center gap-2"
//         onClick={() => {
//           setIsShow(false);
//           window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//           });
//         }}
//       >
//         <img src={universidad} alt="universidad" className="w-12" />
//         <div className="flex flex-col">
//           <h1 className="text-xl leading-none font-bold">Instituto</h1>
//           <h1 className="text-xl leading-none font-bold">Arcadia</h1>
//         </div>
//       </Link>

//       <nav className="hidden md:block">
//         <ul className="flex gap-10">
//           {links.map((link, index: number) => (
//             <li key={link.name} className="relative">
//               <div
//                 className="flex gap-1 items-center cursor-pointer"
//                 onClick={() => handleSubmenuToggle(index)}
//               >
//                 {link.to ? (
//                   <Link to={link.to} className="text-xl">
//                     {link.name}
//                   </Link>
//                 ) : (
//                   <span className="text-xl">{link.name}</span>
//                 )}
//                 {link.sublinks.length > 0 && <IoMdArrowDropdown />}
//               </div>
//               {openSubmenu === index && link.sublinks.length > 0 && (
//                 <ul className="absolute bg-white z-10 border-t-2 border-blue-500 w-40 shadow-lg mt-2 p-2 rounded">
//                   {link.sublinks.map((sublink) => (
//                     <li key={sublink.name}>
//                       <Link
//                         to={sublink.to}
//                         onClick={handleLinkClick}
//                         className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
//                       >
//                         {sublink.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <Link
//         to={"/inscripciones"}
//         className="text-xl bg-blue-500 text-white md:block hidden rounded px-4 py-2"
//       >
//         Inscripciones
//       </Link>

//       <div>
//         <button onClick={() => setIsShow(!isShow)}>
//           {isShow ? (
//             <IoMdClose className="md:hidden text-3xl" />
//           ) : (
//             <IoMdMenu className="md:hidden text-3xl" />
//           )}
//         </button>
//         {isShow && (
//           <nav className="top-[90px] z-50 w-full h-screen md:hidden right-0 absolute bg-white p-10 transition-all duration-300 ease-in-out">
//             <ul className="flex flex-col gap-10">
//               {links.map((link, index) => (
//                 <li key={link.name} className="relative">
//                   <div
//                     className="flex gap-1 items-center cursor-pointer"
//                     onClick={() => handleSubmenuToggle(index)}
//                   >
//                     {link.to ? (
//                       <Link
//                         to={link.to}
//                         className="text-xl"
//                         onClick={
//                           link.name === "Cursos" ||
//                           link.name === "Nosotros" ||
//                           link.name === "Inicio"
//                             ? handleLinkClick
//                             : undefined
//                         }
//                       >
//                         {link.name}
//                       </Link>
//                     ) : (
//                       <span className="text-xl">{link.name}</span>
//                     )}
//                     {link.sublinks.length > 0 && <IoMdArrowDropdown />}
//                   </div>
//                   {openSubmenu === index && link.sublinks.length > 0 && (
//                     <ul className="mt-2">
//                       {link.sublinks.map((sublink) => (
//                         <li key={sublink.name}>
//                           <Link
//                             to={sublink.to}
//                             onClick={handleLinkClick}
//                             className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
//                           >
//                             {sublink.name}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//               <Link
//                 to={"/inscripciones"}
//                 className="text-lg px-4 py-2 w-full text-center bg-blue-500 text-white rounded"
//                 onClick={() => {
//                   setIsShow(false);
//                   window.scrollTo({
//                     top: 0,
//                     behavior: "smooth",
//                   });
//                 }}
//               >
//                 Inscripciones
//               </Link>
//             </ul>
//           </nav>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../../../assets/Logo.png";

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

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleLinkClick = () => {
    setOpenSubmenu(null);
    setIsShow(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className=" bg-gray-50">
      <div className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 border-b border-gray-100">
        <div className="flex items-center justify-between py-4 px-6 lg:px-10 gap-8 max-w-7xl mx-auto">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3"
            onClick={() => {
              setIsShow(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img className="w-[150px] h-[50px]" src={logo} alt="" />
          </a>

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
                      <a
                        href={link.to}
                        className="text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200 ease-in-out"
                      >
                        {link.name}
                      </a>
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
                          <a
                            href={sublink.to}
                            onClick={handleLinkClick}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ease-in-out"
                          >
                            {sublink.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Inscription Button */}
          <a
            href="/inscripciones"
            className="hidden md:block text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl px-5 py-2.5 hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Inscripciones
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsShow(!isShow)}
            className="md:hidden rounded-lg p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Mobile Navigation */}
          {isShow && (
            <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm md:hidden">
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
                            <a
                              href={link.to}
                              onClick={handleLinkClick}
                              className="text-lg text-gray-700 hover:text-indigo-600 font-medium transition-all duration-200"
                            >
                              {link.name}
                            </a>
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
                                <a
                                  href={sublink.to}
                                  onClick={handleLinkClick}
                                  className="block text-gray-600 hover:text-indigo-600 transition-all duration-200"
                                >
                                  {sublink.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-4 border-t border-gray-100">
                  <a
                    href="/inscripciones"
                    onClick={handleLinkClick}
                    className="block w-full text-center text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl px-4 py-3 font-medium hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Inscripciones
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
