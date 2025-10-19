import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";
import { cacheAdapter, cacheStrategy } from "./services/cache/cacheAdapter";
import { redisCache } from "./services/cache/redisCacheService";
import { isCacheEnabled, logCacheStatus } from "./utils/cacheUtils";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize routes
router(app);

// Start server with conditional cache initialization
async function startServer() {
  try {
    console.log("🚀 Starting Chèo Ontology Server...");

    // Log cache status
    logCacheStatus();

    if (isCacheEnabled()) {
      console.log("🔧 Cache strategy: REDIS (Redis-only mode)");

      // Connect to Redis - Required when cache is enabled
      console.log("🔗 Connecting to Redis...");
      try {
        await redisCache.connect();
        console.log("✅ Redis connected successfully");
      } catch (error) {
        console.error("❌ Redis connection failed:", error);
        console.error(
          "💥 FATAL: Redis is required when cache is enabled, server cannot start without it"
        );
        process.exit(1); // Exit if Redis is not available
      }

      // Initialize Redis cache with pre-warming
      console.log("📚 Initializing Redis cache system...");
      await cacheAdapter.preWarmCache();
    } else {
      console.log("🔧 Cache strategy: DISABLED (Direct queries only)");
      console.log("⚠️ Running without cache - All queries will be direct");
    }

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);

      if (isCacheEnabled()) {
        console.log("🔥 Redis cache initialized - Ready for fast responses!");
        console.log("🕛 Daily cache refresh scheduled for midnight (0:00 AM)");
        console.log(
          "☁️  Redis cloud cache enabled - Persistent across restarts!"
        );
      } else {
        console.log("🚀 Running in direct query mode - No cache overhead!");
        console.log("💡 Set CACHE_ENABLED=true in .env to enable caching");
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);

    if (isCacheEnabled()) {
      console.error("💥 FATAL: Cannot start server with cache enabled");
    } else {
      console.error("💥 FATAL: Server startup failed");
    }
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
