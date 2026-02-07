import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const ValidateAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No se proporcionó un token de validación.");
        return;
      }

      try {
        // Use the token as an access token to get user info
        const { data, error } = await supabase.auth.getUser(token);

        if (error) {
          setStatus("error");
          setMessage(error.message || "Token inválido o expirado.");
        } else if (data.user) {
          // Update user status to approved in database
          const { error: updateError } = await supabase
            .from("users")
            .update({ status: "APROBADO" })
            .eq("id", data.user.id);

          if (updateError) {
            setStatus("error");
            setMessage("Error al actualizar el estado de la cuenta.");
          } else {
            setStatus("success");
            setMessage("¡Cuenta validada exitosamente!");
          }
        } else {
          setStatus("error");
          setMessage("No se pudo validar el token.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("No se pudo validar el token.");
      }
    };

    validateToken();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center"
      >
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Validando tu cuenta</h2>
            <p className="text-gray-600 mt-2">Por favor espera un momento...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">¡Correo Validado!</h2>
            <p className="text-gray-600 mt-2 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-8">
              Tu solicitud ahora está siendo revisada por nuestro equipo académico. 
              Te notificaremos por correo cuando sea aprobada.
            </p>
            <Link
              to="/login"
              className="flex items-center justify-center w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Ir al Inicio de Sesión
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Error de Validación</h2>
            <p className="text-gray-600 mt-2 mb-8">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
