import { cheoCache } from "./cacheService";
import { redisCache } from "./redisCacheService";
import { CachedQueryService } from "./cachedQueryService";
import RedisCachedQueryService from "./redisCachedQueryService";

export type CacheStrategy = "memory" | "redis";

export interface ICacheAdapter {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  has(key: string): Promise<boolean>;
  delete(key: string): Promise<number>;
  clear(): Promise<void>;
  getStats(): Promise<any>;
  getKeys(): Promise<string[]>;
  runCachedSPARQLQuery(
    sparql: string,
    customKey?: string,
    ttl?: number
  ): Promise<any[]>;
  preWarmCache(): Promise<void>;
  isPreWarmed(): Promise<boolean>;
  startAutoRefresh(): void;
  stopAutoRefresh(): void;
  refreshCache(): Promise<void>;
  destroy(): Promise<void>;
}

class MemoryCacheAdapter implements ICacheAdapter {
  async get<T>(key: string): Promise<T | undefined> {
    return cheoCache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return cheoCache.set(key, value, ttl);
  }

  async has(key: string): Promise<boolean> {
    return cheoCache.has(key);
  }

  async delete(key: string): Promise<number> {
    return cheoCache.delete(key);
  }

  async clear(): Promise<void> {
    cheoCache.clear();
  }

  async getStats(): Promise<any> {
    return cheoCache.getStats();
  }

  async getKeys(): Promise<string[]> {
    return cheoCache.getKeys();
  }

  async runCachedSPARQLQuery(
    sparql: string,
    customKey?: string,
    ttl?: number
  ): Promise<any[]> {
    return cheoCache.runCachedSPARQLQuery(sparql, customKey, ttl);
  }

  async preWarmCache(): Promise<void> {
    return cheoCache.preWarmCache();
  }

  async isPreWarmed(): Promise<boolean> {
    return cheoCache.isPreWarmed();
  }

  startAutoRefresh(): void {
    cheoCache.startAutoRefresh();
  }

  stopAutoRefresh(): void {
    cheoCache.stopAutoRefresh();
  }

  async refreshCache(): Promise<void> {
    return cheoCache.refreshCache();
  }

  async destroy(): Promise<void> {
    cheoCache.destroy();
  }
}

class RedisCacheAdapter implements ICacheAdapter {
  async get<T>(key: string): Promise<T | undefined> {
    return redisCache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return redisCache.set(key, value, ttl);
  }

  async has(key: string): Promise<boolean> {
    return redisCache.has(key);
  }

  async delete(key: string): Promise<number> {
    return redisCache.delete(key);
  }

  async clear(): Promise<void> {
    return redisCache.clear();
  }

  async getStats(): Promise<any> {
    return redisCache.getStats();
  }

  async getKeys(): Promise<string[]> {
    return redisCache.getKeys();
  }

  async runCachedSPARQLQuery(
    sparql: string,
    customKey?: string,
    ttl?: number
  ): Promise<any[]> {
    return redisCache.runCachedSPARQLQuery(sparql, customKey, ttl);
  }

  async preWarmCache(): Promise<void> {
    return redisCache.preWarmCache();
  }

  async isPreWarmed(): Promise<boolean> {
    return redisCache.isPreWarmed();
  }

  startAutoRefresh(): void {
    redisCache.startAutoRefresh();
  }

  stopAutoRefresh(): void {
    redisCache.stopAutoRefresh();
  }

  async refreshCache(): Promise<void> {
    return redisCache.refreshCache();
  }

  async destroy(): Promise<void> {
    return redisCache.destroy();
  }
}

export interface IQueryAdapter {
  getCharacterInformation(characterName: string): Promise<any[]>;
  getPlayInformation(playTitle: string): Promise<any[]>;
  getActorInformation(actorName: string): Promise<any[]>;
  getSceneInformation(sceneURI: string): Promise<any[]>;
  getAllCharacters(): Promise<any[]>;
  getAllPlays(): Promise<any[]>;
  getAllActors(): Promise<any[]>;
  getAllScenes(): Promise<any[]>;
  searchCharacters(query: string): Promise<any[]>;
  searchPlays(query: string): Promise<any[]>;
  searchActors(query: string): Promise<any[]>;
}

