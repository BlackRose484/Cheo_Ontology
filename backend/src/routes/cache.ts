import { Router } from "express";
import CacheController from "../controllers/cacheController";

const router = Router();

router.get("/stats", CacheController.getStats);
router.get("/keys", CacheController.getCacheKeys);
router.get("/item/:key", CacheController.getCacheItem);
router.get("/refresh-info", CacheController.getRefreshInfo);
router.delete("/clear", CacheController.clearCache);
router.delete("/item/:key", CacheController.deleteCacheItem);
router.post("/rewarm", CacheController.reWarmCache);
router.post("/refresh", CacheController.refreshCache);
router.post("/auto-refresh/start", CacheController.startAutoRefresh);
router.post("/auto-refresh/stop", CacheController.stopAutoRefresh);
router.post("/auto-refresh/interval", CacheController.setAutoRefreshInterval);

export default router;
