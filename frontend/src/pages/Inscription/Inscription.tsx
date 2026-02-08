import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
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
  Loader2,
  AlertCircle,
  Upload,
  File,
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
} from "lucide-react";
import { NormalizedDegrees } from "../../assets/AllDegrees/AllDegrees";
import { useAuth } from "../../hooks/useAuth";

export const Inscription: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, register: authRegister } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const programsByArea = React.useMemo(() => {
    const areaNames: Record<string, string> = {
      informatica: "Informática",
      economicas: "Económicas",
      ingenieria: "Ingeniería",
      psicologia: "Psicología",
      "bellas-artes": "Bellas Artes",
    };

    return NormalizedDegrees.reduce(
      (acc, degree) => {
        const cat = degree.category;
        const area =
          areaNames[cat] ||
          cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ");

        if (!acc[area]) {
          acc[area] = [];
        }
        if (!acc[area].includes(degree.name)) {
          acc[area].push(degree.name);
        }
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }, []);

  useEffect(() => {
    if (location.state) {
      const { degree, program, programType } = location.state as {
        degree?: string;
        program?: string;
        programType?: string;
      };

      const areaNames: Record<string, string> = {
        informatica: "Informática",
        economicas: "Económicas",
        ingenieria: "Ingeniería",
        psicologia: "Psicología",
        "bellas-artes": "Bellas Artes",
      };

      const normalizedDegree = degree?.toLowerCase().replace(/\s+/g, "-") || "";
      const displayDegree =
        areaNames[normalizedDegree] ||
        (degree
          ? degree.charAt(0).toUpperCase() + degree.slice(1).replace("-", " ")
          : "");

      setFormData((prev) => ({
        ...prev,
        degree: displayDegree || prev.degree,
        program: program || prev.program,
        programType: programType || prev.programType,
      }));
    }
  }, [location.state]);

  if (user) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Ya eres parte de AcademiaNova!
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Ya tienes una cuenta activa y estás registrado en nuestro sistema.
            No es necesario completar el formulario de inscripción nuevamente.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              Ir a mi Panel de Control
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-white text-gray-600 py-3 px-6 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Tus datos", icon: User },
    { number: 2, title: "Solicitud", icon: FileText },
    { number: 3, title: "Reserva", icon: CreditCard },
    { number: 4, title: "Confirmación", icon: Check },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (error) setError(null);

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "dni" | "degree",
  ) => {
    const file = e.target.files?.[0] || null;

    if (file && file.size > 5 * 1024 * 1024) {
      setError(
        `El archivo ${type === "dni" ? "del DNI" : "del título"} es demasiado grande. El máximo permitido es 5MB.`,
      );
      e.target.value = "";
      return;
    }

    if (type === "dni") {
      setDniFile(file);
    } else {
      setDegreeFile(file);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentStep === 1) {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
        "country",
        "docType",
        "docNumber",
        "nationality",
        "phonePrefix",
        "phoneNumber",
      ];

      const emptyFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData],
      );
      if (emptyFields.length > 0) {
        setError("Por favor completa todos los campos obligatorios.");
        return;
      }

      const allowedDomains = ["gmail.com", "outlook.com", "hotmail.com"];
      const emailDomain = formData.email.split("@")[1]?.toLowerCase();
      if (!allowedDomains.includes(emailDomain)) {
        setError(
          "El correo debe ser una dirección de Gmail, Outlook o Hotmail.",
        );
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setError(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
        );
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      if (formData.docType === "DNI" && !/^\d{8}$/.test(formData.docNumber)) {
        setError("El número de DNI debe ser de exactamente 8 dígitos.");
        return;
      }

      // Validar si el email ya existe
      const checkEmailExists = async () => {
        try {
          // Para usuarios no autenticados, usamos una función RPC o permitimos lectura pública
          const { data, error } = await supabase
            .from("users")
            .select("email")
            .eq("email", formData.email);
          
          if (error && error.code === '401') {
            // Si no hay permisos, permitimos continuar (validación al final)
            console.log("No se puede validar email ahora, se validará al final");
            return true;
          }
          
          if (data && data.length > 0) {
            setError("Este email ya está registrado. Por favor usa otro email.");
            return false;
          }
          return true;
        } catch (err) {
          // Si hay cualquier error, permitimos continuar
          console.log("Error en validación de email, continuando:", err);
          return true;
        }
      };

      // Esperar validación de email antes de continuar
      const emailValid = await checkEmailExists();
      if (!emailValid) return;
    }

    if (currentStep < 3) {
      setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit(e);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!dniFile || !degreeFile) {
        throw new Error("Por favor sube todos los documentos requeridos.");
      }

      const { inscriptionSchema } = await import("../../lib/validation");
      const result = inscriptionSchema.safeParse({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        program: formData.program || "Sin programa",
      });
      if (!result.success) {
        const msg = result.error.errors[0]?.message ?? "Revisa los datos del formulario";
        throw new Error(msg);
      }

      const formDataToSend = new FormData();

      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("name", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("role", "STUDENT");

      formDataToSend.append("country", formData.country);
      formDataToSend.append("docType", formData.docType);
      formDataToSend.append("docNumber", formData.docNumber);
      formDataToSend.append("nationality", formData.nationality);
      formDataToSend.append("phoneType", formData.phoneType);
      formDataToSend.append("phonePrefix", formData.phonePrefix);
      formDataToSend.append("phoneArea", formData.phoneArea);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("degree", formData.degree);
      formDataToSend.append("programType", formData.programType);
      formDataToSend.append("program", formData.program || "Sin programa");
      formDataToSend.append("startPeriod", formData.startPeriod);

      if (dniFile) formDataToSend.append("dniUrl", dniFile);
      if (degreeFile) formDataToSend.append("degreeUrl", degreeFile);

      const success = await authRegister(formDataToSend);

      if (!success) {
        throw new Error(
          "No se pudo completar el registro. Por favor intenta de nuevo.",
        );
      }

      setCompletedSteps((prev) => [...new Set([...prev, 3])]);
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        window.scrollTo(0, 0);
        navigate("/portal");
      }, 5000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar la inscripción";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
              const isCompleted =
                completedSteps.includes(step.number) ||
                currentStep > step.number;

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
        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-8 md:p-12 text-center mb-12"
          >
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Ya estás registrado en Arcadia!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Hola <strong>{user.name}</strong>, detectamos que ya tienes una
              cuenta activa en nuestra plataforma. No es necesario completar el
              formulario de inscripción nuevamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/portal");
                }}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                Ir a mi Portal
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {!user && error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {!user && currentStep === 4 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Inscripción Recibida!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Tu solicitud ha sido registrada correctamente. Hemos enviado un
              correo electrónico de validación a{" "}
              <strong>{formData.email}</strong>. Por favor, verifica tu bandeja
              de entrada para continuar con el proceso.
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Redirigiendo al inicio de sesión...</span>
              </div>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/login");
                }}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Ir al Login ahora
              </button>
            </div>
          </motion.div>
        ) : null}
        {!user && currentStep !== 4 && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
            onSubmit={handleNextStep}
          >
            {currentStep === 1 && (
              <>
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
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                            error &&
                            error.includes("campos obligatorios") &&
                            !formData.firstName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
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
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                            error &&
                            error.includes("campos obligatorios") &&
                            !formData.lastName
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                          placeholder="Ingresa tu apellido"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Correo Electrónico{" "}
                        <span className="text-red-500">*</span>
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
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                            error && error.includes("correo")
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                          placeholder="ejemplo@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Contraseña <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                            error && error.includes("contraseña")
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                          placeholder="Crea una contraseña"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Confirmar Contraseña{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                            error && error.includes("coinciden")
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                          placeholder="Repite tu contraseña"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
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
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none appearance-none bg-white ${
                            error &&
                            error.includes("obligatorios") &&
                            !formData.country
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
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
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none appearance-none bg-white ${
                            error &&
                            error.includes("obligatorios") &&
                            !formData.docType
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
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
                      <div className="relative">
                        <FileText
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          name="docNumber"
                          value={formData.docNumber}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                            error &&
                            (error.includes("DNI") ||
                              (error.includes("obligatorios") &&
                                !formData.docNumber))
                              ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                          }`}
                          placeholder="12345678"
                          required
                        />
                      </div>
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
                        className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                          error &&
                          error.includes("obligatorios") &&
                          !formData.nationality
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                        }`}
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
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none bg-white ${
                          error &&
                          error.includes("obligatorios") &&
                          !formData.phonePrefix
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                        }`}
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
                        className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 transition-all outline-none ${
                          error &&
                          error.includes("obligatorios") &&
                          !formData.phoneNumber
                            ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                        }`}
                        placeholder="1234-5678"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
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
                      onChange={(e) => {
                        handleInputChange(e);
                        // Resetear programa cuando cambia el área
                        setFormData((prev) => ({ ...prev, program: "" }));
                      }}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                      required
                    >
                      <option value="">Selecciona un área</option>
                      {Object.keys(programsByArea)
                        .sort()
                        .map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Tipo de Programa (Online o Presencial) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Modalidad <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="programType"
                      value={formData.programType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                      required
                    >
                      <option value="">Selecciona modalidad</option>
                      <option value="presencial">🏫 Presencial</option>
                      <option value="virtual">💻 Online (Virtual)</option>
                    </select>
                  </div>

                  {/* Programa de Interés */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Programa de Interés{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none bg-white"
                      required
                      disabled={!formData.degree}
                    >
                      <option value="">
                        {!formData.degree
                          ? "Primero selecciona un área"
                          : "Selecciona programa"}
                      </option>
                      {formData.degree &&
                        programsByArea[formData.degree]?.map((prog) => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
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
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Documentación */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Upload size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Documentación Requerida
                      </h2>
                      <p className="text-sm text-gray-500">
                        Sube los documentos necesarios para validar tu
                        inscripción
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* DNI Upload */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Foto del DNI (Frente){" "}
                        <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-400 mt-1">
                          Formato aceptado: PNG
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/png"
                          onChange={(e) => handleFileChange(e, "dni")}
                          className="hidden"
                          id="dni-upload"
                          required
                        />
                        <label
                          htmlFor="dni-upload"
                          className={`
                            flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                            ${
                              dniFile
                                ? "border-green-400 bg-green-50"
                                : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30"
                            }
                          `}
                        >
                          {dniFile ? (
                            <div className="flex flex-col items-center text-green-600">
                              <Check className="w-10 h-10 mb-2" />
                              <span className="text-sm font-medium">
                                DNI Cargado
                              </span>
                              <span className="text-xs text-green-500 mt-1">
                                {dniFile.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-gray-400">
                              <Upload className="w-10 h-10 mb-2" />
                              <span className="text-sm font-medium">
                                Seleccionar PNG
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Degree Upload */}
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-gray-700">
                        Título o Certificado de Estudios{" "}
                        <span className="text-red-500">*</span>
                        <span className="block text-xs font-normal text-gray-400 mt-1">
                          Formato aceptado: PDF
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileChange(e, "degree")}
                          className="hidden"
                          id="degree-upload"
                          required
                        />
                        <label
                          htmlFor="degree-upload"
                          className={`
                            flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all
                            ${
                              degreeFile
                                ? "border-green-400 bg-green-50"
                                : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30"
                            }
                          `}
                        >
                          {degreeFile ? (
                            <div className="flex flex-col items-center text-green-600">
                              <File className="w-10 h-10 mb-2" />
                              <span className="text-sm font-medium">
                                Título Cargado
                              </span>
                              <span className="text-xs text-green-500 mt-1">
                                {degreeFile.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-gray-400">
                              <File className="w-10 h-10 mb-2" />
                              <span className="text-sm font-medium">
                                Seleccionar PDF
                              </span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pago de Matrícula (Informativo) */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <CreditCard size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Reserva de Vacante
                      </h2>
                      <p className="text-sm text-gray-500">
                        Completa tu inscripción con el pago de la matrícula
                      </p>
                    </div>
                  </div>

                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Módulo de Pago en Desarrollo
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Por el momento, puedes finalizar tu inscripción sin
                      realizar el pago. Nos pondremos en contacto contigo para
                      coordinar la matrícula.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full md:w-auto px-8 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  Atrás
                </button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group ml-auto ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === 3
                        ? "Finalizar Inscripción"
                        : "Siguiente"}
                    </span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};
