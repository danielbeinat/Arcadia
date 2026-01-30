import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/User";
import {
  FiUser,
  FiMail,
  FiLock,
  FiUserPlus,
  FiBriefcase,
} from "react-icons/fi";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT" as UserRole,
    program: "",
    studentId: "",
    professorId: "",
    semester: 1,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        navigate("/portal");
      } else {
        setError("No se pudo completar el registro.");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error durante el registro.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white mb-4">
              <FiUser className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Crear Cuenta</h2>
            <p className="text-gray-500 mt-2"> Únete a nuestra comunidad</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white outline-none"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FiMail className="w-4 h-4" />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white outline-none"
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FiBriefcase className="w-4 h-4" />
                Tipo de Usuario
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white outline-none"
              >
                <option value="STUDENT">Estudiante</option>
                <option value="PROFESSOR">Profesor</option>
              </select>
            </div>

            {formData.role === "STUDENT" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      ID Estudiantil
                    </label>
                    <input
                      name="studentId"
                      type="text"
                      required
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 outline-none"
                      placeholder="EST-123"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Semestre
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                        <option key={s} value={s}>
                          {s}° Semestre
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Programa Académico
                  </label>
                  <input
                    name="program"
                    type="text"
                    required
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 outline-none"
                    placeholder="Ej: Ingeniería de Sistemas"
                  />
                </div>
              </>
            )}

            {formData.role === "PROFESSOR" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  ID de Profesor
                </label>
                <input
                  name="professorId"
                  type="text"
                  required
                  value={formData.professorId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 outline-none"
                  placeholder="PROF-123"
                />
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <FiLock className="w-4 h-4" />
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ¿Ya tienes una cuenta?{" "}
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
              onClick={() => window.scrollTo(0, 0)}
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
