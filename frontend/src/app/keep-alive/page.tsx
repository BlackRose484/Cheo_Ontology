"use client";

import { useEffect } from "react";
import { useServiceWorkerKeepAlive } from "../../hooks/useServiceWorkerKeepAlive";
import { useServerKeepAlive } from "../../hooks/useServerKeepAlive";

/**
 * Hidden page for server keep-alive
 * This page can be used as a fallback or dedicated keep-alive endpoint
 * URL: /keep-alive
 */
export default function KeepAlivePage() {
  // Primary: Service Worker keep-alive (works in background)
  const { isSupported } = useServiceWorkerKeepAlive({
    intervalMinutes: 5, // Optimized for Render hosting
    enabled: true,
  });

  // Fallback: Regular hook keep-alive (only when page is active)
  useServerKeepAlive(5); // 5 minutes for Render

  useEffect(() => {
    console.log("🔄 Keep-Alive page loaded");
    console.log(`📱 Service Worker supported: ${isSupported}`);

    if (isSupported) {
      console.log("✅ Service Worker will handle background keep-alive");
    } else {
      console.log("⚠️ Using regular timer as fallback");
    }
  }, [isSupported]);

  return (
    <div
      style={{
        position: "fixed",
        top: "-9999px",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      {/* Hidden content for SEO/crawler purposes */}
      <div>
        <h1>Server Keep-Alive</h1>
        <p>This page maintains server connection</p>
        <p>Service Worker Active: {isSupported ? "Yes" : "No"}</p>
        <p>Last ping: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
