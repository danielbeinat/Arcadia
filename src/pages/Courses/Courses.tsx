import cursos from "../../assets/AllDegrees/Images/cursos.webp";
import { NormalizedDegrees } from "../../assets/AllDegrees/AllDegrees";
import { MdCalendarMonth } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Search, Filter, X, Wifi, WifiOff } from "lucide-react";
import { useNotifications } from "../../Components/Notifications/NotificationSystem";
import { useDebounce } from "../../hooks/useDebounce";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { offlineManager } from "../../utils/offlineManager";

import type { Degree } from "../../types/Degree";

export const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [isOnline, setIsOnline] = useState(offlineManager.isOnline());
  const [usingOfflineData, setUsingOfflineData] = useState(false);

  const { addNotification } = useNotifications();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [savedFilters, setSavedFilters] = useLocalStorage("course-filters", {
    category: "",
    duration: "",
    search: "",
  });

  // Load saved filters on mount
  useEffect(() => {
    if (savedFilters.search) setSearchTerm(savedFilters.search);
    if (savedFilters.category) setSelectedCategory(savedFilters.category);
    if (savedFilters.duration) setSelectedDuration(savedFilters.duration);
  }, []);

  // Save filters when they change
  useEffect(() => {
    setSavedFilters({
      search: searchTerm,
      category: selectedCategory,
      duration: selectedDuration,
    });
  }, [searchTerm, selectedCategory, selectedDuration]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setUsingOfflineData(false);
      addNotification({
        type: "success",
        title: "Conexión restaurada",
        message: "Ahora tienes conexión a internet",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setUsingOfflineData(true);
      addNotification({
        type: "warning",
        title: "Modo sin conexión",
        message: "Usando datos guardados localmente",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [addNotification]);

  const handleCardClick = (id: number) => {
    window.scrollTo(0, 0);
    navigate(`/career/${id}`);
  };

  // Get courses - try online first, fallback to offline
  const courses = useMemo(() => {
    let courseData = NormalizedDegrees.filter(
      (item) => item.program === "Curso",
    );

    if (!isOnline && courseData.length === 0) {
      const offlineCourses = offlineManager.getCachedCourses();
      if (offlineCourses.length > 0) {
        courseData = offlineCourses as any;
        setUsingOfflineData(true);
      }
    }

    return courseData;
  }, [isOnline]);

  // Obtener categorías únicas para filtros
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(courses.map((course) => course.category)),
    ];
    return uniqueCategories.filter((cat) => cat && cat.trim() !== "");
  }, [courses]);

  // Obtener duraciones únicas para filtros
  const durations = useMemo(() => {
    const uniqueDurations = [
      ...new Set(courses.map((course) => course.duration)),
    ];
    return uniqueDurations.filter((dur) => dur && dur.trim() !== "");
  }, [courses]);

  // Filtrar cursos en tiempo real (con debounce)
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.category
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || course.category === selectedCategory;
      const matchesDuration =
        !selectedDuration || course.duration === selectedDuration;

      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [courses, debouncedSearchTerm, selectedCategory, selectedDuration]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDuration("");
  };

  return (
    <>
      <div className="mb-20">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full "
        >
          <img className="" src={cursos} alt="image" />
        </motion.div>

        {/* Barra de búsqueda y filtros */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            {/* Búsqueda */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos por nombre o categoría..."
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

            {/* Indicador de estado de red */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-sm font-medium">Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-orange-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Modo offline</span>
                  </div>
                )}
                {usingOfflineData && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Datos guardados
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1
                  ? "curso encontrado"
                  : "cursos encontrados"}
              </div>
            </div>

            {/* Botones de filtro */}
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtros
                {(selectedCategory || selectedDuration) && (
                  <span className="bg-white text-indigo-600 px-2 py-1 rounded-full text-xs font-semibold">
                    {
                      [selectedCategory, selectedDuration].filter(Boolean)
                        .length
                    }
                  </span>
                )}
              </button>

              {(selectedCategory || selectedDuration || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Panel de filtros */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Filtro por categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    >
                      <option value="">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por duración */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración
                    </label>
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    >
                      <option value="">Todas las duraciones</option>
                      {durations.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Grid de cursos */}
        <div className="grid grid-cols-1 px-4 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((item: Degree) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleCardClick(item.id)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {item.name}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <MdCalendarMonth className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold">Duración:</span>{" "}
                        {item.duration}
                      </div>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="bg-indigo-100 rounded-full p-2 mr-3">
                        <FaUserGraduate className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-semibold">Programa:</span>{" "}
                        {item.program}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-gray-500">
                Intenta ajustar los filtros o el término de búsqueda
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};
