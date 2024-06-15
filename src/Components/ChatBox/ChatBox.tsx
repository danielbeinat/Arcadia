import { useState } from "react";
import { BsChatFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

export const ChatBox: React.FC = () => {
  const [Show, setShow] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setShow(!Show)}
        className="fixed md:bottom-8 bottom-4 right-3 md:right-5 z-50 bg-blue-700 p-4 shadow-2xl rounded-full p-2"
      >
        {Show ? (
          <IoMdClose className="text-3xl text-white " />
        ) : (
          <BsChatFill className="text-3xl text-white " />
        )}
      </button>

      {Show && (
        <div className="fixed md:bottom-24 md:right-8 bottom-0 right-0 z-50  bg-white shadow-2xl md:rounded-xl md:h-auto w-full h-full mx-auto md:w-96 ">
          <div className="flex items-center justify-between md:rounded-t-xl p-4 bg-blue-700">
            <h1 className="text-sm text-white font-bold">
              Informes e Inscripción - Instituto Arcadia
            </h1>
            <button onClick={() => setShow(!Show)}>
              <IoMdClose className="text-3xl text-white" />
            </button>
          </div>

          <div className="p-4 pb-10 flex flex-col items-center justify-center gap-4">
            <h1 className="text-center font-bold text-gray-500">
              Por favor completá este formulario para empezar a charlar con el
              próximo agente disponible.
            </h1>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col border border-gray-300 rounded px-4 py-8 gap-4"
              action=""
            >
              <input
                placeholder="Nombre"
                className="border md:w-80 w-64 border-gray-300 px-2 py-3 rounded"
                type="text"
              />
              <input
                placeholder="Email"
                className="border border-gray-300 px-2 py-3 rounded"
                type="text"
              />
              <input
                placeholder="Asunto"
                className="border border-gray-300 px-2 py-3 rounded"
                type="text"
              />

              <button className="bg-blue-700 text-white p-2 rounded">
                Iniciar Chat
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
