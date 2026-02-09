import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

import {
  User,
  BookOpen,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  Bell,
  LogOut,
  Settings,
  FileText,
  CreditCard,
  Target,
  Users,
  ShieldAlert,
  Info,
  CheckCircle,
  AlertCircle,
  Mail,
  GraduationCap,
  MapPin,
  Trophy,
  Loader2,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import { useEvents } from "../../hooks/useEvents";

import { useNotifications } from "../../Components/Notifications/NotificationSystem";

import type { User as UserType } from "../../types/User";

import api from "../../services/api";

import { AllDegrees } from "../../assets/AllDegrees/AllDegrees";

import { DocumentModal } from "../../Components/DocumentViewer/DocumentModal";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const { getRegisteredEvents, getTodayEvents } = useEvents();

  const { addNotification } = useNotifications();

  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "courses"
    | "events"
    | "profile"
    | "admin"
    | "degree"
    | "subjects"
  >("overview");

  const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);

  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const [adminStats, setAdminStats] = useState<{
    total: number;

    students: number;

    professors: number;

    admins: number;

    active: number;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [roleFilter, setRoleFilter] = useState<"ALL" | "STUDENT" | "PROFESSOR">(
    "ALL",
  );

  const [documentModal, setDocumentModal] = useState<{
    title: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (activeTab === "admin" && user?.role === "ADMIN") {
      fetchAdminData();
    }
  }, [activeTab, user]);

  const fetchAdminData = async () => {
    setLoadingAdmin(true);

    try {
      const [users, stats] = await Promise.all([
        api.getPendingUsers(),

        api.getUserStats(),
      ]);

      setPendingUsers(users);

      setAdminStats(stats);
    } catch (error) {
      addNotification({
        type: "error",

        title: "Error de administración",

        message: "No se pudieron cargar los datos estadísticos",
      });
    } finally {
      setLoadingAdmin(false);
    }
  };

  const fetchPendingUsers = async () => {
    setLoadingAdmin(true);

    try {
      const users = await api.getPendingUsers();

      setPendingUsers(users);
    } catch (error) {
      addNotification({
        type: "error",

        title: "Error de carga",

        message: "No se pudieron cargar las solicitudes pendientes",
      });
    } finally {
      setLoadingAdmin(false);
    }
  };

  const filteredUsers = pendingUsers.filter((u) => {
    const matchesSearch = (u.name + " " + u.lastName + " " + u.email)

      .toLowerCase()

      .includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleApproveUser = async (userId: string) => {
    if (isProcessing) return;

    setIsProcessing(userId);

    try {
      await api.approveUser(userId);

      addNotification({
        type: "success",

        title: "Usuario aprobado",

        message: "El usuario ha sido activado correctamente",
      });

      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      addNotification({
        type: "error",

        title: "Error",

        message: "No se pudo aprobar al usuario",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas rechazar esta solicitud?"))
      return;

    if (isProcessing) return;

    setIsProcessing(userId);

    try {
      await api.rejectUser(userId);

      addNotification({
        type: "success",

        title: "Solicitud rechazada",

        message: "El usuario ha sido notificado del rechazo",
      });

      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      addNotification({
        type: "error",

        title: "Error",

        message: "No se pudo rechazar la solicitud",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const registeredEvents = getRegisteredEvents();

  const todayEvents = getTodayEvents();

  const handleLogout = () => {
    logout();
  };

  const formatGPA = (gpa?: number) => {
    return gpa ? gpa.toFixed(2) : "N/A";
  };

  const getProgressPercentage = (semester: number) => {
    const totalSemesters = 10;

    return (semester / totalSemesters) * 100;
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const isPending = user?.status === "PENDIENTE";

  const isActive = user?.status === "ACTIVO" || user?.status === "APROBADO";

  const isRejected = user?.status === "RECHAZADO";

  const renderStatusMessage = () => {
    if (isPending) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl mb-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">
                Tu solicitud está siendo revisada por nuestro equipo académico
              </h3>

              <p className="text-amber-800">
                Estamos validando tus datos. Una vez que tu solicitud sea
                aprobada, recibirás un correo electrónico de confirmación y
                podrás acceder a todo el contenido de tus cursos.
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 font-medium">
                <Info className="w-4 h-4" />

                <span>
                  Estado actual:{" "}
                  <span className="uppercase">{user?.status}</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (isActive) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl mb-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-green-900 mb-1">
                ¡Solicitud Aprobada!
              </h3>

              <p className="text-green-800">
                Bienvenido a la comunidad académica. Tu solicitud ha sido
                procesada con éxito y ya tienes acceso completo a todas las
                funcionalidades de la plataforma.
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-green-700 font-medium">
                <Info className="w-4 h-4" />

                <span>
                  Estado de cuenta:{" "}
                  <span className="uppercase font-bold">Activa</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (isRejected) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl mb-8 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-red-900 mb-1">
                Solicitud Rechazada
              </h3>

              <p className="text-red-800">
                Lo sentimos, tu solicitud de inscripción no ha sido aprobada en
                esta ocasión. Para más información sobre los motivos o para
                presentar una nueva solicitud, por favor contacta con el
                departamento de admisiones.
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-red-700 font-medium">
                <Mail className="w-4 h-4" />

                <span>Arcadia@gmail.com</span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {renderStatusMessage()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Info Card */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || "U"}

                {user?.lastName?.charAt(0) || "S"}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.name || "Usuario"} {user?.lastName || "Sin apellido"}
                </h2>

                <p className="text-gray-600">
                  {user?.program ||
                    (user?.role === "PROFESSOR"
                      ? "Cuerpo Docente"
                      : "Sin programa")}
                </p>

                <p className="text-sm text-gray-500">
                  ID:{" "}
                  {user?.role === "PROFESSOR"
                    ? user?.professorId || "En trámite"
                    : user?.studentId || "En trámite"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <BookOpen className="w-4 h-4" />

                <span className="text-sm font-medium">Semestre</span>
              </div>

              <p className="text-2xl font-bold text-blue-900">
                {user?.semester || 1}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Award className="w-4 h-4" />

                <span className="text-sm font-medium">Promedio</span>
              </div>

              <p className="text-2xl font-bold text-green-900">
                {formatGPA(user?.gpa)}
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <CreditCard className="w-4 h-4" />

                <span className="text-sm font-medium">Créditos</span>
              </div>

              <p className="text-2xl font-bold text-purple-900">
                {user?.credits || 0}
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <Target className="w-4 h-4" />

                <span className="text-sm font-medium">Progreso</span>
              </div>

              <p className="text-2xl font-bold text-orange-900">
                {Math.round(getProgressPercentage(user?.semester || 1))}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso académico</span>

              <span>{user?.semester || 1}/10 semestres</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${getProgressPercentage(user.semester || 1)}%`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => !isPending && setActiveTab("subjects")}
              disabled={isPending}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                isPending
                  ? "opacity-50 cursor-not-allowed grayscale"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Mis Materias</p>

                <p className="text-sm text-gray-500">Ver materias inscritas</p>
              </div>
            </button>

            <button
              onClick={() => !isPending && setActiveTab("events")}
              disabled={isPending}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                isPending
                  ? "opacity-50 cursor-not-allowed grayscale"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Eventos</p>

                <p className="text-sm text-gray-500">
                  {registeredEvents.length} inscritos
                </p>
              </div>
            </button>

            <button
              disabled={isPending}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                isPending
                  ? "opacity-50 cursor-not-allowed grayscale"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Documentos</p>

                <p className="text-sm text-gray-500">
                  Constancias y certificados
                </p>
              </div>
            </button>

            <button
              disabled={isPending}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                isPending
                  ? "opacity-50 cursor-not-allowed grayscale"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Rendimiento</p>

                <p className="text-sm text-gray-500">Reportes académicos</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Today's Events */}

        {!isPending && todayEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6" />

              <h3 className="text-xl font-semibold">Eventos de Hoy</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
                >
                  <h4 className="font-semibold mb-2">{event.title}</h4>

                  <p className="text-sm opacity-90 mb-1">{event.location}</p>

                  <p className="text-sm opacity-90">
                    {event.date.toLocaleTimeString("es-ES", {
                      hour: "2-digit",

                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderDegree = () => {
    if (isPending) return renderOverview();

    const userDegree = AllDegrees.find(
      (d) => d.name.toLowerCase() === user.program?.toLowerCase(),
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {userDegree ? (
          <>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={userDegree.image}
                alt={userDegree.name}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center gap-2 text-indigo-300 mb-2">
                  <GraduationCap className="w-5 h-5" />

                  <span className="font-semibold uppercase tracking-wider text-sm">
                    {userDegree.program}
                  </span>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2">
                  {userDegree.name}
                </h2>

                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />

                    {userDegree.duration}
                  </span>

                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    Título: {userDegree.title}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />

                    {userDegree.Type}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />

                    {userDegree.program === "Curso"
                      ? "Contenido del Curso"
                      : "Plan de Estudios Sugerido"}
                  </h3>

                  <div className="space-y-8">
                    {[1, 2, 3, 4].map((year) => (
                      <div key={year} className="relative">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                            {year}°
                          </div>

                          <h4 className="text-lg font-bold text-gray-800">
                            Año Académico
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-5 pl-9 border-l-2 border-indigo-100">
                          {/* Mock subjects for each year */}

                          {[1, 2, 3, 4, 5].map((subject) => (
                            <div
                              key={subject}
                              className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-indigo-500 uppercase">
                                  Código: {year}0{subject}
                                </span>

                                {year < (user.semester || 1) / 2 ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-300" />
                                )}
                              </div>

                              <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                Materia {subject} del {year}° año
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                6 Créditos • Cuatrimestral
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Info & Stats */}

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Detalles de la Carrera
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Facultad</span>

                      <span className="font-medium text-gray-900">
                        {userDegree.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Modalidad</span>

                      <span className="font-medium text-gray-900 capitalize">
                        {userDegree.Type}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Duración</span>

                      <span className="font-medium text-gray-900">
                        {userDegree.duration}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Turnos</span>

                      <span className="font-medium text-gray-900 text-right text-xs">
                        {userDegree.Time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Estado Académico</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2 opacity-90">
                        <span>Materias Aprobadas</span>

                        <span>
                          {user.semester && user.semester > 1
                            ? Math.floor(((user.semester - 1) / 10) * 40)
                            : 0}{" "}
                          / 40
                        </span>
                      </div>

                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white h-2 rounded-full"
                          style={{
                            width: `${
                              user.semester && user.semester > 1
                                ? getProgressPercentage(user.semester - 1)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 grid grid-cols-2 gap-4">
                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-xs opacity-80 mb-1">Promedio</p>

                        <p className="text-xl font-bold">
                          {formatGPA(user.gpa)}
                        </p>
                      </div>

                      <div className="bg-white/10 rounded-xl p-3 text-center">
                        <p className="text-xs opacity-80 mb-1">Créditos</p>

                        <p className="text-xl font-bold">{user.credits || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New: Link to Courses */}

                <button
                  onClick={() => {
                    setActiveTab("subjects");

                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl p-4 font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Ver mis materias actuales
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Información de Carrera no disponible
            </h3>

            <p className="text-gray-500">
              No hemos podido encontrar información detallada para el programa:{" "}
              <span className="font-bold text-indigo-600">{user.program}</span>
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderCourses = () => {
    if (isPending) return renderOverview();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-12 text-center"
      >
        <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Cursos Disponibles
        </h3>

        <p className="text-gray-500">
          No hay cursos extracurriculares disponibles en este momento.
        </p>
      </motion.div>
    );
  };

  const renderSubjects = () => {
    if (isPending) return renderOverview();

    const userDegree = AllDegrees.find(
      (d) => d.name.toLowerCase() === user.program?.toLowerCase(),
    );

    // Filter subjects for the current semester

    const currentSemesterSubjects =
      userDegree?.subjects?.filter(
        (s: any) => s.semester === (user.semester || 1),
      ) || [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Materias Actuales
              </h3>

              <p className="text-gray-500">
                {user.semester || 1}° Semestre - {user.program}
              </p>
            </div>

            <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-semibold text-sm">
              {currentSemesterSubjects.length} Materias
            </div>
          </div>

          {currentSemesterSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSemesterSubjects.map((subject: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-100 bg-gray-50/30 rounded-xl p-5 hover:border-indigo-200 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      Obligatoria
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-lg mb-1">
                    {subject.name}
                  </h4>

                  <p className="text-sm text-gray-500 mb-4">
                    Código: {user.program?.substring(0, 3).toUpperCase()}-
                    {100 + index}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />

                      <span>64 Horas</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-gray-400" />

                      <span>4 Créditos</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                      Ver Programa
                    </button>

                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />

                      <span className="text-xs font-bold uppercase">
                        En curso
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />

              <p className="text-gray-500">
                No se encontraron materias para este semestre.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderEvents = () => {
    if (isPending) return renderOverview();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Mis Eventos Inscritos
        </h3>

        {registeredEvents.length > 0 ? (
          <div className="space-y-4">
            {registeredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {event.title}
                    </h4>

                    <p className="text-sm text-gray-600 mb-1">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />

                        {event.date.toLocaleDateString("es-ES")}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />

                        {event.date.toLocaleTimeString("es-ES", {
                          hour: "2-digit",

                          minute: "2-digit",
                        })}
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />

                        {event.location}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.category === "academic"
                        ? "bg-blue-100 text-blue-800"
                        : event.category === "cultural"
                          ? "bg-purple-100 text-purple-800"
                          : event.category === "sports"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />

            <h4 className="text-lg font-medium text-gray-600 mb-2">
              No tienes eventos inscritos
            </h4>

            <p className="text-gray-500 mb-4">
              Explora los eventos disponibles y regístrate en los que te
              interesen
            </p>

            <button
              onClick={() => (window.location.href = "/eventos")}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ver Eventos
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const getSecureUrl = (url: string | null) => {
    if (!url) return "#";

    // Si es un PDF de Cloudinary que se subió como 'image', forzarlo a 'raw'

    if (url.includes("cloudinary.com") && url.toLowerCase().endsWith(".pdf")) {
      return url.replace("/image/upload/", "/raw/upload/");
    }

    return url;
  };

  const renderAdmin = () => {
    if (user?.role !== "ADMIN") return renderOverview();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Stats Summary */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Usuarios
                </p>

                <h4 className="text-2xl font-bold text-gray-900">
                  {adminStats?.total || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Estudiantes</p>

                <h4 className="text-2xl font-bold text-gray-900">
                  {adminStats?.students || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Award className="w-6 h-6 text-purple-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Profesores</p>

                <h4 className="text-2xl font-bold text-gray-900">
                  {adminStats?.professors || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <Target className="w-6 h-6 text-green-600" />
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium">Activos</p>

                <h4 className="text-2xl font-bold text-gray-900">
                  {adminStats?.active || 0}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Gestión de Solicitudes
              </h3>

              <p className="text-gray-500 text-sm">
                Revisa y aprueba las nuevas inscripciones de la plataforma
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={fetchAdminData}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors font-medium flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Search and Filters */}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, email o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none transition-colors"
              />

              <Target className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none bg-white transition-colors"
            >
              <option value="ALL">Todos los roles</option>

              <option value="STUDENT">Estudiantes</option>

              <option value="PROFESSOR">Profesores</option>
            </select>
          </div>

          {loadingAdmin ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>

              <p className="text-gray-500 font-medium">
                Cargando solicitudes...
              </p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Usuario / ID
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Programa / Semestre
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Rol
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Fecha de Solicitud
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Documentos
                    </th>

                    <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {u.name[0]}

                            {u.lastName[0]}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {u.name} {u.lastName}
                            </p>

                            <p className="text-xs text-gray-500">{u.email}</p>

                            <p className="text-[10px] font-mono text-indigo-600 mt-1">
                              ID:{" "}
                              {(u as any).studentid ??
                                u.studentId ??
                                (u as any).professorid ??
                                u.professorId ??
                                "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {u.program || "Sin programa"}
                          </p>

                          {u.role === "STUDENT" && (
                            <p className="text-xs text-gray-500">
                              {u.semester != null
                                ? `${u.semester}° Semestre`
                                : "—"}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            u.role === "STUDENT"
                              ? "bg-blue-100 text-blue-700"
                              : u.role === "PROFESSOR"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role === "STUDENT" ? "Estudiante" : "Profesor"}
                        </span>
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />

                          {(() => {
                            const raw =
                              (u as any).createdat ??
                              (u as any).created_at ??
                              u.createdAt;
                            if (!raw) return "—";
                            const d = new Date(raw);
                            return isNaN(d.getTime())
                              ? "—"
                              : d.toLocaleDateString();
                          })()}
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex gap-2">
                          {((u as any).dniurl ?? u.dniUrl) && (
                            <button
                              onClick={() =>
                                setDocumentModal({
                                  title: "Documento de Identidad (DNI)",
                                  url: ((u as any).dniurl ?? u.dniUrl)!,
                                })
                              }
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Ver DNI"
                            >
                              <CreditCard size={16} />
                            </button>
                          )}

                          {((u as any).degreeurl ?? u.degreeUrl) && (
                            <button
                              onClick={() =>
                                setDocumentModal({
                                  title: "Analítico / Título Universitario",
                                  url: ((u as any).degreeurl ?? u.degreeUrl)!,
                                })
                              }
                              className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                              title="Ver Analítico"
                            >
                              <FileText size={16} />
                            </button>
                          )}

                          {!((u as any).dniurl ?? u.dniUrl) &&
                            !((u as any).degreeurl ?? u.degreeUrl) && (
                              <span className="text-[10px] text-gray-400 italic">
                                Sin docs
                              </span>
                            )}
                        </div>
                      </td>

                      <td className="py-5 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApproveUser(u.id)}
                            disabled={isProcessing === u.id}
                            className={`px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow-sm shadow-indigo-200 flex items-center gap-2 ${
                              isProcessing === u.id
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {isProcessing === u.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              "Aprobar"
                            )}
                          </button>

                          <button
                            onClick={() => handleRejectUser(u.id)}
                            disabled={isProcessing === u.id}
                            className={`px-4 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-semibold ${
                              isProcessing === u.id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Rechazar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
              <Users className="w-20 h-20 text-gray-200 mx-auto mb-4" />

              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {searchQuery || roleFilter !== "ALL"
                  ? "No se encontraron resultados"
                  : "Bandeja de entrada vacía"}
              </h4>

              <p className="text-gray-500 max-w-sm mx-auto">
                {searchQuery || roleFilter !== "ALL"
                  ? "Prueba ajustando los filtros de búsqueda."
                  : "No hay nuevas solicitudes de registro por el momento."}
              </p>
            </div>
          )}
        </div>

        {documentModal && (
          <DocumentModal
            title={documentModal.title}
            url={documentModal.url}
            onClose={() => setDocumentModal(null)}
          />
        )}
      </motion.div>
    );
  };

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Mi Perfil</h3>

      <div className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>

            <input
              type="text"
              value={user.name || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>

            <input
              type="text"
              value={user.lastName || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {user.role === "PROFESSOR" ? "ID de Profesor" : "ID Estudiantil"}
            </label>

            <div className="relative">
              <input
                type="text"
                value={
                  (user.role === "PROFESSOR"
                    ? user.professorId
                    : user.studentId) || ""
                }
                placeholder="Pendiente de asignación..."
                disabled
                className={`w-full px-4 py-2 border rounded-lg bg-gray-50 ${
                  !(user.role === "PROFESSOR"
                    ? user.professorId
                    : user.studentId)
                    ? "text-amber-600 border-amber-200 italic"
                    : "text-gray-900 border-gray-300"
                }`}
              />

              {!(user.role === "PROFESSOR"
                ? user.professorId
                : user.studentId) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>

                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programa
            </label>

            <input
              type="text"
              value={user.program || ""}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semestre Actual
            </label>

            <input
              type="text"
              value={user.semester ? `${user.semester}° semestre` : "N/A"}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Solicitar Cambios
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Portal Estudiantil
          </h1>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            ¡Hola, {user.name}!
          </h2>

          <p className="text-gray-600">Bienvenido a tu portal personal</p>
        </motion.div>

        {/* Navigation Tabs */}

        <div className="flex overflow-x-auto border-b border-gray-200">
          {[
            { id: "overview", label: "Resumen", icon: User },

            { id: "degree", label: "Carrera", icon: GraduationCap },

            { id: "subjects", label: "Materias", icon: BookOpen },

            { id: "courses", label: "Cursos", icon: TrendingUp },

            { id: "events", label: "Eventos", icon: Calendar },

            { id: "profile", label: "Perfil", icon: Settings },

            ...(user.role === "ADMIN"
              ? [{ id: "admin", label: "Administración", icon: ShieldAlert }]
              : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-indigo-600 border-b-2 border-indigo-600 -mb-[2px]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />

              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        <div className="mt-8">
          {activeTab === "overview" && renderOverview()}

          {activeTab === "degree" && renderDegree()}

          {activeTab === "subjects" && renderSubjects()}

          {activeTab === "courses" && renderCourses()}

          {activeTab === "events" && renderEvents()}

          {activeTab === "profile" && renderProfile()}

          {activeTab === "admin" && renderAdmin()}
        </div>
      </div>
    </div>
  );
};
