import { useParams } from "react-router-dom";
import { AllDegrees } from "../../assets/AllDegrees/AllDegrees";

export const DisplayDegree = () => {
  const { careerId } = useParams();
  const career = AllDegrees.find((item) => item.id === Number(careerId));

  if (!career) {
    return <div>Career not found</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-12 mb-20">
        <div className="w-full relative">
          <img
            className="w-full h-[300px] object-cover brightness-[80%]"
            src={career.image}
            alt={career.name}
          />
          <h1 className="absolute bottom-5 left-5 text-[50px] text-white font-bold">
            {career.name}
          </h1>
        </div>
        <hr />
        <div className="flex flex-col px-10 gap-10 ">
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl">
              Profesionales innovadores y comprometidos con el medio
            </h1>
            <p>
              Todas las asignaturas son teórico-prácticas, con regímenes
              específicos según el área a la que pertenezcan. En la mayoría de
              las materias los prácticos tienen asistencia obligatoria con un
              80%, más la aprobación de los mismos como requisitos para aprobar
              la cursada.
            </p>
          </div>
          <div className="flex w-full">
            <div className="flex flex-col gap-5 bg-slate-100 p-10 w-full">
              {(career.Type === "presencial" || career.Type === "virtual") && (
                <div>
                  <h1 className="font-bold text-lg">Titulo:</h1>
                  <p>{career.title}</p>
                </div>
              )}

              <hr className="border border-gray-300" />
              <div className="flex gap-16">
                <div>
                  <h1 className="font-bold text-lg">Duracion:</h1>
                  <p>{career.duration}</p>
                </div>
                <div>
                  <h1 className="font-bold text-lg">Modalidad:</h1>
                  <p>{career.Type}</p>
                </div>
              </div>
              <hr className="border border-gray-300" />
              <div>
                <h1 className="font-bold text-lg">Horarios:</h1>
                <p>{career.Time}</p>
              </div>
            </div>
            <div className="w-full">
              <img className="w-[500px] h-auto" src={career.image} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
