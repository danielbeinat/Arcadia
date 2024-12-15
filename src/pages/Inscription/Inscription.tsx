import React from "react";

export const Inscription: React.FC = () => {
  return (
    <>
      <div className="w-full md:py-10 md:px-28 py-5 px-5 bg-indigo-600 mt-5 flex items-center justify-start">
        <h1 className="text-2xl text-white font-bold">
          Formulario de inscripción
        </h1>
      </div>

      <div className="w-full py-10 md:px-28 px-5 flex mb-10 flex-col gap-5">
        <h1 className="md:text-[15px] text-[13px] md:w-5/6 font-bold text-gray-500">
          Estás muy cerca de formar parte de la comunidad de la Universidad de
          Arcadia. Completá el formulario para iniciar el proceso de
          inscripción, continuar formularios anteriores o realizar el pago de la
          matricula de inscripción.
        </h1>

        <div className="py-5">
          <div className="breadcrumb flat">
            <a className="active">1 .Tus datos</a>
            <a>2. Solicitud</a>
            <a>3. Reserva de vacante</a>
            <a>4. Gracias</a>
          </div>
        </div>

        <form className="flex flex-col gap-8 items-center md:items-start ">
          <div className="flex flex-col gap-5 md:w-[50%] w-full">
            <input
              className="border border-gray-400 text-gray-400 p-3 rounded"
              placeholder="*Nombre/s"
              type="text"
              required
            />
            <input
              className="border border-gray-400 text-gray-400 p-3 rounded"
              placeholder="*Apellido/s"
              type="text"
              required
            />
            <input
              className=" border border-gray-400 text-gray-400 p-3 rounded"
              placeholder="*E-mail"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col gap-5 md:w-[50%] w-full">
            <h1>Documento de Identidad</h1>
            <div className="flex flex-col md:flex-row gap-5">
              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO ">*País emisor</option>
                <option value="Argentina">Argentina</option>
                <option value="Brasil">Brasil</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Chile">Chile</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Colombia">Colombia</option>
                <option value="Perú">Perú</option>
              </select>

              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO ">*Tipo</option>
                <option value="Dni">Dni</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
              <input
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                placeholder="*Número"
                type="text"
                required
              />
            </div>
            <input
              className="border border-gray-400 text-gray-400 p-3 rounded"
              placeholder="*Nacionalidad"
              type="text"
              required
            />
          </div>

          <div className="flex flex-col gap-5 md:w-[50%] w-full">
            <h1>telefono</h1>
            <div className="flex flex-col md:flex-row gap-5">
              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO">Movil</option>
                <option value="fijo">Fijo</option>
              </select>

              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO ">*Prefijo</option>
                <option value="Argentina">Argentina</option>
                <option value="Brasil">Brasil</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Chile">Chile</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Colombia">Colombia</option>
                <option value="Perú">Perú</option>
              </select>

              <input
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                placeholder="Área"
                type="text"
                required
              />
              <input
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                placeholder="*Número"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 md:w-[50%] w-full">
            <h1>Seleccioná tu carrera o programa</h1>
            <div className="flex flex-col gap-5">
              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO ">Arquitectura</option>
                <option value="Analisis de sistemas">
                  Analisis de sistemas
                </option>
                <option value="Abogacia">Abogacia</option>
                <option value="Contabilidad">Contabilidad</option>
                <option value="Ingenieria">Ingenieria</option>
                <option value="Derecho">Derecho</option>
                <option value="Administracion">Administracion</option>
                <option value="Psicologia">Psicologia</option>
                <option value="Economia">Economia</option>
              </select>

              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO ">
                  *Tipo de carrera o programa
                </option>
                <option value="Carreras">Carreras</option>
                <option value="Carreras pregrado">Carreras pregrado</option>
                <option value="cursos">Cursos</option>
              </select>

              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO ">
                  *Carrera o programas de interés
                </option>
                <option value="Arquitectura">Arquitectura</option>
                <option value="Administracion">Administracion</option>
                <option value="Contabilidad">Contabilidad</option>
                <option value="Ingenieria">Ingenieria</option>
                <option value="Derecho">Derecho</option>
                <option value="Abogacia">Abogacia</option>
              </select>

              <select
                className="w-full border border-gray-400 text-gray-400 p-3 rounded"
                id="horario"
                name="HORARIO DE CONTACTO"
              >
                <option value="HORARIO DE CONTACTO ">
                  *Período de comienzo de clases
                </option>
                <option value="abril">Abril</option>
                <option value="mayo">Mayo</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-5 md:w-[50%] w-full">
            <button className="bg-indigo-600 text-white p-3 rounded">
              Enviar y Continuar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
