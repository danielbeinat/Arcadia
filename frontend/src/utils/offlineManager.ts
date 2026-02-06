export interface OfflineCourse {
  id: number;
  name: string;
  category: string;
  duration: string;
  image: string;
  program: string;
  type: string;
  time: string;
  cachedAt: number;
}

export interface OfflineData {
  courses: OfflineCourse[];
  lastUpdated: number;
  version: string;
}

class OfflineManager {
  private readonly CACHE_NAME = "university-site-v1";
  private readonly OFFLINE_DATA_KEY = "offline-data";
  private readonly CACHE_VERSION = "1.0.0";

  constructor() {
    this.initializeServiceWorker();
  }

  async initializeServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (error) {
        // Silent fail in development
      }
    }
  }

  async cacheCourseData(courses: any[]): Promise<void> {
    try {
      const offlineCourses: OfflineCourse[] = courses.map((course) => ({
        id: course.id,
        name: course.name,
        category: course.category,
        duration: course.duration,
        image: course.image,
        program: course.program,
        type: course.type,
        time: course.time,
        cachedAt: Date.now(),
      }));

      const offlineData: OfflineData = {
        courses: offlineCourses,
        lastUpdated: Date.now(),
        version: this.CACHE_VERSION,
      };

      localStorage.setItem(this.OFFLINE_DATA_KEY, JSON.stringify(offlineData));

      const cache = await caches.open(this.CACHE_NAME);
      const imageUrls = courses
        .map((course) => course.image)
        .filter(Boolean)
        .filter((url: string) => {
          try {
            const urlObj = new URL(url);
            return urlObj.hostname === window.location.hostname;
          } catch {
            return false;
          }
        });

      if (imageUrls.length > 0) {
        await cache.addAll(imageUrls);
      }
    } catch (error) {
      // Silent error handling for background caching
    }
  }

  getCachedCourses(): OfflineCourse[] {
    try {
      const data = localStorage.getItem(this.OFFLINE_DATA_KEY);
      if (!data) return [];

      const offlineData: OfflineData = JSON.parse(data);

      const maxAge = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - offlineData.lastUpdated > maxAge) {
        this.clearCache();
        return [];
      }

      return offlineData.courses;
    } catch (error) {
      return [];
    }
  }

  async clearCache(): Promise<void> {
    try {
      localStorage.removeItem(this.OFFLINE_DATA_KEY);
      const cache = await caches.open(this.CACHE_NAME);
      const keys = await cache.keys();
      await Promise.all(keys.map((key) => cache.delete(key)));
    } catch (error) {
      // Ignore errors
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async getNetworkStatus(): Promise<"online" | "offline" | "slow"> {
    if (!navigator.onLine) return "offline";

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const healthUrl = apiUrl.endsWith("/api")
        ? apiUrl.replace("/api", "/health")
        : `${apiUrl}/health`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10s timeout

      try {
        const response = await fetch(healthUrl, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const connection =
            (navigator as any).connection ||
            (navigator as any).mozConnection ||
            (navigator as any).webkitConnection;
          if (connection && connection.effectiveType) {
            const slowConnections = ["slow-2g", "2g", "3g"];
            return slowConnections.includes(connection.effectiveType)
              ? "slow"
              : "online";
          }
          return "online";
        }
        return "offline";
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        return "offline";
      }
    } catch (error) {
      return "offline";
    }
  }

  setupNetworkListeners(
    callback: (status: "online" | "offline" | "slow") => void,
  ) {
    window.addEventListener("online", () => callback("online"));
    window.addEventListener("offline", () => callback("offline"));

    // Monitor connection changes
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener("change", async () => {
        const status = await this.getNetworkStatus();
        callback(status);
      });
    }
  }

  async syncWhenOnline(): Promise<void> {
    if (this.isOnline()) {
      try {
        // Trigger a re-fetch of fresh data
        window.dispatchEvent(new CustomEvent("sync-data"));
        console.log("Sync triggered due to network restoration");
      } catch (error) {
        console.error("Sync failed:", error);
      }
    }
  }
}

export const offlineManager = new OfflineManager();
