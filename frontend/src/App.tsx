import { NavBar } from "./Components/Header/NavBar/NavBar";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ChatBox } from "./Components/ChatBox/ChatBox";
import { Footer } from "./Components/Footer/Footer";
import { NotFound } from "./pages/NotFound/NotFound";
import { NotificationProvider } from "./Components/Notifications/NotificationSystem";
import { AuthProvider } from "./hooks/useAuth";
import { useAppInitializer } from "./hooks/useAppInitializer";
import { offlineManager } from "./utils/offlineManager";
import { useEffect } from "react";
import { api } from "./services/api";
import { ProtectedRoute } from "./Components/Auth/ProtectedRoute";

const Home = lazy(() =>
  import("./pages/Home/Home").then((m) => ({ default: m.Home })),
);
const About = lazy(() =>
  import("./pages/About/About").then((m) => ({ default: m.About })),
);
const Courses = lazy(() =>
  import("./pages/Courses/Courses").then((m) => ({ default: m.Courses })),
);
const OnCampus = lazy(() =>
  import("./pages/Degrees/OnCampus").then((m) => ({ default: m.OnCampus })),
);
const Online = lazy(() =>
  import("./pages/Degrees/Online").then((m) => ({ default: m.Online })),
);
const Portal = lazy(() =>
  import("./pages/Students/Portal").then((m) => ({ default: m.Portal })),
);
const Dashboard = lazy(() =>
  import("./pages/Students/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Services = lazy(() =>
  import("./pages/Students/Services").then((m) => ({ default: m.Services })),
);
const Info = lazy(() =>
  import("./pages/NewStudents/Info").then((m) => ({ default: m.Info })),
);
const Requirements = lazy(() =>
  import("./pages/NewStudents/Requirements").then((m) => ({
    default: m.Requirements,
  })),
);
const Login = lazy(() =>
  import("./pages/Count/Login").then((m) => ({ default: m.Login })),
);
const Inscription = lazy(() =>
  import("./pages/Inscription/Inscription").then((m) => ({
    default: m.Inscription,
  })),
);
const Category = lazy(() =>
  import("./Components/Category/Category").then((m) => ({
    default: m.Category,
  })),
);
const ValidateAccount = lazy(() =>
  import("./pages/ValidateAccount/ValidateAccount").then((m) => ({
    default: m.ValidateAccount,
  })),
);
const DisplayDegree = lazy(() =>
  import("./Components/DisplayDegree/DisplayDegree").then((m) => ({
    default: m.DisplayDegree,
  })),
);
const Events = lazy(() =>
  import("./pages/Events/Events").then((m) => ({ default: m.Events })),
);
const Unauthorized = lazy(() =>
  import("./pages/Unauthorized/Unauthorized").then((m) => ({
    default: m.Unauthorized,
  })),
);
const AdvancedFeaturesDemo = lazy(() =>
  import("./Components/AdvancedFeaturesDemo/AdvancedFeaturesDemo").then(
    (m) => ({
      default: m.default,
    }),
  ),
);

import { ScrollToTop } from "./Components/ScrollToTop";

const AppContent: React.FC = () => {
  useAppInitializer();

  return (
    <>
      <ScrollToTop />
      <NavBar />

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Cargando página...</p>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/info" element={<Info />} />
          <Route path="/requisitos" element={<Requirements />} />
          <Route path="/online" element={<Online />} />
          <Route path="/presenciales" element={<OnCampus />} />
          <Route path="/demo" element={<AdvancedFeaturesDemo />} />
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <Portal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "PROFESSOR", "STUDENT"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicios"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route path="/cursos" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscripciones" element={<Inscription />} />
          <Route path="/area/:category" element={<Category />} />
          <Route path="/validate-account" element={<ValidateAccount />} />
          <Route path="/career/:careerId" element={<DisplayDegree />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
      <ChatBox />
    </>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    api.wakeUp();

    offlineManager.setupNetworkListeners((status) => {
      if (status === "online") {
        offlineManager.syncWhenOnline();
      }
    });

    import("./assets/AllDegrees/AllDegrees").then(({ NormalizedDegrees }) => {
      offlineManager.cacheCourseData(NormalizedDegrees);
    });

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NotificationProvider>
  );
};
