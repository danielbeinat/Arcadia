import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRealtime } from "./useRealtime";
import { usePerformanceMonitoring } from "./usePerformanceMonitoring";
import { useNotifications } from "../Components/Notifications/NotificationSystem";

export const useAppInitializer = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotifications();

  const { trackUserAction, trackError, trackPageLoad } =
    usePerformanceMonitoring(!authLoading);

  const { isConnected: realtimeConnected, connectionStatus } = useRealtime({
    enableUserUpdates: isAuthenticated,
    enableCourseUpdates: isAuthenticated,
    enableGlobalNotifications: isAuthenticated,
    user: user,
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading && realtimeConnected) {
      const timer = setTimeout(() => {
        addNotification({
          type: "info",
          title: "🔔 Notificaciones en tiempo real activadas",
          message: "Recibirás actualizaciones instantáneas de tu cuenta",
          duration: 3000,
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authLoading, realtimeConnected, addNotification]);

  useEffect(() => {
    if (!authLoading) {
      trackPageLoad("app_initialized");

      if (isAuthenticated) {
        trackUserAction("app_session_start", "user_authenticated", 0, {
          userRole: user?.role,
          hasRealtime: realtimeConnected,
        });
      }
    }
  }, [
    authLoading,
    isAuthenticated,
    trackPageLoad,
    trackUserAction,
    user?.role,
    realtimeConnected,
  ]);

  return {
    realtimeConnected,
    connectionStatus,
    trackUserAction,
    trackError,
    trackPageLoad,
  };
};
