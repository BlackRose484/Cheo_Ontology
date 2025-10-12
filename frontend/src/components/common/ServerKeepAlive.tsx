"use client";

import { useEffect } from "react";
import { useServiceWorkerKeepAlive } from "../../hooks/useServiceWorkerKeepAlive";

interface ServerKeepAliveProps {
  intervalMinutes?: number;
  enabled?: boolean;
}

export const ServerKeepAlive: React.FC<ServerKeepAliveProps> = ({
  intervalMinutes = 5, // 5 minutes for Render hosting (sleeps after 15 mins)
  enabled = true,
}) => {
  const { isSupported } = useServiceWorkerKeepAlive({
    intervalMinutes,
    enabled,
    backendUrl:
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://cheo-ontology.onrender.com",
  });

  useEffect(() => {
    if (enabled) {
      console.log("🚀 Server Keep-Alive initialized");
      if (isSupported) {
        console.log("✅ Using Service Worker for background keep-alive");
      } else {
        console.log("⚠️ Service Worker not supported, fallback needed");
      }
    }
  }, [enabled, isSupported]);

  // This component doesn't render anything - it's just for side effects
  return null;
};
