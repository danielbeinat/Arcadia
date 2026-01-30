import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Filter,
  X,
  ChevronRight,
  Bell,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useEvents } from "../../hooks/useEvents";
import { useDebounce } from "../../hooks/useDebounce";
import type { UniversityEvent } from "../../types/Event";

const categoryColors = {
  academic: "bg-blue-100 text-blue-800 border-blue-200",
  cultural: "bg-purple-100 text-purple-800 border-purple-200",
  sports: "bg-green-100 text-green-800 border-green-200",
  administrative: "bg-red-100 text-red-800 border-red-200",
  social: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const categoryIcons = {
  academic: "📚",
  cultural: "🎭",
  sports: "⚽",
  administrative: "📋",
  social: "👥",
};

const typeLabels = {
  lecture: "Conferencia",
  workshop: "Taller",
  meeting: "Reunión",
  competition: "Competencia",
  celebration: "Celebración",
  deadline: "Fecha Límite",
};

export const Events: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const {
    events,
    registerForEvent,
    unregisterFromEvent,
    isRegistered,
    getUpcomingEvents,
    getTodayEvents,
    searchEvents,
    getEventsByCategory,
  } = useEvents();

  // Get upcoming events (next 30 days)
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(30),
    [getUpcomingEvents],
  );
  const todayEvents = useMemo(() => getTodayEvents(), [getTodayEvents]);

  // Filter events based on search and category
  const filteredEvents = useMemo(() => {
    let filtered = upcomingEvents;

    if (debouncedSearchTerm) {
      filtered = searchEvents(debouncedSearchTerm);
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory,
      );
    }

    return filtered;
  }, [upcomingEvents, debouncedSearchTerm, selectedCategory, searchEvents]);

  const categories = useMemo(() => {
    const cats = [...new Set(events.map((event) => event.category))];
    return cats.filter((cat) => cat) as UniversityEvent["category"][];
  }, [events]);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return "Finalizado";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `En ${days} día${days > 1 ? "s" : ""}`;
    if (hours > 0) return `En ${hours} hora${hours > 1 ? "s" : ""}`;
    return "Próximamente";
  };

  const handleRegistration = (eventId: string, event: UniversityEvent) => {
    if (isRegistered(eventId)) {
      unregisterFromEvent(eventId);
    } else {
      registerForEvent(eventId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Eventos Universitarios
          </h1>
          <p className="text-gray-600 text-lg">
            Descubre y participa en las actividades de nuestra comunidad
          </p>
        </motion.div>

        {/* Today's Events Alert */}
        {todayEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 mb-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <Bell className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Eventos de Hoy</h2>
            </div>
            <div className="space-y-2">
              {todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-lg p-3"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm opacity-90">
                      {event.location} •{" "}
                      {event.date.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200 outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {selectedCategory && (
                <span className="bg-white text-indigo-600 px-2 py-1 rounded-full text-xs font-semibold">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    !selectedCategory
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  Todas las categorías
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      selectedCategory === category
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span>{categoryIcons[category]}</span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1
              ? "evento encontrado"
              : "eventos encontrados"}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Event Image */}
              {event.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[event.category]}`}
                  >
                    <span>{categoryIcons[event.category]}</span>
                    {event.category.charAt(0).toUpperCase() +
                      event.category.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {typeLabels[event.type]}
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.registeredCount || 0}/{event.capacity} inscritos
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span
                      className={`font-medium ${
                        new Date() > event.date
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatTimeRemaining(event.date)}
                    </span>
                  </div>
                </div>

                {/* Registration Button */}
                <button
                  onClick={() => handleRegistration(event.id, event)}
                  disabled={new Date() > event.date}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    isRegistered(event.id)
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : new Date() > event.date
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isRegistered(event.id) ? (
                    <>
                      <UserMinus className="w-4 h-4" />
                      Cancelar inscripción
                    </>
                  ) : new Date() > event.date ? (
                    "Evento finalizado"
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Inscribirse
                    </>
                  )}
                </button>

                {/* Required Badge */}
                {event.isRequired && (
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      <Bell className="w-3 h-3" />
                      Obligatorio
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar los filtros o el término de búsqueda
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
