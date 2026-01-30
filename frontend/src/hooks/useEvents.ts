import { useState, useEffect, useCallback } from "react";
import type { UniversityEvent, EventRegistration } from "../types/Event";
import { mockEvents } from "../data/eventsData";
import { useNotifications } from "../Components/Notifications/NotificationSystem";
import { useLocalStorage } from "./useLocalStorage";

export const useEvents = () => {
  const [events, setEvents] = useState<UniversityEvent[]>(mockEvents);
  const [registrations, setRegistrations] = useLocalStorage<
    EventRegistration[]
  >("event-registrations", []);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  // Setup automatic reminders
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();

      events.forEach((event) => {
        if (event.reminderTimes) {
          event.reminderTimes.forEach((minutesBefore) => {
            const reminderTime = new Date(
              event.date.getTime() - minutesBefore * 60 * 1000,
            );

            // Check if reminder time is within the last minute (to avoid missing it)
            const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
            const isTimeForReminder = timeDiff < 60000; // 1 minute window

            if (isTimeForReminder) {
              const reminderKey = `reminder-${event.id}-${minutesBefore}`;
              const alreadySent = localStorage.getItem(reminderKey);

              if (!alreadySent) {
                // Send notification
                const timeText =
                  minutesBefore >= 1440
                    ? `${Math.floor(minutesBefore / 1440)} día(s)`
                    : minutesBefore >= 60
                      ? `${Math.floor(minutesBefore / 60)} hora(s)`
                      : `${minutesBefore} minuto(s)`;

                addNotification({
                  type: "info",
                  title: `Recordatorio: ${event.title}`,
                  message: `El evento comienza en ${timeText}. ${event.location}`,
                  duration: 10000,
                });

                // Mark reminder as sent
                localStorage.setItem(reminderKey, "true");

                // Clean up old reminders (older than 1 day)
                setTimeout(
                  () => {
                    localStorage.removeItem(reminderKey);
                  },
                  24 * 60 * 60 * 1000,
                );
              }
            }
          });
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkReminders);
  }, [events, addNotification]);

  const registerForEvent = useCallback(
    (eventId: string) => {
      const event = events.find((e) => e.id === eventId);
      if (!event) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Evento no encontrado",
          duration: 5000,
        });
        return false;
      }

      // Check if already registered
      const existingRegistration = registrations.find(
        (r) => r.eventId === eventId,
      );
      if (existingRegistration) {
        addNotification({
          type: "warning",
          title: "Ya estás inscrito",
          message: "Ya te has inscrito en este evento",
          duration: 5000,
        });
        return false;
      }

      // Check capacity
      if (
        event.capacity &&
        event.registeredCount &&
        event.registeredCount >= event.capacity
      ) {
        addNotification({
          type: "error",
          title: "Aforo completo",
          message: "No hay cupos disponibles para este evento",
          duration: 5000,
        });
        return false;
      }

      // Check registration deadline
      if (
        event.registrationDeadline &&
        new Date() > event.registrationDeadline
      ) {
        addNotification({
          type: "error",
          title: "Inscripción cerrada",
          message: "El plazo de inscripción ha finalizado",
          duration: 5000,
        });
        return false;
      }

      // Create registration
      const registration: EventRegistration = {
        id: `reg-${Date.now()}`,
        eventId,
        userId: "current-user", // In a real app, this would come from auth
        registeredAt: new Date(),
        status: "confirmed",
        reminderSent: [],
      };

      setRegistrations([...registrations, registration]);

      // Update event registered count
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === eventId
            ? { ...e, registeredCount: (e.registeredCount || 0) + 1 }
            : e,
        ),
      );

      addNotification({
        type: "success",
        title: "¡Inscripción exitosa!",
        message: `Te has inscrito en "${event.title}"`,
        duration: 5000,
      });

      return true;
    },
    [events, registrations, setRegistrations, addNotification],
  );

  const unregisterFromEvent = useCallback(
    (eventId: string) => {
      const registration = registrations.find((r) => r.eventId === eventId);
      if (!registration) {
        addNotification({
          type: "error",
          title: "Error",
          message: "No encontraste inscripción para este evento",
          duration: 5000,
        });
        return false;
      }

      const event = events.find((e) => e.id === eventId);

      setRegistrations(registrations.filter((r) => r.eventId !== eventId));

      // Update event registered count
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === eventId
            ? {
                ...e,
                registeredCount: Math.max(0, (e.registeredCount || 0) - 1),
              }
            : e,
        ),
      );

      addNotification({
        type: "info",
        title: "Inscripción cancelada",
        message: `Has cancelado tu inscripción en "${event?.title}"`,
        duration: 5000,
      });

      return true;
    },
    [events, registrations, setRegistrations, addNotification],
  );

  const isRegistered = useCallback(
    (eventId: string) => {
      return registrations.some(
        (r) => r.eventId === eventId && r.status === "confirmed",
      );
    },
    [registrations],
  );

  const getRegisteredEvents = useCallback(() => {
    const registeredEventIds = registrations
      .filter((r) => r.status === "confirmed")
      .map((r) => r.eventId);

    return events.filter((event) => registeredEventIds.includes(event.id));
  }, [events, registrations]);

  const getUpcomingEvents = useCallback(
    (days: number = 30) => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      return events
        .filter((event) => event.date >= now && event.date <= futureDate)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    [events],
  );

  const getTodayEvents = useCallback(() => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    return events
      .filter((event) => event.date >= startOfDay && event.date < endOfDay)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  const searchEvents = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();
      return events.filter(
        (event) =>
          event.title.toLowerCase().includes(lowercaseQuery) ||
          event.description.toLowerCase().includes(lowercaseQuery) ||
          event.location.toLowerCase().includes(lowercaseQuery) ||
          event.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
      );
    },
    [events],
  );

  const getEventsByCategory = useCallback(
    (category: UniversityEvent["category"]) => {
      return events.filter((event) => event.category === category);
    },
    [events],
  );

  return {
    events,
    registrations,
    loading,
    registerForEvent,
    unregisterFromEvent,
    isRegistered,
    getRegisteredEvents,
    getUpcomingEvents,
    getTodayEvents,
    searchEvents,
    getEventsByCategory,
  };
};
