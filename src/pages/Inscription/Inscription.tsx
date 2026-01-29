import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  GraduationCap,
  Calendar,
  Globe,
  FileText,
  ArrowRight,
  Check,
  MapPin,
} from "lucide-react";

export const Inscription: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    docType: "",
    docNumber: "",
    nationality: "",
    phoneType: "movil",
    phonePrefix: "",
    phoneArea: "",
    phoneNumber: "",
    degree: "",
    programType: "",
    program: "",
    startPeriod: "",
  });

  const steps = [
    { number: 1, title: "Tus datos", icon: User },
    { number: 2, title: "Solicitud", icon: FileText },
    { number: 3, title: "Reserva", icon: CreditCard },
    { number: 4, title: "Confirmación", icon: Check },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-4 border border-white/20">
              <GraduationCap size={18} />
              Universidad de Arcadia
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Formulario de Inscripción
            </h1>
            <p className="text-lg text-indigo-100 max-w-3xl">
              Estás muy cerca de formar parte de nuestra comunidad. Completa el
              formulario para iniciar tu proceso de inscripción.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300
                        ${
                          isActive
                            ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg scale-110"
                            : isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-gray-400"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check size={24} className="animate-bounce" />
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>
                    <div className="text-center hidden sm:block">
                      <p
                        className={`text-xs font-semibold ${
                          isActive
                            ? "text-indigo-600"
                            : isCompleted
                              ? "text-green-600"
                              : "text-gray-400"
                        }`}
                      >
                        Paso {step.number}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </motion.div>

                  {index < steps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 relative">
                      <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: isCompleted ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                      ></motion.div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Datos Personales */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Datos Personales
                </h2>
                <p className="text-sm text-gray-500">
                  Información básica de contacto
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nombre/s <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Apellido/s <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="Ingresa tu apellido"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="ejemplo@email.com"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documento de Identidad */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Documento de Identidad
                </h2>
                <p className="text-sm text-gray-500">
                  Información de identificación
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* País Emisor */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  País Emisor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none appearance-none bg-white"
                    required
                  >
                    <option value="">Selecciona</option>
                    <option value="Argentina">🇦🇷 Argentina</option>
                    <option value="Brasil">🇧🇷 Brasil</option>
                    <option value="Uruguay">🇺🇾 Uruguay</option>
                    <option value="Chile">🇨🇱 Chile</option>
                    <option value="Paraguay">🇵🇾 Paraguay</option>
                    <option value="Colombia">🇨🇴 Colombia</option>
                    <option value="Perú">🇵🇪 Perú</option>
                  </select>
                </div>
              </div>

              {/* Tipo de Documento */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    name="docType"
                    value={formData.docType}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none appearance-none bg-white"
                    required
                  >
                    <option value="">Selecciona</option>
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
              </div>

              {/* Número */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="docNumber"
                  value={formData.docNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  placeholder="12345678"
                  required
                />
              </div>
            </div>

            {/* Nacionalidad */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nacionalidad <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  placeholder="Argentina"
                  required
                />
              </div>
            </div>
          </div>

          {/* Teléfono */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Teléfono de Contacto
                </h2>
                <p className="text-sm text-gray-500">
                  ¿Cómo podemos comunicarnos contigo?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tipo
                </label>
                <select
                  name="phoneType"
                  value={formData.phoneType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                >
                  <option value="movil">📱 Móvil</option>
                  <option value="fijo">☎️ Fijo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Prefijo <span className="text-red-500">*</span>
                </label>
                <select
                  name="phonePrefix"
                  value={formData.phonePrefix}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                  required
                >
                  <option value="">Código</option>
                  <option value="+54">+54 AR</option>
                  <option value="+55">+55 BR</option>
                  <option value="+598">+598 UY</option>
                  <option value="+56">+56 CL</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Área
                </label>
                <input
                  type="text"
                  name="phoneArea"
                  value={formData.phoneArea}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  placeholder="11"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Número <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  placeholder="1234-5678"
                  required
                />
              </div>
            </div>
          </div>

          {/* Carrera o Programa */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Carrera o Programa
                </h2>
                <p className="text-sm text-gray-500">
                  ¿Qué te gustaría estudiar?
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Área de Estudio */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Área de Estudio <span className="text-red-500">*</span>
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                  required
                >
                  <option value="">Selecciona un área</option>
                  <option value="Arquitectura">🏛️ Arquitectura</option>
                  <option value="Sistemas">💻 Análisis de Sistemas</option>
                  <option value="Derecho">⚖️ Derecho</option>
                  <option value="Contabilidad">📊 Contabilidad</option>
                  <option value="Ingenieria">⚙️ Ingeniería</option>
                  <option value="Administracion">📈 Administración</option>
                  <option value="Psicologia">🧠 Psicología</option>
                  <option value="Economia">💰 Economía</option>
                </select>
              </div>

              {/* Tipo de Programa */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tipo de Programa <span className="text-red-500">*</span>
                </label>
                <select
                  name="programType"
                  value={formData.programType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                  required
                >
                  <option value="">Selecciona tipo</option>
                  <option value="Carreras">Carrera de Grado</option>
                  <option value="Pregrado">Carrera de Pregrado</option>
                  <option value="Cursos">Curso/Diplomatura</option>
                </select>
              </div>

              {/* Programa de Interés */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Programa de Interés <span className="text-red-500">*</span>
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                  required
                >
                  <option value="">Selecciona programa</option>
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Administracion">Administración</option>
                  <option value="Contabilidad">Contabilidad</option>
                  <option value="Ingenieria">Ingeniería</option>
                  <option value="Derecho">Derecho</option>
                  <option value="Abogacia">Abogacía</option>
                </select>
              </div>

              {/* Período de Inicio */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Período de Inicio <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    name="startPeriod"
                    value={formData.startPeriod}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                    required
                  >
                    <option value="">Selecciona período</option>
                    <option value="Abril">📅 Abril 2024</option>
                    <option value="Mayo">📅 Mayo 2024</option>
                    <option value="Junio">📅 Junio 2024</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span>Enviar y Continuar</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};
