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

// Start server with cache initialization
async function startServer() {
  try {
    console.log("🚀 Starting Chèo Ontology Server...");
    console.log(`🔧 Cache strategy: ${cacheStrategy.toUpperCase()}`);

    // Connect to Redis if using Redis strategy
    if (cacheStrategy === "redis") {
      console.log("🔗 Connecting to Redis...");
      try {
        await redisCache.connect();
        console.log("✅ Redis connected successfully");
      } catch (error) {
        console.error("❌ Redis connection failed:", error);
        console.log("⚠️  Falling back to memory cache...");
        process.env.CACHE_STRATEGY = "memory";
      }
    }

    // Initialize cache with pre-warming
    console.log("📚 Initializing cache system...");
    await cacheAdapter.preWarmCache();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log("🔥 Cache pre-warming completed - Ready for fast responses!");

      if (cacheStrategy === "redis") {
        console.log(
          "☁️  Redis cloud cache enabled - Persistent across restarts!"
        );
      } else {
        console.log("💾 Memory cache enabled - Will reset on restart");
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);

    // Start server without pre-warming if cache fails
    console.log("⚠️  Starting server without cache pre-warming...");
    app.listen(PORT, () => {
      console.log(
        `⚠️  Server is running on http://localhost:${PORT} (without cache)`
      );
    });
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
  console.log("🧹 Cleaning up cache service...");
  try {
    await cacheAdapter.destroy();
    console.log("✅ Cleanup completed");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
  }
  process.exit(0);
}

export default app;
