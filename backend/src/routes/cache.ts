import { Router } from "express";
import { CacheController } from "../controllers/cacheController";

const router = Router();

// Use Redis-only cache controller
router.get("/stats", CacheController.getStats);
router.get("/keys", CacheController.getCacheKeys);
router.get("/item/:key", CacheController.getCacheItem);
router.get("/refresh-info", CacheController.getRefreshInfo);
router.get("/test-redis", CacheController.testRedisConnection);
router.delete("/clear", CacheController.clearCache);
router.delete("/item/:key", CacheController.deleteCacheItem);
router.post("/rewarm", CacheController.reWarmCache);
router.post("/refresh", CacheController.refreshCache);
router.post("/manual-refresh", CacheController.manualCacheRefresh);
router.post("/auto-refresh/start", CacheController.startAutoRefresh);
router.post("/auto-refresh/stop", CacheController.stopAutoRefresh);
router.post("/auto-refresh/interval", CacheController.setAutoRefreshInterval);

export default router;