class MemoryQueryAdapter implements IQueryAdapter {
  async getCharacterInformation(characterName: string): Promise<any[]> {
    return CachedQueryService.getCharacterInformation(characterName);
  }

  async getPlayInformation(playTitle: string): Promise<any[]> {
    return CachedQueryService.getPlayInformation(playTitle);
  }

  async getActorInformation(actorName: string): Promise<any[]> {
    return CachedQueryService.getActorInformation(actorName);
  }

  async getSceneInformation(sceneURI: string): Promise<any[]> {
    return CachedQueryService.getSceneInformation(sceneURI);
  }

  async getAllCharacters(): Promise<any[]> {
    return CachedQueryService.getAllCharacters();
  }

  async getAllPlays(): Promise<any[]> {
    return CachedQueryService.getAllPlays();
  }

  async getAllActors(): Promise<any[]> {
    return CachedQueryService.getAllActors();
  }

  async getAllScenes(): Promise<any[]> {
    return CachedQueryService.getAllScenes();
  }

  async searchCharacters(query: string): Promise<any[]> {
    return CachedQueryService.searchCharacters(query);
  }

  async searchPlays(query: string): Promise<any[]> {
    return CachedQueryService.searchPlays(query);
  }

  async searchActors(query: string): Promise<any[]> {
    return CachedQueryService.searchActors(query);
  }
}

class RedisQueryAdapter implements IQueryAdapter {
  async getCharacterInformation(characterName: string): Promise<any[]> {
    return RedisCachedQueryService.getCharacterInformation(characterName);
  }

  async getPlayInformation(playTitle: string): Promise<any[]> {
    return RedisCachedQueryService.getPlayInformation(playTitle);
  }

  async getActorInformation(actorName: string): Promise<any[]> {
    return RedisCachedQueryService.getActorInformation(actorName);
  }

  async getSceneInformation(sceneURI: string): Promise<any[]> {
    return RedisCachedQueryService.getSceneInformation(sceneURI);
  }

  async getAllCharacters(): Promise<any[]> {
    return RedisCachedQueryService.getAllCharacters();
  }

  async getAllPlays(): Promise<any[]> {
    return RedisCachedQueryService.getAllPlays();
  }

  async getAllActors(): Promise<any[]> {
    return RedisCachedQueryService.getAllActors();
  }

  async getAllScenes(): Promise<any[]> {
    return RedisCachedQueryService.getAllScenes();
  }

  async searchCharacters(query: string): Promise<any[]> {
    return RedisCachedQueryService.searchCharacters(query);
  }

  async searchPlays(query: string): Promise<any[]> {
    return RedisCachedQueryService.searchPlays(query);
  }

  async searchActors(query: string): Promise<any[]> {
    return RedisCachedQueryService.searchActors(query);
  }
}

// Factory functions
function createCacheAdapter(strategy: CacheStrategy): ICacheAdapter {
  switch (strategy) {
    case "redis":
      return new RedisCacheAdapter();
    case "memory":
    default:
      return new MemoryCacheAdapter();
  }
}

function createQueryAdapter(strategy: CacheStrategy): IQueryAdapter {
  switch (strategy) {
    case "redis":
      return new RedisQueryAdapter();
    case "memory":
    default:
      return new MemoryQueryAdapter();
  }
}

// Get cache strategy from environment
function getCacheStrategy(): CacheStrategy {
  const strategy = process.env.CACHE_STRATEGY?.toLowerCase() as CacheStrategy;

  if (strategy === "redis" || strategy === "memory") {
    return strategy;
  }

  console.warn(
    `Invalid cache strategy: ${strategy}. Using 'memory' as fallback.`
  );
  return "memory";
}

// Create singleton instances based on environment
export const cacheStrategy = getCacheStrategy();
export const cacheAdapter = createCacheAdapter(cacheStrategy);
export const queryAdapter = createQueryAdapter(cacheStrategy);

console.log(`🔧 Cache strategy: ${cacheStrategy.toUpperCase()}`);

export default {
  cacheAdapter,
  queryAdapter,
  cacheStrategy,
};
