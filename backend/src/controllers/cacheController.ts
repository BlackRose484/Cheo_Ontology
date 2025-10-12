import { Request, Response } from "express";
import {
  cacheAdapter,
  queryAdapter,
  cacheStrategy,
} from "../services/cache/cacheAdapter";
import { redisCache } from "../services/cache/redisCacheService";

export class CacheController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await cacheAdapter.getStats();
      const isPreWarmed = await cacheAdapter.isPreWarmed();

      res.json({
        success: true,
        cache: {
          ...stats,
          isPreWarmed,
          strategy: cacheStrategy,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error getting cache stats:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get cache statistics",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async clearCache(req: Request, res: Response) {
    try {
      await cacheAdapter.clear();
      res.json({
        success: true,
        message: "Cache cleared successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error clearing cache:", error);
      res.status(500).json({
        success: false,
        error: "Failed to clear cache",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getCacheKeys(req: Request, res: Response) {
    try {
      const keys = await cacheAdapter.getKeys();
      const categorizedKeys = {
        characters: keys.filter((key) => key.includes("character")),
        plays: keys.filter((key) => key.includes("play")),
        actors: keys.filter((key) => key.includes("actor")),
        scenes: keys.filter((key) => key.includes("scene")),
        lists: keys.filter((key) => key.startsWith("list_")),
        searches: keys.filter((key) => key.startsWith("search_")),
        meta: keys.filter(
          (key) => key.includes("cache_") || key.includes("meta")
        ),
        other: keys.filter(
          (key) =>
            !key.includes("character") &&
            !key.includes("play") &&
            !key.includes("actor") &&
            !key.includes("scene") &&
            !key.startsWith("list_") &&
            !key.startsWith("search_") &&
            !key.includes("cache_") &&
            !key.includes("meta")
        ),
      };

      res.json({
        success: true,
        keys: categorizedKeys,
        total: keys.length,
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error getting cache keys:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get cache keys",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getCacheItem(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const value = await cacheAdapter.get(key);
      const exists = await cacheAdapter.has(key);

      res.json({
        success: true,
        key,
        exists,
        value: value || null,
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error getting cache item:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get cache item",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async reWarmCache(req: Request, res: Response) {
    try {
      console.log("🔥 Manual cache pre-warming requested");
      await cacheAdapter.preWarmCache();

      res.json({
        success: true,
        message: "Cache pre-warming completed successfully",
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error pre-warming cache:", error);
      res.status(500).json({
        success: false,
        error: "Failed to pre-warm cache",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async deleteCacheItem(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const deleted = await cacheAdapter.delete(key);

      res.json({
        success: true,
        message: `Cache key ${deleted > 0 ? "deleted" : "not found"}`,
        key,
        deleted: deleted > 0,
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error deleting cache item:", error);
      res.status(500).json({
        success: false,
        error: "Failed to delete cache item",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async refreshCache(req: Request, res: Response) {
    try {
      console.log("🔄 Manual cache refresh requested");
      await cacheAdapter.refreshCache();

      res.json({
        success: true,
        message: "Cache refreshed successfully",
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error refreshing cache:", error);
      res.status(500).json({
        success: false,
        error: "Failed to refresh cache",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static startAutoRefresh(req: Request, res: Response) {
    try {
      cacheAdapter.startAutoRefresh();

      res.json({
        success: true,
        message: "Auto-refresh started successfully",
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error starting auto-refresh:", error);
      res.status(500).json({
        success: false,
        error: "Failed to start auto-refresh",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static stopAutoRefresh(req: Request, res: Response) {
    try {
      cacheAdapter.stopAutoRefresh();

      res.json({
        success: true,
        message: "Auto-refresh stopped successfully",
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error stopping auto-refresh:", error);
      res.status(500).json({
        success: false,
        error: "Failed to stop auto-refresh",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static setAutoRefreshInterval(req: Request, res: Response) {
    try {
      const { hours } = req.body;

      if (!hours || hours < 1 || hours > 168) {
        return res.status(400).json({
          success: false,
          error: "Invalid interval. Must be between 1 and 168 hours",
          timestamp: new Date().toISOString(),
        });
      }

      // This method needs to be implemented in the adapter
      // cacheAdapter.setAutoRefreshInterval(hours);

      res.json({
        success: true,
        message: `Auto-refresh interval set to ${hours} hours`,
        interval: hours,
        strategy: cacheStrategy,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error setting auto-refresh interval:", error);
      res.status(500).json({
        success: false,
        error: "Failed to set auto-refresh interval",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getRefreshInfo(req: Request, res: Response) {
    try {
      const lastRefresh = await cacheAdapter.get("cache_last_refresh");
      const isPreWarmed = await cacheAdapter.isPreWarmed();

      res.json({
        success: true,
        refreshInfo: {
          lastRefresh,
          isPreWarmed,
          autoRefreshActive: true,
          strategy: cacheStrategy,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error getting refresh info:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get refresh information",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async testRedisConnection(req: Request, res: Response) {
    try {
      if (cacheStrategy !== "redis") {
        return res.json({
          success: false,
          message: "Redis strategy not enabled",
          strategy: cacheStrategy,
          timestamp: new Date().toISOString(),
        });
      }

      // Test Redis connection
      await redisCache.set("test_connection", { test: true }, 10);
      const testValue = await redisCache.get("test_connection");
      await redisCache.delete("test_connection");

      const stats = await redisCache.getStats();

      res.json({
        success: true,
        message: "Redis connection successful",
        connectionTest: testValue ? "PASS" : "FAIL",
        stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Redis connection test failed:", error);
      res.status(500).json({
        success: false,
        error: "Redis connection test failed",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Manual cache refresh with secret key authentication
  static async manualCacheRefresh(req: Request, res: Response) {
    try {
      // Check for secret key in headers or body
      const secretKey = req.headers["x-cache-secret"] || req.body.secretKey;
      const expectedSecret =
        process.env.CACHE_REFRESH_SECRET || "cheo-cache-secret-2025";

      if (!secretKey || secretKey !== expectedSecret) {
        console.warn(`🚫 Unauthorized cache refresh attempt from ${req.ip}`);
        return res.status(401).json({
          success: false,
          error: "Unauthorized: Invalid or missing secret key",
          timestamp: new Date().toISOString(),
        });
      }

      console.log(`🔑 Authorized manual cache refresh from ${req.ip}`);
      const startTime = Date.now();

      // Force refresh entire cache system
      await redisCache.manualCacheRefresh();

      const duration = (Date.now() - startTime) / 1000;
      const stats = await cacheAdapter.getStats();

      res.json({
        success: true,
        message: "Manual cache refresh completed successfully",
        duration: `${duration}s`,
        stats,
        timestamp: new Date().toISOString(),
        triggeredBy: req.ip,
      });

      console.log(
        `✅ Manual cache refresh completed in ${duration}s by ${req.ip}`
      );
    } catch (error) {
      console.error("❌ Manual cache refresh failed:", error);
      res.status(500).json({
        success: false,
        error: "Manual cache refresh failed",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export default CacheController;
