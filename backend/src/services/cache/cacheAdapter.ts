import { redisCache } from "./redisCacheService";
import RedisCachedQueryService from "./redisCachedQueryService";

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

// Redis-only Cache Adapter
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

// Redis-only Query Adapter
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

// Create Redis-only instances
export const cacheAdapter = new RedisCacheAdapter();
export const queryAdapter = new RedisQueryAdapter();
export const cacheStrategy = "redis" as const;

console.log("🔧 Cache strategy: REDIS (Redis-only mode)");

export default {
  cacheAdapter,
  queryAdapter,
  cacheStrategy,
};
