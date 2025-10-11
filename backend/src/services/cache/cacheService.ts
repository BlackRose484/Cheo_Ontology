import NodeCache from "node-cache";
import { runSPARQLQuery } from "../../utils/graphdb";

export interface CacheConfig {
  ttl?: number;
  maxKeys?: number;
  checkperiod?: number;
}

export interface CacheStats {
  keys: number;
  hits: number;
  misses: number;
  hitRate: number;
}

export class CacheService {
  private cache: NodeCache;
  private hits: number = 0;
  private misses: number = 0;
  private autoRefreshTimer: NodeJS.Timeout | null = null;
  private autoRefreshInterval: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor(config: CacheConfig = {}) {
    this.cache = new NodeCache({
      stdTTL: config.ttl || 3600,
      maxKeys: config.maxKeys || 1000,
      checkperiod: config.checkperiod || 600,
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);

    if (value !== undefined) {
      this.hits++;
      return value;
    } else {
      this.misses++;
      return undefined;
    }
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl !== undefined) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): number {
    return this.cache.del(key);
  }

  clear(): void {
    this.cache.flushAll();
    this.hits = 0;
    this.misses = 0;
  }
  getStats(): CacheStats {
    const keys = this.cache.keys().length;
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;

    return {
      keys,
      hits: this.hits,
      misses: this.misses,
      hitRate: Math.round(hitRate * 100) / 100,
    };
  }

  getKeys(): string[] {
    return this.cache.keys();
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
  }

  async refreshCache(): Promise<void> {
    console.log("🔄 Starting cache refresh...");
    const startTime = Date.now();

    this.clear();

    await this.preWarmCache();

    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`✅ Cache refresh completed in ${duration}ms`);

