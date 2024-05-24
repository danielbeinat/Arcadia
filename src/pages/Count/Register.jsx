import { Link } from "react-router-dom";
export const Register = () => {
  return (
    <>
      <div className="flex min-h-full flex-col items-center justify-center py-5 sm:px-6 lg:px-8">
        <div className="flex min-h-full md:w-[400px] max-w-md shadow-2xl flex-1 rounded-xl flex-col justify-center mb-16 px-6 py-5 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700">
              Iniciar sesion
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nombre
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none px-3  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none px-3  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contraseña
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-black hover:text-gray-500"
                    >
                      olvidaste tu contraseña?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full bg-gray-100 rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 outline-none px-3  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Iniciar Sesion
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              tienes cuenta?
              <Link
                to="/login"
                className="font-semibold px-1 leading-6 text-black hover:text-gray-500"
                onClick={() => window.scrollTo(0, 0)}
              >
                Iniciar Sesion
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
