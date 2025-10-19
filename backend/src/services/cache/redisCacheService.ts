import { createClient, RedisClientType } from "redis";
import { runSPARQLQuery } from "../../utils/graphdb";

export interface RedisCacheConfig {
  host: string;
  port: number;
  password?: string;
  username?: string;
  db?: number;
  ttl?: number;
  tls?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface CacheStats {
  keys: number;
  hits: number;
  misses: number;
  hitRate: number;
  memoryUsage?: string;
  connected: boolean;
}

export class RedisCacheService {
  private client: RedisClientType;
  private hits: number = 0;
  private misses: number = 0;
  private autoRefreshTimer: NodeJS.Timeout | null = null;
  private dailyRefreshTimer: NodeJS.Timeout | null = null;
  private autoRefreshInterval: number = 24 * 60 * 60 * 1000; // 24 hours for fallback
  private config: RedisCacheConfig;
  private connected: boolean = false;

  constructor(config: RedisCacheConfig) {
    this.config = config;
    this.client = this.createRedisClient();
    this.setupEventHandlers();
  }

  private createRedisClient(): RedisClientType {
    const clientConfig: any = {
      socket: {
        host: this.config.host,
        port: this.config.port,
        reconnectDelay: this.config.retryDelay || 1000,
        maxRetriesPerRequest: this.config.retryAttempts || 3,
        // Redis optimizations
        keepAlive: true,
        family: 4, // Force IPv4
        connectTimeout: 10000, // 10s timeout
        commandTimeout: 5000, // 5s command timeout
      },
      database: this.config.db || 0,
      // Additional Redis optimizations
      pingInterval: 30000, // 30s ping to keep connection alive
      lazyConnect: false, // Connect immediately
    };

    if (this.config.password) {
      clientConfig.password = this.config.password;
    }

    if (this.config.username && this.config.username !== "default") {
      clientConfig.username = this.config.username;
    }

    // TLS configuration with better error handling
    if (this.config.tls) {
      clientConfig.socket.tls = {
        rejectUnauthorized: false, // Allow self-signed certificates
        secureProtocol: "TLSv1_2_method", // Specific TLS version
      };
    }

    return createClient(clientConfig);
  }

  private setupEventHandlers(): void {
    this.client.on("ready", () => {
      console.log("✅ Redis connected");
      this.connected = true;
    });

    this.client.on("error", (err) => {
      console.error("❌ Redis error:", err);
      this.connected = false;
    });

    this.client.on("end", () => {
      this.connected = false;
    });
  }