    this.set(
      "cache_last_refresh",
      {
        timestamp: new Date(),
        duration: duration,
      },
      86400
    );
  }

  getLastRefreshInfo(): { timestamp: Date; duration: number } | null {
    return (
      this.get<{ timestamp: Date; duration: number }>("cache_last_refresh") ||
      null
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

    const cached = this.get<any[]>(cacheKey);
    if (cached !== undefined) {
      // console.log(`🔥 Cache HIT: ${cacheKey}`);
      return cached;
    }

    // console.log(`💾 Cache MISS: ${cacheKey} - executing SPARQL query`);
    try {
      const results = await runSPARQLQuery(sparql);
      this.set(cacheKey, results, ttl);
      return results;
    } catch (error) {
      console.error(`❌ SPARQL query failed for key ${cacheKey}:`, error);
      throw error;
    }
  }

  async preWarmCache(): Promise<void> {
    console.log("🔥 Starting Chèo ontology cache pre-warming...");
    const startTime = Date.now();

    try {
      console.log("📋 Phase 1: Pre-warming basic entity lists...");
      await Promise.all([this.preWarmBasicLists()]);

      console.log("🔍 Phase 2: Pre-warming detailed entity information...");
      await Promise.all([
        this.preWarmDetailedCharacters(),
        this.preWarmDetailedPlays(),
        this.preWarmDetailedActors(),
        this.preWarmDetailedScenes(),
      ]);

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Cache pre-warming completed in ${duration}ms`);
      console.log(`📊 Cache stats:`, this.getStats());

      this.set(
        "cache_prewarmed",
        {
          completed: true,
          timestamp: new Date(),
          duration: duration,
        },
        86400
      );

      if (!this.autoRefreshTimer) {
        this.startAutoRefresh();
      }
    } catch (error) {
      console.error("❌ Cache pre-warming failed:", error);
      throw error;
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

  /**
   * Pre-warm detailed information for all scenes
   */
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

      const batchSize = 3; // Smaller batch for scenes (complex queries)
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

  private async preWarmCharacters(): Promise<void> {
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
      this.set("all_characters", results, 7200); // Cache for 2 hours
      console.log(`📚 Pre-warmed ${results.length} characters`);
    } catch (error) {
      console.error("Failed to pre-warm characters:", error);
    }
  }

  /**
   * Pre-warm all plays (based on viewController pattern)
   */
  private async preWarmPlays(): Promise<void> {
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
      this.set("all_plays", results, 7200); // Cache for 2 hours
      console.log(`🎭 Pre-warmed ${results.length} plays`);
    } catch (error) {
      console.error("Failed to pre-warm plays:", error);
    }
  }

  /**
   * Pre-warm all actors (based on viewController pattern)
   */
  private async preWarmActors(): Promise<void> {
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
      this.set("all_actors", results, 7200); // Cache for 2 hours
      console.log(`🎬 Pre-warmed ${results.length} actors`);
    } catch (error) {
      console.error("Failed to pre-warm actors:", error);
    }
  }

  /**
   * Pre-warm all scenes (based on viewController pattern)
   */
  private async preWarmScenes(): Promise<void> {
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
      this.set("all_scenes", results, 7200); // Cache for 2 hours
      console.log(`🎬 Pre-warmed ${results.length} scenes`);
    } catch (error) {
      console.error("Failed to pre-warm scenes:", error);
    }
  }

  /**
   * Check if cache is pre-warmed
   */
  isPreWarmed(): boolean {
    const flag = this.get<{ completed: boolean }>("cache_prewarmed");
    return flag?.completed === true;
  }

  /**
   * Pre-warm single character detailed information
   */
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
      this.set(cacheKey, results, 7200); // Cache for 2 hours
    } catch (error) {
      console.error(`Failed to pre-warm character ${characterName}:`, error);
    }
  }

  /**
   * Pre-warm single play detailed information
   */
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
        # Play (lọc đúng tên)
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

        # Cảnh của vở
        OPTIONAL {
          ?play  Cheo:hasScene ?scene .
          ?scene Cheo:sceneName ?sceneName .
          FILTER(STR(?sceneName) != "...")
        }

        # Nhân vật
        OPTIONAL {
          ?play  Cheo:hasCharacter ?char .
          ?char  Cheo:charName ?charName .
          FILTER(STR(?charName) != "...")
        }

        # Diễn viên
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
      this.set(cacheKey, results, 7200); // Cache for 2 hours
    } catch (error) {
      console.error(`Failed to pre-warm play ${playTitle}:`, error);
    }
  }

  /**
   * Pre-warm single actor detailed information
   */
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
        # Diễn viên (lọc đúng tên, bỏ placeholder)
        ?actor rdf:type Cheo:Actor ;
              Cheo:actorName ?actorName .
        FILTER(STR(?actorName) = "${actorName}")
        FILTER(STR(?actorName) != "...")

        OPTIONAL {
          ?actor Cheo:actorGender ?actorGender .
          FILTER(STR(?actorGender) != "...")
        }

        # Từ RoleAssignment suy ra nhân vật và vở kịch
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
      this.set(cacheKey, results, 7200); // Cache for 2 hours
    } catch (error) {
      console.error(`Failed to pre-warm actor ${actorName}:`, error);
    }
  }

  /**
   * Pre-warm single scene detailed information
   */
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

        # Play chứa scene
        ?play cheo:hasScene ?scene .
        OPTIONAL { ?play cheo:title ?playTitle FILTER(STR(?playTitle) != "...") }

        # Phiên bản (version) + link video
        OPTIONAL {
          ?scene cheo:hasVersion ?ver .
          OPTIONAL { ?ver cheo:vidVersion ?vidLink FILTER(STR(?vidLink) != "...") }

          # RoleAssignment nằm trên version => lấy character và actor thực sự xuất hiện trong phân đoạn này
          OPTIONAL {
            ?ra rdf:type cheo:RoleAssignment ;
                cheo:inVersion ?ver ;
                cheo:forCharacter ?char .

            OPTIONAL { ?char cheo:charName ?charName FILTER(STR(?charName) != "...") }

            # actor có thể được nối bằng performedBy hoặc (nếu dataset có typo) performBy
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
      this.set(cacheKey, results, 7200); // Cache for 2 hours
    } catch (error) {
      console.error(`Failed to pre-warm scene ${sceneURI}:`, error);
    }
  }

  /**
   * Pre-warm basic characters list
   */
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
      this.set("list_characters", results, 7200);
      console.log(`📚 Pre-warmed characters list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm characters list:", error);
    }
  }

  /**
   * Pre-warm basic plays list
   */
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
      this.set("list_plays", results, 7200);
      console.log(`🎭 Pre-warmed plays list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm plays list:", error);
    }
  }

  /**
   * Pre-warm basic actors list
   */
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
      this.set("list_actors", results, 7200);
      console.log(`🎬 Pre-warmed actors list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm actors list:", error);
    }
  }

  /**
   * Pre-warm basic scenes list
   */
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
      this.set("list_scenes", results, 7200);
      console.log(`🎬 Pre-warmed scenes list: ${results.length} items`);
    } catch (error) {
      console.error("Failed to pre-warm scenes list:", error);
    }
  }

  destroy(): void {
    this.stopAutoRefresh();
    this.clear();
    console.log("🗑️ Cache service destroyed");
  }
}

// Create singleton instance
export const cheoCache = new CacheService({
  ttl: 7200, // 2 hours for ontology data
  maxKeys: 2000,
  checkperiod: 300, // 5 minutes
});

export default CacheService;
