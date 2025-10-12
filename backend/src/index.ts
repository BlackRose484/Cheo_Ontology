import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";
import { cacheAdapter, cacheStrategy } from "./services/cache/cacheAdapter";
import { redisCache } from "./services/cache/redisCacheService";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize routes
router(app);

// Start server with Redis-only cache initialization
async function startServer() {
  try {
    console.log("🚀 Starting Chèo Ontology Server...");
    console.log("🔧 Cache strategy: REDIS (Redis-only mode)");

    // Connect to Redis - Required, no fallback
    console.log("🔗 Connecting to Redis...");
    try {
      await redisCache.connect();
      console.log("✅ Redis connected successfully");
    } catch (error) {
      console.error("❌ Redis connection failed:", error);
      console.error(
        "💥 FATAL: Redis is required, server cannot start without it"
      );
      process.exit(1); // Exit if Redis is not available
    }

    // Initialize Redis cache with pre-warming
    console.log("📚 Initializing Redis cache system...");
    await cacheAdapter.preWarmCache();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log("🔥 Redis cache initialized - Ready for fast responses!");
      console.log("🕛 Daily cache refresh scheduled for midnight (0:00 AM)");
      console.log(
        "☁️  Redis cloud cache enabled - Persistent across restarts!"
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    console.error("💥 FATAL: Cannot start server without Redis cache");
    process.exit(1); // Exit completely if Redis cache fails
  }
}

// Start the server
startServer();

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Received SIGINT. Graceful shutdown...");
  cleanup();
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Received SIGTERM. Graceful shutdown...");
  cleanup();
});

async function cleanup() {
  console.log("🧹 Cleaning up Redis cache service...");
  try {
    await redisCache.destroy();
    console.log("✅ Redis cleanup completed");
  } catch (error) {
    console.error("❌ Redis cleanup failed:", error);
  }
  process.exit(0);
}

export default app;
