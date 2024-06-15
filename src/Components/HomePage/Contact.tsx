import students from "../../assets/students.webp";

export const Contact: React.FC = () => {
  return (
    <>
      <div className="flex w-full gap-10 justify-center py-10 md:px-20 px-5 min-h-screen">
        <div className="w-full hidden md:block flex-grow">
          <img
            className="shadow-2xl w-full h-full object-cover"
            src={students}
            alt="students"
          />
        </div>

        <div className="shadow-2xl md:px-10 px-5 py-10 md:w-3/5 border-t-4 border-indigo-600">
          <form className="flex flex-col gap-5" action="">
            <div className="flex gap-2 items-center justify-center">
              <h1 className="text-2xl text-center font-bold">
                ¿NECESITAS INFORMACIÓN?
              </h1>
            </div>
            <p className="text-center">
              Completá tus datos y un asesor se comunicará en breve para
              ayudarte.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                className="w-full border border-gray-400 rounded p-3"
                type="text"
                placeholder="NOMBRE"
              />
              <input
                className="w-full border border-gray-400 rounded p-3"
                type="text"
                placeholder="APELLIDO"
              />
            </div>
            <input
              className="w-full border border-gray-400 rounded p-3"
              type="text"
              placeholder="CORREO ELECTRONICO"
            />
            <input
              className="w-full border border-gray-400 rounded p-3"
              type="text"
              placeholder="TELEFONO"
            />
            <select
              className="w-full border border-gray-400 text-gray-400 p-3 rounded"
              id="horario"
              name="HORARIO DE CONTACTO"
            >
              <option value="HORARIO DE CONTACTO ">HORARIO DE CONTACTO</option>
              <option value="09:00 Hs">09:00 Hs</option>
              <option value="11:00 Hs">11:00 Hs</option>
              <option value="13:00 Hs">13:00 Hs</option>
              <option value="15:00 Hs">15:00 Hs</option>
              <option value="17:00 Hs">17:00 Hs</option>
              <option value="19:00 Hs">19:00 Hs</option>
              <option value="21:00 Hs">21:00 Hs</option>
            </select>

            <select
              className="w-full border border-gray-400 p-3 text-gray-400 rounded"
              id="provincia"
              name="PROVINCIA"
            >
              <option value="PROVINCIA ">PROVINCIA</option>
              <option value="Buenos Aires">Buenos Aires</option>
              <option value="Santa Fe">Santa Fe</option>
              <option value="Chaco">Chaco</option>
              <option value="Chubut">Chubut</option>
              <option value="Misiones">Misiones</option>
              <option value="Corrientes">Corrientes</option>
              <option value="Entre Ríos">Entre Ríos</option>
              <option value="Formosa">Formosa</option>
              <option value="Jujuy">Jujuy</option>
              <option value="La Pampa">La Pampa</option>
            </select>
            <div className="flex flex-col md:flex-row gap-4">
              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="TIPO DE CARRERAS"
                name="TIPO DE CARRERAS"
              >
                <option value="TIPO DE CARRERAS ">TIPO DE CARRERAS</option>
                <option value="Carreras Cortas">Carreras Cortas</option>
                <option value="Carreras de Grado">Carreras de Grado</option>
                <option value="Carreras de Posgrado">
                  Carreras de Posgrado
                </option>
                <option value="Cursos y Diplamayas">
                  Cursos y Diplamaturas
                </option>
                <option value="Educacion Básica y Media">
                  Educacion Básica y Media
                </option>
              </select>
              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="CARRERA"
                name="CARRERA"
              >
                <option value="CARRERA ">CARRERA</option>
                <option value="Undefined">Undefined</option>
                <option value="Undefined">Undefined</option>
                <option value="Undefined">Undefined</option>
                <option value="Undefined">Undefined</option>
                <option value="Undefined">Undefined</option>
                <option value="Undefined">Undefined</option>
                <option value="Undefined">Undefined</option>
              </select>
            </div>
            <select
              className="w-full border border-gray-400 p-3 text-gray-400 rounded"
              id="MODALIDAD"
              name="MODALIDAD"
            >
              <option value="MODALIDAD ">MODALIDAD</option>
              <option value="Undefined">Undefined</option>
              <option value="Undefined">Undefined</option>
              <option value="Undefined">Undefined</option>
              <option value="Undefined">Undefined</option>
              <option value="Undefined">Undefined</option>
              <option value="Undefined">Undefined</option>
              <option value="Undefined">Undefined</option>
            </select>

            <button className="w-full bg-gradient-to-tr to-blue-700 from-indigo-900 text-white shadow-2xl p-4 rounded">
              SOLICITAR INFORMACIÓN
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
