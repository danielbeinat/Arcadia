import { useEffect, useRef, useCallback } from "react";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useNotifications } from "../Components/Notifications/NotificationSystem";
import { User } from "../types/User";

interface RealtimeOptions {
  enableUserUpdates?: boolean;
  enableCourseUpdates?: boolean;
  enableGlobalNotifications?: boolean;
  user?: User | null;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected";
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useRealtime = (
  options: RealtimeOptions = {},
): UseRealtimeReturn => {
  const { addNotification } = useNotifications();
  const user = options.user;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const globalChannelRef = useRef<RealtimeChannel | null>(null);
  const connectionStatusRef = useRef<
    "disconnected" | "connecting" | "connected"
  >("disconnected");

  const {
    enableUserUpdates = true,
    enableCourseUpdates = true,
    enableGlobalNotifications = true,
  } = options;

  // Handle user-specific updates (status changes, profile updates)
  const handleUserUpdate = useCallback(
    (payload: RealtimePostgresChangesPayload<User>) => {
      if (!user || !payload.new) return;

      const oldRecord = payload.old as User;
      const newRecord = payload.new as User;

      // Status change notifications
      if (oldRecord?.status !== newRecord.status) {
        switch (newRecord.status) {
          case "APROBADO":
            addNotification({
              type: "success",
              title: "🎉 ¡Solicitud Aprobada!",
              message:
                "Tu solicitud de ingreso ha sido aprobada. ¡Bienvenido a AcademiaNova!",
              duration: 8000,
            });

            // Browser notification if permission granted
            if (Notification.permission === "granted") {
              new Notification("AcademiaNova - Solicitud Aprobada", {
                body: "¡Tu solicitud ha sido aprobada! Bienvenido a la universidad.",
                icon: "/favicon.ico",
                tag: "status-update",
              });
            }
            break;

          case "RECHAZADO":
            addNotification({
              type: "error",
              title: "❌ Solicitud Rechazada",
              message:
                "Tu solicitud no pudo ser procesada. Revisa tus documentos y vuelve a intentar.",
              duration: 10000,
            });
            break;

          case "PENDIENTE":
            addNotification({
              type: "info",
              title: "⏳ Solicitud en Revisión",
              message:
                "Tu solicitud está siendo revisada por el equipo de admisiones.",
              duration: 6000,
            });
            break;

          default:
            break;
        }
      }

      // GPA updates for students
      if (oldRecord?.gpa !== newRecord.gpa && newRecord.role === "STUDENT") {
        addNotification({
          type: "info",
          title: "📊 GPA Actualizado",
          message: `Tu promedio académico se actualizó a ${newRecord.gpa}`,
          duration: 5000,
        });
      }

      // Credits updates
      if (
        oldRecord?.credits !== newRecord.credits &&
        newRecord.role === "STUDENT"
      ) {
        const creditsDiff =
          (newRecord.credits || 0) - (oldRecord?.credits || 0);
        if (creditsDiff > 0) {
          addNotification({
            type: "success",
            title: "🏆 Créditos Obtenidos",
            message: `¡Felicitaciones! Has obtenido ${creditsDiff} créditos adicionales.`,
            duration: 6000,
          });
        }
      }
    },
    [user, addNotification],
  );

  // Handle course enrollment updates
  const handleCourseUpdate = useCallback(
    (payload: RealtimePostgresChangesPayload<any>) => {
      if (!user) return;

      const { eventType, new: newRecord, old: oldRecord } = payload;

      if (eventType === "INSERT" && newRecord.user_id === user.id) {
        addNotification({
          type: "success",
          title: "📚 Inscripción Exitosa",
          message: `Te has inscrito exitosamente en el curso: ${newRecord.courseName}`,
          duration: 5000,
        });
      }

      if (eventType === "DELETE" && oldRecord?.user_id === user.id) {
        addNotification({
          type: "info",
          title: "📝 Curso Abandonado",
          message: `Has abandonado el curso: ${oldRecord.courseName}`,
          duration: 4000,
        });
      }
    },
    [user, addNotification],
  );

  // Handle global announcements and system notifications
  const handleGlobalNotification = useCallback(
    (payload: RealtimePostgresChangesPayload<any>) => {
      const { eventType, new: newRecord } = payload;

      if (eventType === "INSERT" && newRecord.type === "ANNOUNCEMENT") {
        addNotification({
          type: "info",
          title: "📢 Nuevo Anuncio",
          message: newRecord.message || "Hay un nuevo anuncio disponible",
          duration: 7000,
        });
      }

      if (eventType === "INSERT" && newRecord.type === "SYSTEM_MAINTENANCE") {
        addNotification({
          type: "warning",
          title: "🔧 Mantenimiento Programado",
          message:
            newRecord.message || "El sistema entrará en mantenimiento pronto",
          duration: 10000,
        });
      }
    },
    [addNotification],
  );

  const subscribe = useCallback(() => {
    if (!user?.id || channelRef.current) return;

    connectionStatusRef.current = "connecting";

    // User-specific channel
    if (enableUserUpdates) {
      channelRef.current = supabase
        .channel(`user-updates-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
            filter: `id=eq."${user.id}"`,
          },
          handleUserUpdate,
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            connectionStatusRef.current = "connected";
          }

          if (status === "CHANNEL_ERROR") {
            connectionStatusRef.current = "disconnected";
          }
        });
    }

    // Course enrollment updates
    if (enableCourseUpdates) {
      const courseChannel = supabase
        .channel(`course-enrollments-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "course_enrollments",
            filter: `user_id=eq."${user.id}"`,
          },
          handleCourseUpdate,
        )
        .subscribe();
    }

    // Global notifications (announcements, system messages)
    if (enableGlobalNotifications) {
      globalChannelRef.current = supabase
        .channel("global-notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
          },
          handleGlobalNotification,
        )
        .subscribe();
    }

    supabase.realtime.onOpen(() => {
      connectionStatusRef.current = "connected";
    });

    supabase.realtime.onClose(() => {
      connectionStatusRef.current = "disconnected";
    });
  }, [
    user,
    enableUserUpdates,
    enableCourseUpdates,
    enableGlobalNotifications,
    handleUserUpdate,
    handleCourseUpdate,
    handleGlobalNotification,
  ]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }

    if (globalChannelRef.current) {
      globalChannelRef.current.unsubscribe();
      globalChannelRef.current = null;
    }

    connectionStatusRef.current = "disconnected";
  }, []);

  // Auto-subscribe when user is available
  useEffect(() => {
    if (user?.id) {
      subscribe();
    } else {
      unsubscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [user?.id, subscribe, unsubscribe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return {
    isConnected: connectionStatusRef.current === "connected",
    connectionStatus: connectionStatusRef.current,
    subscribe,
    unsubscribe,
  };
};

// Utility hook for presence (online users)
export const usePresence = (
  channelName: string = "global",
  user?: User | null,
) => {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Track user presence
    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;

        // Send user presence info
        await channel.track({
          user_id: user.id,
          name: user.name,
          role: user.role,
          online_at: new Date().toISOString(),
        });
      });

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [user, channelName]);

  return {
    channel: channelRef.current,
  };
};

// Hook for real-time search suggestions
export const useRealtimeSearch = () => {
  const { addNotification } = useNotifications();

  const subscribeToSearchUpdates = useCallback(
    (searchTerm: string, onUpdate: (results: any[]) => void) => {
      if (!searchTerm.trim()) return null;

      const channel = supabase
        .channel(`search-${searchTerm.toLowerCase()}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "courses",
          },
          (payload) => {
            // Re-run search when courses are updated
            const { new: newRecord } = payload;
            if (
              newRecord?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              onUpdate([newRecord]);
            }
          },
        )
        .subscribe();

      return channel;
    },
    [],
  );

  return {
    subscribeToSearchUpdates,
  };
};
