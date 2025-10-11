import { Request, Response } from "express";
import { cheoCache } from "../services/cache/cacheService";

export class CacheController {
  static getStats(req: Request, res: Response) {
    try {
      const stats = cheoCache.getStats();
      const isPreWarmed = cheoCache.isPreWarmed();

      res.json({
        success: true,
        cache: {
          ...stats,
          isPreWarmed,
          keys: cheoCache.getKeys().length,
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

  static clearCache(req: Request, res: Response) {
    try {
      cheoCache.clear();
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

  static getCacheKeys(req: Request, res: Response) {
    try {
      const keys = cheoCache.getKeys();
      const categorizedKeys = {
        total: keys.length,
        sparql: keys.filter((key) => key.startsWith("sparql_")).length,
        characters: keys.filter((key) => key.startsWith("character_")).length,
        plays: keys.filter((key) => key.startsWith("play_")).length,
        actors: keys.filter((key) => key.startsWith("actor_")).length,
        scenes: keys.filter((key) => key.startsWith("scene_")).length,
        search: keys.filter((key) => key.startsWith("search_")).length,
        prewarmed: keys.filter((key) => key.startsWith("all_")).length,
        other: keys.filter(
          (key) =>
            !key.match(/^(sparql_|character_|play_|actor_|scene_|search_|all_)/)
        ).length,
      };

      res.json({
        success: true,
        keys: categorizedKeys,
        allKeys: keys,
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

  static async reWarmCache(req: Request, res: Response) {
    try {
      console.log("🔄 Re-warming cache requested...");
      await cheoCache.preWarmCache();

      res.json({
        success: true,
        message: "Cache re-warmed successfully",
        stats: cheoCache.getStats(),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error re-warming cache:", error);
      res.status(500).json({
        success: false,
        error: "Failed to re-warm cache",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static getCacheItem(req: Request, res: Response) {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          success: false,
          error: "Cache key is required",
        });
      }

      const value = cheoCache.get(key);

      if (value === undefined) {
        return res.status(404).json({
          success: false,
          error: "Cache key not found",
        });
      }

      res.json({
        success: true,
        key,
        value,
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

  static deleteCacheItem(req: Request, res: Response) {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          success: false,
          error: "Cache key is required",
        });
      }

      const deleted = cheoCache.delete(key);

      res.json({
        success: true,
        message: `Cache key ${deleted > 0 ? "deleted" : "not found"}`,
        key,
        deleted: deleted > 0,
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
      await cheoCache.refreshCache();

      res.json({
        success: true,
        message: "Cache refreshed successfully",
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
      cheoCache.startAutoRefresh();

      res.json({
        success: true,
        message: "Auto-refresh started successfully",
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
      cheoCache.stopAutoRefresh();

      res.json({
        success: true,
        message: "Auto-refresh stopped successfully",
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
        // Max 1 week
        return res.status(400).json({
          success: false,
          error: "Invalid interval. Must be between 1 and 168 hours",
          timestamp: new Date().toISOString(),
        });
      }

      cheoCache.setAutoRefreshInterval(hours);

      res.json({
        success: true,
        message: `Auto-refresh interval set to ${hours} hours`,
        interval: hours,
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

  static getRefreshInfo(req: Request, res: Response) {
    try {
      const lastRefresh = cheoCache.getLastRefreshInfo();
      const isPreWarmed = cheoCache.isPreWarmed();

      res.json({
        success: true,
        refreshInfo: {
          lastRefresh,
          isPreWarmed,
          autoRefreshActive: true, // Assuming it's active if service is running
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
}

export default CacheController;
