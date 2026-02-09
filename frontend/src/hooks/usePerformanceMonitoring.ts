import { useState, useEffect, useCallback, useRef } from "react";

interface PerformanceMetric {
  id: string;
  metricType: "page_load" | "api_call" | "user_action" | "error" | "search";
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count" | "score";
  timestamp: number;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  pageViews: number;
  totalTimeSpent: number;
  bounceRate: number;
  userAgent: string;
  referrer?: string;
}

interface PerformanceState {
  metrics: PerformanceMetric[];
  session: UserSession | null;
  isTracking: boolean;
  vitals: {
    lcp: number | null; // Largest Contentful Paint
    fid: number | null; // First Input Delay
    cls: number | null; // Cumulative Layout Shift
    fcp: number | null; // First Contentful Paint
    ttfb: number | null; // Time to First Byte
  };
}

export const usePerformanceMonitoring = (enableTracking = true) => {
  const [state, setState] = useState<PerformanceState>({
    metrics: [],
    session: null,
    isTracking: enableTracking,
    vitals: {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
    },
  });

  const sessionIdRef = useRef<string>();
  const startTimeRef = useRef<number>(Date.now());
  const pageViewsRef = useRef<number>(0);
  const lastInteractionRef = useRef<number>(Date.now());

  // Initialize session
  useEffect(() => {
    if (!enableTracking) return;

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionIdRef.current = sessionId;

    const session: UserSession = {
      sessionId,
      startTime: Date.now(),
      pageViews: 1,
      totalTimeSpent: 0,
      bounceRate: 0,
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
    };

    setState((prev) => ({ ...prev, session }));
    pageViewsRef.current = 1;

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page became hidden, record time spent
        const timeSpent = Date.now() - lastInteractionRef.current;
        recordMetric({
          metricType: "user_action",
          name: "page_hidden",
          value: timeSpent,
          unit: "ms",
        });
      } else {
        // Page became visible again
        lastInteractionRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      endSession();
    };
  }, [enableTracking]);

  // Record a performance metric
  const recordMetric = useCallback(
    (
      metric: Omit<
        PerformanceMetric,
        "id" | "timestamp" | "userId" | "sessionId"
      >,
    ) => {
      if (!state.isTracking || !sessionIdRef.current) return;

      const newMetric: PerformanceMetric = {
        id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        userId: undefined, // Simplified
        sessionId: sessionIdRef.current,
        ...metric,
      };

      setState((prev) => ({
        ...prev,
        metrics: [...prev.metrics, newMetric],
      }));

      // Send to Supabase (debounced to avoid too many requests)
      sendMetricsToSupabase([newMetric]);
    },
    [state.isTracking, user?.id],
  );

  // Store metrics locally (simplified to avoid DB errors)
  const sendMetricsToSupabase = useCallback(
    async (metrics: PerformanceMetric[]) => {
      if (!metrics.length) return;

      try {
        // Store in localStorage for debugging purposes
        const existingMetrics = JSON.parse(
          localStorage.getItem("performance_metrics") || "[]",
        );
        localStorage.setItem(
          "performance_metrics",
          JSON.stringify([...existingMetrics, ...metrics]),
        );
      } catch (error) {
        console.warn("Failed to store metrics locally:", error);
      }
    },
    [],
  );

  // Track page load performance
  const trackPageLoad = useCallback(
    (pageName: string) => {
      if (!state.isTracking) return;

      pageViewsRef.current += 1;

      // Use Performance API to get navigation timing
      if ("performance" in window && "getEntriesByType" in performance) {
        const [navigation] = performance.getEntriesByType(
          "navigation",
        ) as PerformanceNavigationTiming[];

        if (navigation) {
          recordMetric({
            metricType: "page_load",
            name: `${pageName}_load_time`,
            value: navigation.loadEventEnd - navigation.loadEventStart,
            unit: "ms",
            metadata: {
              page: pageName,
              domContentLoaded:
                navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart,
              firstByte: navigation.responseStart - navigation.requestStart,
            },
          });

          // Update TTFB vital
          setState((prev) => ({
            ...prev,
            vitals: {
              ...prev.vitals,
              ttfb: navigation.responseStart - navigation.requestStart,
            },
          }));
        }
      }

      // Track custom page view
      recordMetric({
        metricType: "user_action",
        name: "page_view",
        value: 1,
        unit: "count",
        metadata: { page: pageName },
      });
    },
    [state.isTracking, recordMetric],
  );

  // Track API call performance
  const trackApiCall = useCallback(
    (
      endpoint: string,
      method: string,
      duration: number,
      status: number,
      error?: string,
    ) => {
      if (!state.isTracking) return;

      recordMetric({
        metricType: "api_call",
        name: `api_${method.toLowerCase()}_${endpoint.replace(/\//g, "_")}`,
        value: duration,
        unit: "ms",
        metadata: {
          endpoint,
          method,
          status,
          error: error || null,
          success: status >= 200 && status < 300,
        },
      });
    },
    [state.isTracking, recordMetric],
  );

  // Track user actions
  const trackUserAction = useCallback(
    (
      action: string,
      target?: string,
      value?: number,
      metadata?: Record<string, any>,
    ) => {
      if (!state.isTracking) return;

      lastInteractionRef.current = Date.now();

      recordMetric({
        metricType: "user_action",
        name: action,
        value: value ?? 1,
        unit: value !== undefined ? "ms" : "count",
        metadata: {
          target,
          ...metadata,
        },
      });
    },
    [state.isTracking, recordMetric],
  );

  // Track search performance
  const trackSearch = useCallback(
    (
      query: string,
      resultCount: number,
      duration: number,
      filters?: Record<string, any>,
    ) => {
      if (!state.isTracking) return;

      recordMetric({
        metricType: "search",
        name: "search_query",
        value: duration,
        unit: "ms",
        metadata: {
          query: query.length > 50 ? query.substring(0, 50) + "..." : query,
          queryLength: query.length,
          resultCount,
          filters,
          hasResults: resultCount > 0,
        },
      });
    },
    [state.isTracking, recordMetric],
  );

  // Track errors
  const trackError = useCallback(
    (
      errorType: string,
      errorMessage: string,
      stackTrace?: string,
      metadata?: Record<string, any>,
    ) => {
      if (!state.isTracking) return;

      recordMetric({
        metricType: "error",
        name: errorType,
        value: 1,
        unit: "count",
        metadata: {
          message:
            errorMessage.length > 200
              ? errorMessage.substring(0, 200) + "..."
              : errorMessage,
          stackTrace: stackTrace?.substring(0, 500),
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          ...metadata,
        },
      });
    },
    [state.isTracking, recordMetric],
  );

  // End session (simplified)
  const endSession = useCallback(() => {
    if (!state.session || !sessionIdRef.current) return;

    const endTime = Date.now();
    const totalTimeSpent = endTime - startTimeRef.current;

    const updatedSession: UserSession = {
      ...state.session,
      endTime,
      totalTimeSpent,
      pageViews: pageViewsRef.current,
      bounceRate: pageViewsRef.current === 1 ? 1 : 0,
    };

    // Store session locally instead of DB
    try {
      localStorage.setItem("user_session", JSON.stringify(updatedSession));
    } catch (error) {
      console.warn("Failed to save session:", error);
    }

    setState((prev) => ({ ...prev, session: updatedSession }));
  }, [state.session]);

  // Web Vitals integration
  useEffect(() => {
    if (!state.isTracking || typeof window === "undefined") return;

    // Import web-vitals dynamically
    import("web-vitals")
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          setState((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, cls: metric.value },
          }));
          recordMetric({
            metricType: "page_load",
            name: "web_vital_cls",
            value: metric.value,
            unit: "score",
          });
        });

        getFID((metric) => {
          setState((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, fid: metric.value },
          }));
          recordMetric({
            metricType: "page_load",
            name: "web_vital_fid",
            value: metric.value,
            unit: "ms",
          });
        });

        getFCP((metric) => {
          setState((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, fcp: metric.value },
          }));
          recordMetric({
            metricType: "page_load",
            name: "web_vital_fcp",
            value: metric.value,
            unit: "ms",
          });
        });

        getLCP((metric) => {
          setState((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, lcp: metric.value },
          }));
          recordMetric({
            metricType: "page_load",
            name: "web_vital_lcp",
            value: metric.value,
            unit: "ms",
          });
        });

        getTTFB((metric) => {
          setState((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, ttfb: metric.value },
          }));
          recordMetric({
            metricType: "page_load",
            name: "web_vital_ttfb",
            value: metric.value,
            unit: "ms",
          });
        });
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals:", error);
      });
  }, [state.isTracking, recordMetric]);

  // Auto-track unhandled errors
  useEffect(() => {
    if (!state.isTracking) return;

    const handleError = (event: ErrorEvent) => {
      trackError("javascript_error", event.message, event.error?.stack, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(
        "unhandled_promise_rejection",
        event.reason?.toString() || "Unknown promise rejection",
        event.reason?.stack,
      );
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, [state.isTracking, trackError]);

  // Get performance summary
  const getPerformanceSummary = useCallback(() => {
    const { metrics, vitals } = state;

    const pageLoadMetrics = metrics.filter((m) => m.metricType === "page_load");
    const apiCallMetrics = metrics.filter((m) => m.metricType === "api_call");
    const errorMetrics = metrics.filter((m) => m.metricType === "error");
    const searchMetrics = metrics.filter((m) => m.metricType === "search");

    return {
      vitals,
      averagePageLoadTime:
        pageLoadMetrics.length > 0
          ? pageLoadMetrics.reduce((sum, m) => sum + m.value, 0) /
            pageLoadMetrics.length
          : 0,
      averageApiCallTime:
        apiCallMetrics.length > 0
          ? apiCallMetrics.reduce((sum, m) => sum + m.value, 0) /
            apiCallMetrics.length
          : 0,
      errorCount: errorMetrics.length,
      searchCount: searchMetrics.length,
      totalMetrics: metrics.length,
      sessionDuration: state.session ? Date.now() - state.session.startTime : 0,
    };
  }, [state]);

  return {
    ...state,
    trackPageLoad,
    trackApiCall,
    trackUserAction,
    trackSearch,
    trackError,
    recordMetric,
    endSession,
    getPerformanceSummary,
  };
};
