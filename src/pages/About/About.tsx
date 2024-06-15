export const About: React.FC = () => {
  return (
    <>
      <div className="flex flex-col justify-center md:px-20 px-5 mt-10 mb-20">
        <h1 className="text-3xl font-bold text-start">Acerca de Nosotros</h1>
        <hr />

        <div className="mt-10">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h2 className="text-xl font-bold">Misión</h2>
          </div>
          <p>
            Nuestra misión es proporcionar una educación de calidad, basada en
            la excelencia académica y la investigación innovadora, para formar
            profesionales capaces de enfrentar los desafíos del mundo actual y
            contribuir al desarrollo de la sociedad.
          </p>
          <p>
            Para lograr nuestra misión, nos comprometemos a brindar programas
            académicos rigurosos que promuevan el pensamiento crítico, la
            creatividad y el trabajo en equipo. Además, fomentamos valores
            éticos y morales que guíen el comportamiento de nuestros estudiantes
            tanto en su vida profesional como personal.
          </p>
        </div>

        <div className="mt-5">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h2 className="text-xl font-bold">Visión</h2>
          </div>
          <p>
            Nuestra visión es ser una institución líder a nivel nacional e
            internacional en la formación de profesionales en diversas
            disciplinas científicas, tecnológicas y humanísticas, reconocida por
            su excelencia académica, investigación de vanguardia y contribución
            al progreso de la sociedad.
          </p>
          <p>
            Aspiramos a crear un entorno académico dinámico que promueva la
            innovación y la colaboración entre estudiantes, profesores y la
            comunidad en general. Buscamos ser un referente en la generación de
            conocimiento que aborde los desafíos globales y contribuya a la
            mejora de la calidad de vida de las personas.
          </p>
        </div>

        <div className="mt-5">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h2 className="text-xl font-bold">Valores</h2>
          </div>
          <ul className="list-disc list-inside">
            <li>
              <strong>Excelencia académica:</strong> Buscamos la excelencia en
              todo lo que hacemos, desde la enseñanza hasta la investigación y
              la prestación de servicios a la comunidad.
            </li>
            <li>
              <strong>Integridad:</strong> Actuamos con honestidad,
              transparencia y responsabilidad en todas nuestras actividades.
            </li>
            <li>
              <strong>Respeto:</strong> Valoramos la diversidad, promovemos un
              ambiente inclusivo y respetamos los derechos y opiniones de los
              demás.
            </li>
            <li>
              <strong>Innovación:</strong> Fomentamos la creatividad y la
              búsqueda constante de nuevas soluciones para los desafíos del
              mundo actual.
            </li>
            <li>
              <strong>Responsabilidad social:</strong> Nos comprometemos a
              contribuir al desarrollo sostenible de la sociedad y a actuar de
              manera ética y responsable en todas nuestras acciones.
            </li>
            <li>
              <strong>Colaboración:</strong> Promovemos el trabajo en equipo y
              la colaboración entre estudiantes, profesores, instituciones y la
              sociedad en general para lograr objetivos comunes.
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <div className="flex justify-start bg-gray-200 p-5 mb-5">
            <h2 className="text-xl font-bold">Historia</h2>
          </div>
          <p>
            Nuestra universidad fue fundada en 2010 con el objetivo de formar
            profesionales capaces de enfrentar los desafíos. Desde entonces,
            hemos crecido y nos hemos consolidado como una institución de
            prestigio, comprometida con la formación integral de nuestros
            estudiantes y el avance del conocimiento a través de la
            investigación.
          </p>
          <p>
            A lo largo de los años, hemos ampliado nuestra oferta académica,
            modernizado nuestras instalaciones y fortalecido nuestras alianzas
            con otras instituciones y empresas. Nuestros egresados ocupan
            posiciones destacadas en diversos campos profesionales y contribuyen
            de manera significativa al desarrollo económico, social y cultural
            del país.
          </p>
        </div>
      </div>
    </>
  );
};
