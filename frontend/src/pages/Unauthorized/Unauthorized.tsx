import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Acceso Denegado</h1>
        <p className="text-lg text-gray-600">
          Lo sentimos, no tienes los permisos necesarios para acceder a esta sección.
        </p>
        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};
