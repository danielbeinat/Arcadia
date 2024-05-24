export const Info = () => {
  return (
    <>
      <div className="flex flex-col px-5 justify-center lg:px-20 mt-10 mb-20">
        <h1 className="text-3xl font-bold text-start">Ingresantes</h1>
        <hr />

        <div className="mt-10">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h1 className="text-[17px] font-bold">
              Requisitos Académicos Obligatorios (RAO)
            </h1>
          </div>
          <p>
            Quienes ingresen a cualquiera de las carreras de la FCEyN y hayan
            completado los requerimientos administrativos deberán acreditar,
            previo a cursar las asignaturas correspondientes a sus Planes de
            Estudio, los dos Requisitos Académicos Obligatorios (RAO):
            Introducción a la Matemática -IAM- y el Taller “Leer y Pensar la
            Ciencia” -TLPC-. Además, habrá 2 reuniones del Taller de
            Introducción a la Vida Universitaria -TIVU-, de carácter no
            obligatorio. Estos RAO son idénticos para cualquiera de las 9
            carreras de la FCEyN. Ante cualquier duda sobre estas carreras,
            pueden ingresar a la Sección Estudiantes. A continuación se puede
            encontrar la información de cada actividad: fechas, inscripciones,
            contenidos, etc.
          </p>
        </div>

        <div className="mt-8">
          <div className="flex justify-start bg-gray-200 p-5 mb-5 ">
            <h1 className="text-[17px] font-bold">
              Introducción a la Matemática (IAM)
            </h1>
          </div>
          <p>
            El curso Introducción a la Matemática se dictará en 2 ediciones que
            son equivalentes entre sí, por lo que solo deberá aprobarse una de
            ellas. Además, se desarrolló una instancia nivelatoria con clases de
            explicación de temas y consultas. Recordamos que la aprobación de
            este requisito es obligatoria para continuar con las asignaturas
            específicas de cada carrera (es decir, la aprobación de la instancia
            de IAM de febrero-marzo habilita la continuidad de las asignaturas
            en la primera mitad del año, mientras que la aprobación de la
            instancia de abril-julio lo hace para la segunda mitad del año).
          </p>
        </div>
        <div className="mt-8">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h1 className="text-[17px] font-bold">
              Herramientas Digitales (HD)
            </h1>
          </div>
          <p>
            El curso Herramientas Digitales está diseñado para proporcionar a
            los estudiantes las habilidades necesarias en el uso de tecnologías
            digitales que serán fundamentales en su vida académica y
            profesional. Este curso cubre temas como el manejo de software de
            ofimática, herramientas de comunicación en línea, y uso seguro de
            Internet. La aprobación de este curso es obligatoria para todos los
            ingresantes y se ofrece en formato virtual para mayor flexibilidad.
          </p>
        </div>
      </div>
    </>
  );
};
