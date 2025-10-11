import { Router } from "express";
import CacheController from "../controllers/cacheController";
import RedisCacheController from "../controllers/redisCacheController";

const router = Router();

// Use Redis controller if available, fallback to original
const controller =
  process.env.CACHE_STRATEGY === "redis"
    ? RedisCacheController
    : CacheController;

router.get("/stats", controller.getStats);
router.get("/keys", controller.getCacheKeys);
router.get("/item/:key", controller.getCacheItem);
router.get("/refresh-info", controller.getRefreshInfo);
router.get("/test-redis", RedisCacheController.testRedisConnection);
router.delete("/clear", controller.clearCache);
router.delete("/item/:key", controller.deleteCacheItem);
router.post("/rewarm", controller.reWarmCache);
router.post("/refresh", controller.refreshCache);
router.post("/auto-refresh/start", controller.startAutoRefresh);
router.post("/auto-refresh/stop", controller.stopAutoRefresh);
router.post("/auto-refresh/interval", controller.setAutoRefreshInterval);

export default router;
