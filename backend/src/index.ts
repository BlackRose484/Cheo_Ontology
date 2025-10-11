import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";
import { cheoCache } from "./services/cache/cacheService";

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

    // Initialize cache with pre-warming
    console.log("📚 Initializing cache system...");
    await cheoCache.preWarmCache();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log("🔥 Cache pre-warming completed - Ready for fast responses!");
      console.log(`📊 Cache stats:`, cheoCache.getStats());
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

function cleanup() {
  console.log("🧹 Cleaning up cache service...");
  cheoCache.destroy();
  console.log("✅ Cleanup completed");
  process.exit(0);
}

export default app;
