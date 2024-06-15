import React from "react";
import { FaRegClock } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { IoMailOutline } from "react-icons/io5";

export const Map: React.FC = () => {
  return (
    <React.Fragment>
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
          <div className="max-w-2xl lg:max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              SEDES Y PUNTOS DE ARCADIA
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Encontrá tu sede o punto Arcadia
            </p>
          </div>
          <div className="mt-16 lg:mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.779308127539!2d-58.38155998417005!3d-34.60368418045968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacf0501fa9f%3A0x29ae95d5a4d4748c!2sObelisco%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1620138277034!5m2!1sen!2sar"
                  width="100%"
                  height="480"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Location Map"
                ></iframe>
              </div>
              <div>
                <div className="max-w-full mx-auto rounded-lg overflow-hidden">
                  <div className="px-6 py-4 flex flex-col gap-1 ">
                    <h3 className="text-lg font-medium text-gray-900">
                      Nuestra sede principal
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
                        <LuMapPin className="text-xl bg-gray-700 rounded-full text-white" />
                      </div>
                      <p className="mt-1 text-gray-600">
                        Buenos Aires - CABA - Av. Santa Fe 123{" "}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 flex flex-col gap-2 px-6 py-6">
                    <h3 className="text-lg font-medium text-gray-900 ">
                      Horarios
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
                        <FaRegClock className="text-xl bg-gray-700 text-white" />
                      </div>
                      <p className="mt-1 text-gray-600">
                        Lunes a Viernes: 8am - 20:30pm
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
                        <FaRegClock className="inline text-xl bg-gray-700 text-white" />
                      </div>
                      <p className="mt-1 text-gray-600">Sábado: 10am - 4pm</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 flex flex-col gap-2 px-6 py-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Contacto
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
                        <IoMailOutline className="inline  text-xl bg-gray-700 text-white" />
                      </div>
                      <p className="mt-1 text-gray-600">
                        Email: Arcadia@gmail.com
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-gray-700 p-1 rounded-full">
                        <FaWhatsapp className="inline  text-xl bg-gray-700  text-white" />
                      </div>
                      <p className="mt-1 text-gray-600">
                        Teléfono: +54 11 1234 5678
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};
