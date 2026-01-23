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
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents";
import { useNotifications } from "../../Components/Notifications/NotificationSystem";
import type { User as UserType } from "../../types/User";

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getRegisteredEvents, getTodayEvents } = useEvents();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<
    "overview" | "courses" | "events" | "profile"
  >("overview");

  const registeredEvents = getRegisteredEvents();
  const todayEvents = getTodayEvents();

  const handleLogout = () => {
    logout();
  };

  const formatGPA = (gpa?: number) => {
    return gpa ? gpa.toFixed(2) : "N/A";
  };

  const getProgressPercentage = (semester: number) => {
    const totalSemesters = 10; // Assuming 10 semesters total
    return (semester / totalSemesters) * 100;
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const renderOverview = () => (
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
              {user.name.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.name} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.program}</p>
              <p className="text-sm text-gray-500">ID: {user.studentId}</p>
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
            <p className="text-2xl font-bold text-blue-900">{user.semester}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Promedio</span>
            </div>
            <p className="text-2xl font-bold text-green-900">
              {formatGPA(user.gpa)}
            </p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">Créditos</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">
              {user.credits || 0}
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Progreso</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">
              {Math.round(getProgressPercentage(user.semester))}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso académico</span>
            <span>{user.semester}/10 semestres</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage(user.semester)}%` }}
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
            onClick={() => setActiveTab("courses")}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Mis Cursos</p>
              <p className="text-sm text-gray-500">Ver materias inscritas</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
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

          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
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

          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
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
      {todayEvents.length > 0 && (
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
  );

  const renderCourses = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Mis Cursos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mock courses data */}
        {[
          {
            name: "Programación Avanzada",
            professor: "Dr. Smith",
            schedule: "Lun/Mié 14:00-16:00",
            grade: "A-",
          },
          {
            name: "Bases de Datos",
            professor: "Dra. Johnson",
            schedule: "Mar/Jue 10:00-12:00",
            grade: "B+",
          },
          {
            name: "Redes de Computadoras",
            professor: "Ing. García",
            schedule: "Vie 16:00-18:00",
            grade: "A",
          },
          {
            name: "Inteligencia Artificial",
            professor: "Dr. Chen",
            schedule: "Lun/Mié 10:00-12:00",
            grade: "B",
          },
        ].map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{course.name}</h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.grade.startsWith("A")
                    ? "bg-green-100 text-green-800"
                    : course.grade.startsWith("B")
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {course.grade}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Profesor: {course.professor}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Horario: {course.schedule}
            </p>
            <div className="flex gap-2">
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Ver detalles
              </button>
              <span className="text-gray-300">•</span>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Tareas
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderEvents = () => (
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
            Explora los eventos disponibles y regístrate en los que te interesen
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
              value={user.name}
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
              value={user.lastName}
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
              value={user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Estudiantil
            </label>
            <input
              type="text"
              value={user.studentId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programa
            </label>
            <input
              type="text"
              value={user.program}
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
              value={`${user.semester}° semestre`}
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
          <p className="text-gray-600">Bienvenido a tu portal personal</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {[
            { id: "overview", label: "Resumen", icon: User },
            { id: "courses", label: "Cursos", icon: BookOpen },
            { id: "events", label: "Eventos", icon: Calendar },
            { id: "profile", label: "Perfil", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-all ${
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
        {activeTab === "overview" && renderOverview()}
        {activeTab === "courses" && renderCourses()}
        {activeTab === "events" && renderEvents()}
        {activeTab === "profile" && renderProfile()}
      </div>
    </div>
  );
};
