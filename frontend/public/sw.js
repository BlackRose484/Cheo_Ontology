// Service Worker for server keep-alive - Optimized for Render hosting
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes (Render sleeps after 15 mins of inactivity)
let BACKEND_URL = "https://cheo-ontology.onrender.com"; // Default to Render URL

let pingInterval = null;

// Function to ping server
async function pingServer() {
  const startTime = Date.now();

  try {
    console.log("🏓 Service Worker: Pinging server at", BACKEND_URL);
    const response = await fetch(`${BACKEND_URL}/ping`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();
      console.log(
        `✅ Service Worker: Server ping successful (${responseTime}ms):`,
        data.message
      );

      // Store last successful ping time
      self.lastSuccessfulPing = new Date().toISOString();
    } else {
      console.error(
        `❌ Service Worker: Server ping failed with status: ${response.status} (${responseTime}ms)`
      );
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(
      `❌ Service Worker: Server ping error (${responseTime}ms):`,
      error.message
    );
  }
}

// Start ping interval
function startPingInterval() {
  if (pingInterval) {
    clearInterval(pingInterval);
  }

  // Initial ping
  pingServer();

  // Set up recurring ping
  pingInterval = setInterval(pingServer, PING_INTERVAL);
  console.log(
    `⏰ Service Worker: Started server keep-alive (every ${
      PING_INTERVAL / 60000
    } minutes)`
  );
}

// Stop ping interval
function stopPingInterval() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log("🛑 Service Worker: Stopped server keep-alive");
  }
}

// Service Worker event handlers
self.addEventListener("install", (event) => {
  console.log("📦 Service Worker: Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activated");
  event.waitUntil(clients.claim());

  // Start ping interval when service worker becomes active
  startPingInterval();
});

// Handle messages from main thread
self.addEventListener("message", (event) => {
  const { type, data } = event.data;

  switch (type) {
    case "START_PING":
      startPingInterval();
      break;
    case "STOP_PING":
      stopPingInterval();
      break;
    case "UPDATE_CONFIG":
      if (data.backendUrl) {
        BACKEND_URL = data.backendUrl;
      }
      break;
    default:
      console.log("Service Worker: Unknown message type:", type);
  }
});

// Handle background sync (if browser supports it)
self.addEventListener("sync", (event) => {
  if (event.tag === "server-ping") {
    event.waitUntil(pingServer());
  }
});

// Keep service worker alive with periodic wake-up
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "server-keepalive") {
    event.waitUntil(pingServer());
  }
});

console.log("🔧 Service Worker: Loaded and ready for server keep-alive");