  async connect(): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }
    } catch (error) {
      // Try fallback without TLS if TLS was enabled
      if (
        this.config.tls &&
        error instanceof Error &&
        error.message.includes("SSL")
      ) {
        try {
          // Disconnect current client
          if (this.client.isOpen) {
            await this.client.disconnect();
          }

          // Create new client without TLS
          const fallbackConfig = { ...this.config, tls: false };
          this.config = fallbackConfig;
          this.client = this.createRedisClient();
          this.setupEventHandlers();

          await this.client.connect();
          console.log("✅ Redis connected without TLS");
          return;
        } catch (fallbackError) {
          console.error("❌ Fallback connection failed:", fallbackError);
        }
      }

      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      this.stopAutoRefresh();
      if (this.client.isOpen) {
        await this.client.disconnect();
      }
      this.connected = false;
    } catch (error) {
      console.error("❌ Error disconnecting from Redis:", error);
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      if (!this.connected) {
        this.misses++;
        return undefined;
      }

      const value = await this.client.get(this.prefixKey(key));

      if (value !== null) {
        this.hits++;
        return JSON.parse(value) as T;
      } else {
        this.misses++;
        return undefined;
      }
    } catch (error) {
      console.error(`❌ Redis GET error for key ${key}:`, error);
      this.misses++;
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      if (!this.connected) {
        return false;
      }

      const serializedValue = JSON.stringify(value);
      const prefixedKey = this.prefixKey(key);
      const ttlSeconds = ttl || this.config.ttl || 3600;

      await this.client.setEx(prefixedKey, ttlSeconds, serializedValue);
      return true;
    } catch (error) {
      console.error(`❌ Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      if (!this.connected) return false;

      const exists = await this.client.exists(this.prefixKey(key));
      return exists === 1;
    } catch (error) {
      console.error(`❌ Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  async delete(key: string): Promise<number> {
    try {
      if (!this.connected) return 0;

      return await this.client.del(this.prefixKey(key));
    } catch (error) {
      console.error(`❌ Redis DEL error for key ${key}:`, error);
      return 0;
    }
  }

  async clear(): Promise<void> {
    try {
      if (!this.connected) return;

      const pattern = this.prefixKey("*");
      const keys = await this.client.keys(pattern);

      if (keys.length > 0) {
        await this.client.del(keys);
      }

      this.hits = 0;
      this.misses = 0;
    } catch (error) {
      console.error("❌ Redis CLEAR error:", error);
    }
  }

  async getStats(): Promise<CacheStats> {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;

    let keys = 0;
    let memoryUsage = undefined;

    try {
      if (this.connected) {
        const pattern = this.prefixKey("*");
        const keyList = await this.client.keys(pattern);
        keys = keyList.length;

        const info = await this.client.info("memory");
        const memMatch = info.match(/used_memory_human:(.+)/);
        if (memMatch) {
          memoryUsage = memMatch[1].trim();
        }
      }
    } catch (error) {
      console.error("❌ Error getting Redis stats:", error);
    }

    return {
      keys,
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage,
      connected: this.connected,
    };
  }

  async getKeys(): Promise<string[]> {
    try {
      if (!this.connected) return [];

      const pattern = this.prefixKey("*");
      const keys = await this.client.keys(pattern);
      return keys.map((key) => key.replace(this.getKeyPrefix(), ""));
    } catch (error) {
      console.error("❌ Error getting Redis keys:", error);
      return [];
    }
  }

  // Schedule daily cache refresh at midnight (0:00 AM)
  startDailyRefresh(): void {
    if (this.dailyRefreshTimer) {
      return;
    }

    // Calculate time until next midnight
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0); // Set to next midnight

    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    console.log(`🕛 Daily cache refresh scheduled for midnight`);

    // Set initial timer to next midnight
    this.dailyRefreshTimer = setTimeout(async () => {
      try {
        await this.forceCacheRefresh();

        // Schedule recurring daily refresh every 24 hours
        this.dailyRefreshTimer = setInterval(async () => {
          await this.forceCacheRefresh();
        }, 24 * 60 * 60 * 1000); // 24 hours
      } catch (error) {
        console.error("❌ Daily cache refresh failed:", error);
      }
    }, msUntilMidnight);
  }

  stopDailyRefresh(): void {
    if (this.dailyRefreshTimer) {
      clearTimeout(this.dailyRefreshTimer);
      clearInterval(this.dailyRefreshTimer);
      this.dailyRefreshTimer = null;
    }
  }

  // Public method for manual cache refresh
  async manualCacheRefresh(): Promise<void> {
    await this.forceCacheRefresh();
  }

  // Clear all cache keys with pattern matching
  async clearAll(): Promise<void> {
    if (!this.connected) {
      console.log("⚠️ Redis not connected, skipping cache clear");
      return;
    }

    try {
      console.log("🧹 Clearing all cache entries...");

      // Get all keys with our prefix
      const pattern = this.prefixKey("*");
      const keys = await this.client.keys(pattern);

      if (keys.length > 0) {
        await this.client.del(keys);
        console.log(`✅ Cleared ${keys.length} cache entries`);
      } else {
        console.log("ℹ️ No cache entries to clear");
      }
    } catch (error) {
      console.error("❌ Error clearing cache:", error);
      throw error;
    }
  }

  // Force cache refresh without checking expiry
  private async forceCacheRefresh(): Promise<void> {
    console.log("🔄 Force refreshing cache...");
    const startTime = Date.now();

    try {
      // Execute the optimized cache refresh (without clearing existing cache)
      await this.preWarmCacheOptimized();

      const duration = (Date.now() - startTime) / 1000;
      console.log(`✅ Force cache refresh completed in ${duration}s`);
    } catch (error) {
      console.error("❌ Force cache refresh failed:", error);
      throw error;
    }
  }

  startAutoRefresh(): void {
    if (this.autoRefreshTimer) {
      console.log("🔄 Auto-refresh is already running");
      return;
    }

    console.log(
      `🕒 Starting auto-refresh every ${
        this.autoRefreshInterval / 1000 / 60 / 60
      } hours`
    );

    this.autoRefreshTimer = setInterval(async () => {
      try {
        console.log("🔄 Auto-refresh triggered - refreshing cache...");
        await this.refreshCache();
        console.log("✅ Auto-refresh completed successfully");
      } catch (error) {
        console.error("❌ Auto-refresh failed:", error);
      }
    }, this.autoRefreshInterval);
  }

  stopAutoRefresh(): void {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
      console.log("⏹️ Auto-refresh stopped");
    }

    // Also stop daily refresh
    this.stopDailyRefresh();
  }

  async refreshCache(): Promise<void> {
    console.log("🔄 Starting cache refresh...");
    const startTime = Date.now();

    // Only pre-warm cache without clearing existing data
    await this.preWarmCache();

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`✅ Cache refresh completed in ${duration}ms`);

    await this.set(
      "cache_last_refresh",
      {
        timestamp: new Date(),
        duration: duration,
      },
      86400
    );
  }

  async getLastRefreshInfo(): Promise<{
    timestamp: Date;
    duration: number;
  } | null> {
    return (
      (await this.get<{ timestamp: Date; duration: number }>(
        "cache_last_refresh"
      )) || null
    );
  }

  setAutoRefreshInterval(hours: number): void {
    this.autoRefreshInterval = hours * 60 * 60 * 1000;

    if (this.autoRefreshTimer) {
      this.stopAutoRefresh();
      this.startAutoRefresh();
    }

    console.log(`⏱️ Auto-refresh interval updated to ${hours} hours`);
  }

  private generateCacheKey(sparql: string): string {
    const normalized = sparql.replace(/\s+/g, " ").trim().toLowerCase();

    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return `sparql_${Math.abs(hash)}`;
  }

  async runCachedSPARQLQuery(
    sparql: string,
    customKey?: string,
    ttl?: number
  ): Promise<any[]> {
    const cacheKey = customKey || this.generateCacheKey(sparql);

    const cached = await this.get<any[]>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    console.log(`💾 Cache MISS: ${cacheKey} - executing SPARQL query`);
    try {
      const results = await runSPARQLQuery(sparql);
      await this.set(cacheKey, results, ttl);
      return results;
    } catch (error) {
      console.error(`❌ SPARQL query failed for key ${cacheKey}:`, error);
      throw error;
    }
  }

  // Redis-specific bulk operations for better performance
  async setMultiple<T>(
    entries: Array<{ key: string; value: T; ttl?: number }>
  ): Promise<void> {
    if (!this.connected) return;

    try {
      const pipeline = this.client.multi();

      for (const { key, value, ttl } of entries) {
        const serializedValue = JSON.stringify(value);
        const prefixedKey = this.prefixKey(key);

        if (ttl && ttl > 0) {
          pipeline.setEx(prefixedKey, ttl, serializedValue);
        } else if (this.config.ttl && this.config.ttl > 0) {
          pipeline.setEx(prefixedKey, this.config.ttl, serializedValue);
        } else {
          pipeline.set(prefixedKey, serializedValue);
        }
      }

      await pipeline.exec();
      console.log(`📦 Bulk set ${entries.length} Redis keys`);
    } catch (error) {
      console.error("❌ Redis bulk SET error:", error);
    }
  }

  async getMultiple<T>(keys: string[]): Promise<Map<string, T | undefined>> {
    const result = new Map<string, T | undefined>();

    if (!this.connected || keys.length === 0) {
      keys.forEach((key) => result.set(key, undefined));
      return result;
    }

    try {
      const prefixedKeys = keys.map((key) => this.prefixKey(key));
      const values = await this.client.mGet(prefixedKeys);

      keys.forEach((key, index) => {
        const value = values[index];
        if (value !== null) {
          try {
            result.set(key, JSON.parse(value) as T);
            this.hits++;
          } catch (error) {
            console.error(`❌ JSON parse error for key ${key}:`, error);
            result.set(key, undefined);
            this.misses++;
          }
        } else {
          result.set(key, undefined);
          this.misses++;
        }
      });

      console.log(`📦 Bulk get ${keys.length} Redis keys`);
    } catch (error) {
      console.error("❌ Redis bulk GET error:", error);
      keys.forEach((key) => result.set(key, undefined));
    }

    return result;
  }

  // Enhanced cache warming with Redis optimizations
  async preWarmCacheOptimized(): Promise<void> {
    console.log("🚀 Starting optimized Redis cache pre-warming...");

    const shouldPreWarm = await this.shouldPreWarmCache();
    if (!shouldPreWarm) {
      console.log("✅ Cache is already up-to-date, skipping pre-warming");
      return;
    }

    console.log("🔥 Cache needs refresh, proceeding with pre-warming...");

    const startTime = Date.now();

    try {
      // Prepare all SPARQL queries for batch execution
      const cacheEntries = await this.prepareAllCacheEntries();

      // Use Redis pipeline for bulk operations
      await this.setMultiple(cacheEntries);

      // Set metadata
      await this.set("cache_metadata", {
        lastPreWarmed: new Date().toISOString(),
        version: "1.0",
        totalQueries: cacheEntries.length,
      });

      const duration = (Date.now() - startTime) / 1000;
      console.log(`✅ Redis cache pre-warming completed in ${duration}s`);
      console.log(`📊 Cached ${cacheEntries.length} queries`);
    } catch (error) {
      console.error("❌ Error during Redis cache pre-warming:", error);
      throw error;
    }
  }

  private async prepareAllCacheEntries(): Promise<
    Array<{ key: string; value: any; ttl?: number }>
  > {
    const entries: Array<{ key: string; value: any; ttl?: number }> = [];

    // Import the cached query service to ensure we use the same logic
    const RedisCachedQueryService = (await import("./redisCachedQueryService"))
      .default;

    console.log(`� Starting COMPREHENSIVE cache preparation...`);
    const startTime = Date.now();

    try {
      // PHASE 1: Cache all basic list queries (foundation data)
      console.log(`🔄 PHASE 1: Caching basic list queries...`);
      const basicQueries = [
        {
          key: "list_characters",
          method: () => RedisCachedQueryService.getAllCharacters(),
          description: "All characters list",
        },
        {
          key: "list_plays",
          method: () => RedisCachedQueryService.getAllPlays(),
          description: "All plays list",
        },
        {
          key: "list_actors",
          method: () => RedisCachedQueryService.getAllActors(),
          description: "All actors list",
        },
        {
          key: "list_scenes",
          method: () => RedisCachedQueryService.getAllScenes(),
          description: "All scenes list",
        },
      ];

      let basicQueryCount = 0;
      for (const { key, method, description } of basicQueries) {
        try {
          console.log(`   Executing: ${description}...`);
          const results = await method();
          entries.push({
            key,
            value: results,
            ttl: this.config.ttl || 24 * 60 * 60,
          });
          console.log(
            `   ✅ ${key}: ${Array.isArray(results) ? results.length : 0} items`
          );
          basicQueryCount++;
        } catch (error) {
          console.error(`   ❌ Failed to cache ${key}:`, error);
        }
      }
      console.log(
        `📊 PHASE 1 Complete: ${basicQueryCount}/4 basic queries cached`
      );

      // PHASE 2: Cache ALL individual character information
      console.log(`🔄 PHASE 2: Caching individual character information...`);
      let characterCacheCount = 0;
      try {
        const characters = await RedisCachedQueryService.getAllCharacters();
        console.log(`   Found ${characters.length} characters to cache...`);

        for (let i = 0; i < characters.length; i++) {
          const char = characters[i];
          try {
            // Extract character name with multiple fallbacks
            let charName = null;
            if (char.name) {
              charName =
                typeof char.name === "object" && char.name.value
                  ? char.name.value
                  : char.name;
            } else if (char.charName) {
              charName =
                typeof char.charName === "object" && char.charName.value
                  ? char.charName.value
                  : char.charName;
            }

            if (charName && typeof charName === "string" && charName.trim()) {
              const cleanName = charName.trim();
              console.log(
                `   [${i + 1}/${
                  characters.length
                }] Caching character: ${cleanName}`
              );

              const info =
                await RedisCachedQueryService.getCharacterInformation(
                  cleanName
                );
              const cacheKey = `character_info_${cleanName
                .toLowerCase()
                .replace(/\s+/g, "_")}`;

              entries.push({
                key: cacheKey,
                value: info,
                ttl: this.config.ttl || 24 * 60 * 60,
              });
              characterCacheCount++;
            }
          } catch (error) {
            console.error(`   ❌ Failed to cache character ${i + 1}:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Error in character caching phase:`, error);
      }
      console.log(
        `📊 PHASE 2 Complete: ${characterCacheCount} character detail entries cached`
      );

      // PHASE 3: Cache ALL individual play information
      console.log(`🔄 PHASE 3: Caching individual play information...`);
      let playCacheCount = 0;
      try {
        const plays = await RedisCachedQueryService.getAllPlays();
        console.log(`   Found ${plays.length} plays to cache...`);

        for (let i = 0; i < plays.length; i++) {
          const play = plays[i];
          try {
            // Extract play title with multiple fallbacks
            let playTitle = null;
            if (play.title) {
              playTitle =
                typeof play.title === "object" && play.title.value
                  ? play.title.value
                  : play.title;
            } else if (play.name) {
              playTitle =
                typeof play.name === "object" && play.name.value
                  ? play.name.value
                  : play.name;
            }

            if (
              playTitle &&
              typeof playTitle === "string" &&
              playTitle.trim()
            ) {
              const cleanTitle = playTitle.trim();
              const info = await RedisCachedQueryService.getPlayInformation(
                cleanTitle
              );
              const cacheKey = `play_info_${cleanTitle
                .toLowerCase()
                .replace(/\s+/g, "_")}`;

              entries.push({
                key: cacheKey,
                value: info,
                ttl: this.config.ttl || 24 * 60 * 60,
              });
              playCacheCount++;
            }
          } catch (error) {
            console.error(`   ❌ Failed to cache play ${i + 1}:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Error in play caching phase:`, error);
      }
      console.log(
        `📊 PHASE 3 Complete: ${playCacheCount} play detail entries cached`
      );

      // PHASE 4: Cache ALL individual actor information
      console.log(`🔄 PHASE 4: Caching individual actor information...`);
      let actorCacheCount = 0;
      try {
        const actors = await RedisCachedQueryService.getAllActors();
        console.log(`   Found ${actors.length} actors to cache...`);

        for (let i = 0; i < actors.length; i++) {
          const actor = actors[i];
          try {
            // Extract actor name with multiple fallbacks
            let actorName = null;
            if (actor.actorName) {
              actorName =
                typeof actor.actorName === "object" && actor.actorName.value
                  ? actor.actorName.value
                  : actor.actorName;
            } else if (actor.name) {
              actorName =
                typeof actor.name === "object" && actor.name.value
                  ? actor.name.value
                  : actor.name;
            }

            if (
              actorName &&
              typeof actorName === "string" &&
              actorName.trim()
            ) {
              const cleanName = actorName.trim();

              const info = await RedisCachedQueryService.getActorInformation(
                cleanName
              );
              const cacheKey = `actor_info_${cleanName
                .toLowerCase()
                .replace(/\s+/g, "_")}`;

              entries.push({
                key: cacheKey,
                value: info,
                ttl: this.config.ttl || 24 * 60 * 60,
              });
              actorCacheCount++;
            }
          } catch (error) {
            console.error(`   ❌ Failed to cache actor ${i + 1}:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Error in actor caching phase:`, error);
      }
      console.log(
        `📊 PHASE 4 Complete: ${actorCacheCount} actor detail entries cached`
      );

      // PHASE 5: Cache ALL individual scene information
      console.log(`🔄 PHASE 5: Caching individual scene information...`);
      let sceneCacheCount = 0;
      try {
        const scenes = await RedisCachedQueryService.getAllScenes();
        console.log(`   Found ${scenes.length} scenes to cache...`);

        for (let i = 0; i < scenes.length; i++) {
          const scene = scenes[i];
          try {
            // Extract scene URI with multiple fallbacks
            let sceneURI = scene.scene || scene.uri || scene.sceneURI;

            if (sceneURI && typeof sceneURI === "string" && sceneURI.trim()) {
              const cleanURI = sceneURI.trim();

              const info = await RedisCachedQueryService.getSceneInformation(
                cleanURI
              );
              const cacheKey = `scene_info_${encodeURIComponent(cleanURI)}`;

              entries.push({
                key: cacheKey,
                value: info,
                ttl: this.config.ttl || 24 * 60 * 60,
              });
              sceneCacheCount++;
            }
          } catch (error) {
            console.error(`   ❌ Failed to cache scene ${i + 1}:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Error in scene caching phase:`, error);
      }
      console.log(
        `📊 PHASE 5 Complete: ${sceneCacheCount} scene detail entries cached`
      );

      // FINAL SUMMARY
      const duration = (Date.now() - startTime) / 1000;
      const totalDetailEntries =
        characterCacheCount +
        playCacheCount +
        actorCacheCount +
        sceneCacheCount;

      console.log(`🎉 COMPREHENSIVE CACHE PREPARATION COMPLETE!`);
      console.log(`⏱️  Total time: ${duration.toFixed(2)}s`);
      console.log(`📊 FINAL BREAKDOWN:`);
      console.log(`   • Basic lists: ${basicQueryCount}/4`);
      console.log(`   • Character details: ${characterCacheCount}`);
      console.log(`   • Play details: ${playCacheCount}`);
      console.log(`   • Actor details: ${actorCacheCount}`);
      console.log(`   • Scene details: ${sceneCacheCount}`);
      console.log(
        `   • TOTAL ENTRIES: ${entries.length} (${basicQueryCount} lists + ${totalDetailEntries} details)`
      );

      if (entries.length < 50) {
        console.warn(
          `⚠️  Warning: Only ${entries.length} total entries. Expected 100+. Check data availability.`
        );
      } else {
        console.log(
          `✅ SUCCESS: ${entries.length} entries ready for Redis bulk insert!`
        );
      }
    } catch (error) {
      console.error(`❌ CRITICAL ERROR in prepareAllCacheEntries:`, error);
    }

    return entries;
  }

  async preWarmCache(): Promise<void> {
    console.log("� Starting Redis-optimized cache pre-warming...");

    try {
      // Check if cache exists, if not initialize it
      const cacheExists = await this.isCacheInitialized();

      if (true) {
        console.log("🔥 Cache not found, initializing for first time...");
        // Use the optimized Redis bulk operations for initial cache
        await this.preWarmCacheOptimized();
      } else {
        console.log("✅ Cache already exists, using existing data");
      }

      const stats = await this.getStats();
      console.log(`📊 Cache stats:`, stats);

      // Start daily refresh at midnight
      this.startDailyRefresh();
    } catch (error) {
      console.error("❌ Redis cache initialization failed:", error);
      throw error;
    }
  }

  // Check if cache is initialized (has basic data)
  private async isCacheInitialized(): Promise<boolean> {
    try {
      const essentialKeys = [
        "all_characters",
        "all_plays",
        "all_actors",
        "all_scenes",
      ];

      const keyChecks = await Promise.all(
        essentialKeys.map((key) => this.has(key))
      );

      return keyChecks.every((exists) => exists);
    } catch (error) {
      console.error("❌ Error checking cache initialization:", error);
      return false;
    }
  }

  private async shouldPreWarmCache(): Promise<{
    needsPreWarming: boolean;
    message: string;
  }> {
    try {
      // Check if cache metadata exists
      const cacheMetadata = await this.get<{
        completed: boolean;
        timestamp: string;
        duration: number;
        version?: string;
      }>("cache_prewarmed");

      if (!cacheMetadata) {
        return {
          needsPreWarming: true,
          message: "No cache metadata found - first time setup",
        };
      }

      if (!cacheMetadata.completed) {
        return {
          needsPreWarming: true,
          message: "Previous cache pre-warming was incomplete",
        };
      }

      // Check cache age
      const cacheTimestamp = new Date(cacheMetadata.timestamp);
      const now = new Date();
      const ageInHours =
        (now.getTime() - cacheTimestamp.getTime()) / (1000 * 60 * 60);
      const maxAgeHours = 24; // 24 hours

      if (ageInHours > maxAgeHours) {
        return {
          needsPreWarming: true,
          message: `Cache is ${Math.round(
            ageInHours
          )}h old (max: ${maxAgeHours}h) - refreshing`,
        };
      }

      // Check if essential cache keys exist
      const essentialKeys = [
        "list_characters",
        "list_plays",
        "list_actors",
        "list_scenes",
      ];

      const keyChecks = await Promise.all(
        essentialKeys.map((key) => this.has(key))
      );

      const missingKeys = essentialKeys.filter((_, index) => !keyChecks[index]);

      if (missingKeys.length > 0) {
        return {
          needsPreWarming: true,
          message: `Missing essential cache keys: ${missingKeys.join(", ")}`,
        };
      }

      // All checks passed - cache is valid
      const remainingHours = Math.round(maxAgeHours - ageInHours);
      return {
        needsPreWarming: false,
        message: `Cache is ${Math.round(
          ageInHours
        )}h old, ${remainingHours}h remaining, all keys present`,
      };
    } catch (error) {
      console.error("❌ Error checking cache validity:", error);
      return {
        needsPreWarming: true,
        message: "Error checking cache - forcing refresh",
      };
    }
  }

  async isPreWarmed(): Promise<boolean> {
    try {
      const cacheMetadata = await this.get<{
        completed: boolean;
        timestamp: string;
        duration: number;
      }>("cache_prewarmed");

      if (!cacheMetadata || !cacheMetadata.completed) {
        return false;
      }

      // Check if cache is not too old (within 24 hours)
      const cacheTimestamp = new Date(cacheMetadata.timestamp);
      const now = new Date();
      const ageInHours =
        (now.getTime() - cacheTimestamp.getTime()) / (1000 * 60 * 60);

      return ageInHours <= 24; // Cache is valid for 24 hours
    } catch (error) {
      console.error("❌ Error checking if cache is pre-warmed:", error);
      return false;
    }
  }

  private async preWarmBasicLists(): Promise<void> {
    try {
      await Promise.all([
        this.preWarmCharactersList(),
        this.preWarmPlaysList(),
        this.preWarmActorsList(),
        this.preWarmScenesList(),
      ]);
    } catch (error) {
      console.error("Failed to pre-warm basic lists:", error);
    }
  }

  private async preWarmDetailedCharacters(): Promise<void> {
    console.log("🎭 Pre-warming detailed character information...");

    const charactersSparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?charName
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName .
        FILTER(STR(?charName) != "...")
      }
      ORDER BY LCASE(?charName)`;

    try {
      const characters = await runSPARQLQuery(charactersSparql);
      console.log(`📚 Found ${characters.length} characters to pre-warm`);

      const batchSize = 5;
      for (let i = 0; i < characters.length; i += batchSize) {
        const batch = characters.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (char: any) => {
            const charName = char.charName.value;
            await this.preWarmSingleCharacter(charName);
          })
        );

        const processed = Math.min(i + batchSize, characters.length);
        console.log(
          `🎭 Pre-warmed ${processed}/${characters.length} characters`
        );
      }
    } catch (error) {
      console.error("Failed to pre-warm detailed characters:", error);
    }
  }

  private async preWarmDetailedPlays(): Promise<void> {
    console.log("🎬 Pre-warming detailed play information...");

    const playsSparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?title
      WHERE {
        ?play rdf:type Cheo:Play ;
              Cheo:title ?title .
        FILTER(STR(?title) != "...")
      }
      ORDER BY LCASE(?title)`;

    try {
      const plays = await runSPARQLQuery(playsSparql);
      console.log(`🎬 Found ${plays.length} plays to pre-warm`);

      const batchSize = 3;
      for (let i = 0; i < plays.length; i += batchSize) {
        const batch = plays.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (play: any) => {
            const playTitle = play.title.value;
            await this.preWarmSinglePlay(playTitle);
          })
        );

        const processed = Math.min(i + batchSize, plays.length);
        console.log(`🎬 Pre-warmed ${processed}/${plays.length} plays`);
      }
    } catch (error) {
      console.error("Failed to pre-warm detailed plays:", error);
    }
  }

  private async preWarmDetailedActors(): Promise<void> {
    console.log("🎪 Pre-warming detailed actor information...");

    const actorsSparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?actorName
      WHERE {
        ?actor rdf:type Cheo:Actor ;
               Cheo:actorName ?actorName .
        FILTER(STR(?actorName) != "...")
      }
      ORDER BY LCASE(?actorName)`;

    try {
      const actors = await runSPARQLQuery(actorsSparql);
      console.log(`🎪 Found ${actors.length} actors to pre-warm`);

      const batchSize = 5;
      for (let i = 0; i < actors.length; i += batchSize) {
        const batch = actors.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (actor: any) => {
            const actorName = actor.actorName.value;
            await this.preWarmSingleActor(actorName);
          })
        );

        const processed = Math.min(i + batchSize, actors.length);
        console.log(`🎪 Pre-warmed ${processed}/${actors.length} actors`);
      }
    } catch (error) {
      console.error("Failed to pre-warm detailed actors:", error);
    }
  }

  private async preWarmDetailedScenes(): Promise<void> {
    console.log("🎬 Pre-warming detailed scene information...");

    const scenesSparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?scene
      WHERE {
        ?scene rdf:type cheo:Scene .
      }
      ORDER BY ?scene`;

    try {
      const scenes = await runSPARQLQuery(scenesSparql);
      console.log(`🎬 Found ${scenes.length} scenes to pre-warm`);

      const batchSize = 3;
      for (let i = 0; i < scenes.length; i += batchSize) {
        const batch = scenes.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (scene: any) => {
            const sceneURI = scene.scene.value;
            await this.preWarmSingleScene(sceneURI);
          })
        );

        const processed = Math.min(i + batchSize, scenes.length);
        console.log(`🎬 Pre-warmed ${processed}/${scenes.length} scenes`);
      }
    } catch (error) {
      console.error("Failed to pre-warm detailed scenes:", error);
    }
  }

  private async preWarmSingleCharacter(characterName: string): Promise<void> {
    const cacheKey = `character_info_${characterName.toLowerCase().trim()}`;

    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT 
        (?charName AS ?name) 
        ?description 
        (?charGender AS ?gender) 
        ?mainType 
        ?subType
        (GROUP_CONCAT(DISTINCT ?playTitle; SEPARATOR=", ") AS ?plays)
        (GROUP_CONCAT(DISTINCT ?actorName; SEPARATOR=", ") AS ?actors)
        (GROUP_CONCAT(
            DISTINCT CONCAT(STR(?scene), ",", COALESCE(?sceneName, "")); 
            SEPARATOR="|xx|"
        ) AS ?scenes)
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName ;
              Cheo:charGender ?charGender ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType .

        FILTER(LCASE(STR(?charName)) = LCASE("${characterName}"))

        OPTIONAL { 
          ?char Cheo:description ?description .
        }

        OPTIONAL {
          ?play Cheo:hasCharacter ?char ;
                Cheo:title ?playTitle .
        }

        OPTIONAL {
          ?ra a Cheo:RoleAssignment ;
              Cheo:forCharacter ?char ;
              Cheo:performedBy ?actor .
          ?actor Cheo:actorName ?actorName .
        }

        OPTIONAL {
          ?scene Cheo:hasVersion ?ver .
          ?ra2 a Cheo:RoleAssignment ;
              Cheo:inVersion ?ver ;
              Cheo:forCharacter ?char .
          ?play Cheo:hasScene ?scene .
          ?scene Cheo:sceneName ?sceneName .
        }
      }
      GROUP BY ?charName ?description ?charGender ?mainType ?subType
      ORDER BY LCASE(?charName)`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set(cacheKey, results, 7200);
    } catch (error) {
      console.error(`Failed to pre-warm character ${characterName}:`, error);
    }
  }

  private async preWarmSinglePlay(playTitle: string): Promise<void> {
    const cacheKey = `play_info_${playTitle.toLowerCase().trim()}`;

    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT
        (?playTitle AS ?title)
        ?author
        ?summary
        ?sceneNumber
        (GROUP_CONCAT(
            DISTINCT CONCAT(STR(?scene), ",", COALESCE(?sceneName, "")); 
            SEPARATOR="|xx|"
        ) AS ?scenes)
        (GROUP_CONCAT(DISTINCT ?charName;  SEPARATOR=", ") AS ?characters)
        (GROUP_CONCAT(DISTINCT ?actorName; SEPARATOR=", ") AS ?actors)
      WHERE {
        ?play rdf:type Cheo:Play ;
              Cheo:title ?playTitle .
        FILTER(LCASE(STR(?playTitle)) = LCASE("${playTitle}"))
        FILTER(STR(?playTitle) != "...")

        OPTIONAL { 
          ?play Cheo:author ?author .
          FILTER(STR(?author) != "...")
        }
        OPTIONAL { 
          ?play Cheo:summary ?summary .
          FILTER(STR(?summary) != "...")
        }
        OPTIONAL { 
          ?play Cheo:sceneNumber ?sceneNumber .
          FILTER(STR(?sceneNumber) != "...")
        }

        OPTIONAL {
          ?play  Cheo:hasScene ?scene .
          ?scene Cheo:sceneName ?sceneName .
          FILTER(STR(?sceneName) != "...")
        }

        OPTIONAL {
          ?play  Cheo:hasCharacter ?char .
          ?char  Cheo:charName ?charName .
          FILTER(STR(?charName) != "...")
        }

        OPTIONAL {
          ?play  Cheo:hasCharacter ?char .
          ?ra    rdf:type Cheo:RoleAssignment ;
                Cheo:forCharacter ?char ;
                Cheo:performedBy  ?actor .
          ?actor Cheo:actorName ?actorName .
          FILTER(STR(?actorName) != "...")
        }
      }
      GROUP BY ?playTitle ?author ?summary ?sceneNumber
      ORDER BY LCASE(?playTitle)`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set(cacheKey, results, 7200);
    } catch (error) {
      console.error(`Failed to pre-warm play ${playTitle}:`, error);
    }
  }

  private async preWarmSingleActor(actorName: string): Promise<void> {
    const cacheKey = `actor_info_${actorName.toLowerCase().trim()}`;

    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT
        (?actorName AS ?name)
        (?actorGender AS ?gender)
        (GROUP_CONCAT(DISTINCT ?playTitle;  separator=", ") AS ?plays)
        (GROUP_CONCAT(DISTINCT ?charName;   separator=", ") AS ?characters)
      WHERE {
        ?actor rdf:type Cheo:Actor ;
              Cheo:actorName ?actorName .
        FILTER(STR(?actorName) = "${actorName}")
        FILTER(STR(?actorName) != "...")

        OPTIONAL {
          ?actor Cheo:actorGender ?actorGender .
          FILTER(STR(?actorGender) != "...")
        }

        OPTIONAL {
          ?ra   rdf:type Cheo:RoleAssignment ;
                Cheo:performedBy  ?actor ;
                Cheo:forCharacter ?char .

          ?char Cheo:charName ?charName .
          FILTER(STR(?charName) != "...")

          ?play Cheo:hasCharacter ?char ;
                Cheo:title        ?playTitle .
          FILTER(STR(?playTitle) != "...")
        }
      }
      GROUP BY ?actorName ?actorGender
      ORDER BY LCASE(?actorName)`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set(cacheKey, results, 7200);
    } catch (error) {
      console.error(`Failed to pre-warm actor ${actorName}:`, error);
    }
  }

  private async preWarmSingleScene(sceneURI: string): Promise<void> {
    const cacheKey = `scene_info_${encodeURIComponent(sceneURI)}`;

    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT
        ?scene
        (STR(?sceneName)    AS ?name)
        (STR(?sceneSummary) AS ?summary)
        ?play
        (STR(?playTitle)    AS ?inPlay)
        (GROUP_CONCAT(DISTINCT ?charName;  SEPARATOR=", ") AS ?allCharacters)
        (GROUP_CONCAT(DISTINCT ?actorName; SEPARATOR=", ") AS ?allActors)
        (GROUP_CONCAT(DISTINCT ?vidLink;   SEPARATOR=", ") AS ?allVideos)
      WHERE {
        BIND(<${sceneURI}> AS ?scene)

        OPTIONAL { ?scene cheo:sceneName    ?sceneName    FILTER(STR(?sceneName)    != "...") }

        ?play cheo:hasScene ?scene .
        OPTIONAL { ?play cheo:title ?playTitle FILTER(STR(?playTitle) != "...") }

        OPTIONAL {
          ?scene cheo:hasVersion ?ver .
          OPTIONAL { ?ver cheo:vidVersion ?vidLink FILTER(STR(?vidLink) != "...") }

          OPTIONAL {
            ?ra rdf:type cheo:RoleAssignment ;
                cheo:inVersion ?ver ;
                cheo:forCharacter ?char .

            OPTIONAL { ?char cheo:charName ?charName FILTER(STR(?charName) != "...") }

            OPTIONAL {
              { ?ra cheo:performedBy ?actor } UNION { ?ra cheo:performBy ?actor }
              OPTIONAL { ?actor cheo:actorName ?actorName FILTER(STR(?actorName) != "...") }
            }
          }
        }
      }
      GROUP BY ?scene ?sceneName ?sceneSummary ?play ?playTitle
      ORDER BY LCASE(STR(?playTitle)) LCASE(STR(?sceneName))`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set(cacheKey, results, 7200);
    } catch (error) {
      console.error(`Failed to pre-warm scene ${sceneURI}:`, error);
    }
  }

  private async preWarmCharactersList(): Promise<void> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?char ?charName ?charGender ?mainType ?subType
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName ;
              Cheo:charGender ?charGender ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType .
        FILTER(STR(?charName) != "...")
      }
      ORDER BY LCASE(?charName)`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set("list_characters", results, 7200);
      console.log(`📚 Pre-warmed characters list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm characters list:", error);
    }
  }

  private async preWarmPlaysList(): Promise<void> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?play ?title ?author ?summary ?sceneNumber
      WHERE {
        ?play rdf:type Cheo:Play ;
              Cheo:title ?title .
        FILTER(STR(?title) != "...")
        
        OPTIONAL { 
          ?play Cheo:author ?author .
          FILTER(STR(?author) != "...")
        }
        OPTIONAL { 
          ?play Cheo:summary ?summary .
          FILTER(STR(?summary) != "...")
        }
        OPTIONAL { 
          ?play Cheo:sceneNumber ?sceneNumber .
          FILTER(STR(?sceneNumber) != "...")
        }
      }
      ORDER BY LCASE(?title)`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set("list_plays", results, 7200);
      console.log(`🎭 Pre-warmed plays list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm plays list:", error);
    }
  }

  private async preWarmActorsList(): Promise<void> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?actor ?actorName ?actorGender
      WHERE {
        ?actor rdf:type Cheo:Actor ;
               Cheo:actorName ?actorName .
        FILTER(STR(?actorName) != "...")
        
        OPTIONAL {
          ?actor Cheo:actorGender ?actorGender .
          FILTER(STR(?actorGender) != "...")
        }
      }
      ORDER BY LCASE(?actorName)`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set("list_actors", results, 7200);
      console.log(`🎬 Pre-warmed actors list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm actors list:", error);
    }
  }

  private async preWarmScenesList(): Promise<void> {
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?scene ?sceneName ?play ?playTitle
      WHERE {
        ?scene rdf:type cheo:Scene ;
               cheo:sceneName ?sceneName .
        FILTER(STR(?sceneName) != "...")
        
        ?play cheo:hasScene ?scene ;
              cheo:title ?playTitle .
        FILTER(STR(?playTitle) != "...")
      }
      ORDER BY LCASE(?playTitle) LCASE(?sceneName)`;

    try {
      const results = await runSPARQLQuery(sparql);
      await this.set("list_scenes", results, 7200);
      console.log(`🎬 Pre-warmed scenes list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm scenes list:", error);
    }
  }

  private prefixKey(key: string): string {
    return `${this.getKeyPrefix()}${key}`;
  }

  private getKeyPrefix(): string {
    return "cheo:";
  }

  async destroy(): Promise<void> {
    // Simply disconnect without any cleanup actions
    this.stopAutoRefresh();
    await this.disconnect();
  }
}

// Redis client factory function
export function createRedisCacheService(): RedisCacheService {
  const config: RedisCacheConfig = {
    host: process.env.REDIS_HOST || process.env.REDIS_LOCAL_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD || undefined,
    username: process.env.REDIS_USERNAME || undefined,
    db: parseInt(process.env.REDIS_DB || "0"),
    ttl: parseInt(process.env.REDIS_TTL_DEFAULT || "86400"), // 24 hours default TTL
    tls: process.env.REDIS_TLS === "true",
    retryAttempts: 3,
    retryDelay: 1000,
  };

  return new RedisCacheService(config);
}

// Create and export singleton instance
export const redisCache = createRedisCacheService();

export default RedisCacheService;
