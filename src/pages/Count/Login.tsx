import { Link } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500  mb-4">
              <FiLogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Bienvenido de nuevo
            </h2>
            <p className="text-gray-500 mt-2">Ingresa a tu cuenta</p>
          </div>

          <form className="space-y-6" action="#" method="POST">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FiMail className="w-4 h-4" />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white outline-none"
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <FiLock className="w-4 h-4" />
                  Contraseña
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FiLogIn className="w-5 h-5" />
              Iniciar Sesión
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
              onClick={() => window.scrollTo(0, 0)}
            >
              Registrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
