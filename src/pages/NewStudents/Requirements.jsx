export const Requirements = () => {
  return (
    <>
      <div className="flex flex-col justify-center px-5 lg:px-20 mt-10 mb-20">
        <h1 className="text-3xl font-bold text-start">
          Requisitos de Inscripción
        </h1>
        <hr />

        <div className="mt-10">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h1 className="text-[17px] font-bold">
              Requisitos Académicos Obligatorios (RAO)
            </h1>
          </div>
          <p>
            Antes de inscribirte en cualquiera de las carreras de la FCEyN, es
            importante que cumplas con los siguientes Requisitos Académicos
            Obligatorios (RAO):
          </p>

          <div className="mt-5">
            <h2 className="text-[17px] font-bold">
              1. Título de Educación Secundaria
            </h2>
            <p>
              Para poder inscribirte en cualquiera de nuestras carreras,
              necesitas haber completado satisfactoriamente tu educación
              secundaria y contar con el título correspondiente. Este documento
              es fundamental para verificar tu elegibilidad académica.
            </p>
          </div>

          <div className="mt-5">
            <h2 className="text-[17px] font-bold">2. Documentación Oficial</h2>
            <p>
              Además del título de educación secundaria, deberás presentar
              documentación oficial que respalde tu identidad, como el documento
              nacional de identidad (DNI) o pasaporte. Esta documentación es
              necesaria para tu registro y para garantizar la veracidad de tus
              datos personales.
            </p>
          </div>

          <div className="mt-5">
            <h2 className="text-[17px] font-bold">
              3. Certificados de Cursos Preparatorios
            </h2>
            <p>
              Dependiendo de la carrera a la que desees inscribirte, es posible
              que necesites haber completado ciertos cursos preparatorios.
              Asegúrate de tener los certificados correspondientes antes de
              inscribirte. Estos cursos pueden variar desde matemáticas básicas
              hasta programas de introducción a ciencias específicas.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h1 className="text-[17px] font-bold">Otros Requisitos</h1>
          </div>
          <p>
            Además de los requisitos académicos obligatorios, puede haber otros
            requisitos específicos para algunas carreras o programas. Asegúrate
            de revisar la información detallada de la carrera a la que deseas
            inscribirte para conocer todos los requisitos adicionales, como
            pruebas de admisión, ensayos, entrevistas, entre otros.
          </p>
        </div>
      </div>
    </>
  );
};
