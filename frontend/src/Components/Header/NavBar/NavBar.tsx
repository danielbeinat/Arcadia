import { useState } from "react";
import {
  Menu,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  X,
} from "lucide-react";
import logo from "../../../assets/AllDegrees/Images/Logo.webp";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

interface Sublink {
  name: string;
  to: string;
}

interface NavLink {
  name: string;
  to?: string;
  sub?: Sublink[];
}

const NAV_LINKS: NavLink[] = [
  { name: "Inicio", to: "/" },
  {
    name: "Ingresantes",
    sub: [
      { name: "Información", to: "/info" },
      { name: "Requisitos", to: "/requisitos" },
    ],
  },
  {
    name: "Carreras",
    sub: [
      { name: "Online", to: "/online" },
      { name: "Presenciales", to: "/presenciales" },
    ],
  },
  { name: "Cursos", to: "/cursos" },
  { name: "Eventos", to: "/eventos" },
  { name: "Nosotros", to: "/about" },
];

export const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [openProfile, setOpenProfile] = useState(false);

  const closeAll = () => {
    setOpenMenu(null);
    setOpenProfile(false);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" onClick={closeAll}>
            <img src={logo} alt="Logo" className="h-10" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <div key={link.name} className="relative">
                {link.sub ? (
                  <>
                    <button
                      onClick={() => setOpenMenu(openMenu === i ? null : i)}
                      className="flex items-center gap-1 font-medium text-gray-800 hover:text-indigo-600 transition"
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openMenu === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openMenu === i && (
                      <div className="absolute top-full left-0 mt-3">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-52">
                          {link.sub.map((sublink) => (
                            <Link
                              key={sublink.name}
                              to={sublink.to}
                              onClick={closeAll}
                              className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                            >
                              {sublink.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to!}
                    onClick={closeAll}
                    className="font-medium text-gray-800 hover:text-indigo-600 transition relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="w-5 h-5" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openProfile ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-3">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-52 py-2">
                      {(user?.role === "ADMIN" ||
                        user?.role === "PROFESSOR") && (
                        <Link
                          to="/dashboard"
                          onClick={closeAll}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-indigo-50 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/portal"
                        onClick={closeAll}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-indigo-50 transition"
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeAll();
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/inscripciones"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md transition"
                >
                  Inscripciones
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <Menu />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-[85%] bg-white shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <img src={logo} className="h-9" />
              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="flex-1 space-y-6">
              {NAV_LINKS.map((l) => (
                <div key={l.name}>
                  <Link
                    to={l.to || "#"}
                    onClick={closeAll}
                    className="block text-lg font-semibold text-gray-800"
                  >
                    {l.name}
                  </Link>
                  {l.sub && (
                    <div className="ml-4 mt-2 space-y-2">
                      {l.sub.map((s) => (
                        <Link
                          key={s.name}
                          to={s.to}
                          onClick={closeAll}
                          className="block text-gray-600"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="border-t pt-6 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    closeAll();
                  }}
                  className="w-full py-3 text-red-600 font-medium"
                >
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeAll}
                    className="block text-center py-3 border rounded-xl"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/inscripciones"
                    onClick={closeAll}
                    className="block text-center py-3 bg-indigo-600 text-white rounded-xl"
                  >
                    Inscripciones
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
