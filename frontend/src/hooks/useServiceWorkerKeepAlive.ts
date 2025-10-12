import { useEffect, useRef } from "react";

interface ServiceWorkerKeepAliveConfig {
  intervalMinutes?: number;
  backendUrl?: string;
  enabled?: boolean;
}

export const useServiceWorkerKeepAlive = (
  config: ServiceWorkerKeepAliveConfig = {}
) => {
  const {
    intervalMinutes = 5,
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://cheo-ontology.onrender.com",
    enabled = true,
  } = config;

  const swRef = useRef<ServiceWorker | null>(null);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  const registerServiceWorker = async () => {
    if (!("serviceWorker" in navigator)) {
      console.warn("⚠️ Service Worker not supported in this browser");
      return false;
    }

    try {
      console.log("📦 Registering Service Worker for server keep-alive...");

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      registrationRef.current = registration;

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      const sw =
        registration.active || registration.waiting || registration.installing;
      if (sw) {
        swRef.current = sw;

        // Send configuration to service worker
        sw.postMessage({
          type: "UPDATE_CONFIG",
          data: {
            backendUrl,
            intervalMinutes,
          },
        });

        // Start ping interval
        sw.postMessage({ type: "START_PING" });

        console.log("✅ Service Worker registered and keep-alive started");
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Service Worker registration failed:", error);
      return false;
    }
  };

  const unregisterServiceWorker = async () => {
    if (registrationRef.current) {
      try {
        // Stop ping before unregistering
        if (swRef.current) {
          swRef.current.postMessage({ type: "STOP_PING" });
        }

        await registrationRef.current.unregister();
        console.log("🗑️ Service Worker unregistered");

        swRef.current = null;
        registrationRef.current = null;
      } catch (error) {
        console.error("❌ Service Worker unregistration failed:", error);
      }
    }
  };

  const startKeepAlive = () => {
    if (swRef.current) {
      swRef.current.postMessage({ type: "START_PING" });
      console.log("▶️ Server keep-alive started via Service Worker");
    }
  };

  const stopKeepAlive = () => {
    if (swRef.current) {
      swRef.current.postMessage({ type: "STOP_PING" });
      console.log("⏹️ Server keep-alive stopped via Service Worker");
    }
  };

  useEffect(() => {
    if (!enabled) {
      console.log("🚫 Service Worker keep-alive is disabled");
      return;
    }

    // Register service worker on mount
    registerServiceWorker();

    // Cleanup on unmount
    return () => {
      // Don't unregister on unmount - we want it to persist!
      // Only stop if explicitly disabled
      console.log(
        "🔄 Component unmounted, but Service Worker keep-alive continues..."
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, backendUrl, intervalMinutes]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log(
          "👻 Page hidden - Service Worker continues keep-alive in background"
        );
      } else {
        console.log("👀 Page visible - Service Worker keep-alive running");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Handle browser tab/window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log(
        "🔄 Page unloading - Service Worker will continue keep-alive"
      );
      // Don't stop the service worker - let it continue in background
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    startKeepAlive,
    stopKeepAlive,
    unregisterServiceWorker,
    isSupported: "serviceWorker" in navigator,
  };
};
