/**
 * Universal Query Adapter - Smart query routing based on strategy
 * Simplified and clean implementation
 */

import { runSPARQLQuery } from "../../utils/graphdb";
import { redisCache } from "../cache/redisCacheService";

export enum QueryStrategy {
  DIRECT = "direct",
  CACHE = "cache",
  HYBRID = "hybrid",
}

interface QueryAdapterConfig {
  strategy: QueryStrategy;
  fallbackStrategy?: QueryStrategy;
  timeout?: number;
}

export class UniversalQueryAdapter {
  private config: QueryAdapterConfig;

  constructor() {
    this.config = {
      strategy: this.getQueryStrategy(),
      fallbackStrategy: QueryStrategy.DIRECT,
      timeout: 30000,
    };
  }

  private getQueryStrategy(): QueryStrategy {
    const strategy = process.env.QUERY_STRATEGY?.toLowerCase();
    const cacheEnabled = process.env.CACHE_ENABLED === "true";

    switch (strategy) {
      case "cache":
        return cacheEnabled ? QueryStrategy.CACHE : QueryStrategy.DIRECT;
      case "direct":
        return QueryStrategy.DIRECT;
      case "hybrid":
        return QueryStrategy.HYBRID;
      default:
        // Legacy support - check cache enabled
        return cacheEnabled ? QueryStrategy.CACHE : QueryStrategy.DIRECT;
    }
  }

  private async executeWithStrategy<T>(
    directFn: () => Promise<T>,
    cacheKey?: string,
    ttl?: number
  ): Promise<T> {
    const strategy = this.config.strategy;

    try {
      switch (strategy) {
        case QueryStrategy.CACHE:
          if (cacheKey && redisCache) {
            try {
              // Try to get from cache first
              const cached = await redisCache.get<string>(cacheKey);
              if (cached) {
                return JSON.parse(cached);
              }

              // If not in cache, run direct and cache result
              const result = await directFn();
              await redisCache.set(cacheKey, JSON.stringify(result), ttl);
              return result;
            } catch (cacheError) {
              console.warn(
                "⚠️ Cache error, falling back to direct:",
                cacheError
              );
              return await directFn();
            }
          }
          console.warn("⚠️ Cache not available, falling back to direct");
          return await directFn();

        case QueryStrategy.DIRECT:
          return await directFn();

        case QueryStrategy.HYBRID:
          // Try cache first, then direct
          if (cacheKey && redisCache) {
            try {
              const cached = await redisCache.get<string>(cacheKey);
              if (cached) {
                console.log(`✅ Hybrid cache hit for key: ${cacheKey}`);
                return JSON.parse(cached);
              }
            } catch (cacheError) {
              console.warn("⚠️ Hybrid cache read failed:", cacheError);
            }
          }

          // Run direct and optionally cache
          const result = await directFn();
          if (cacheKey && redisCache) {
            try {
              await redisCache.set(cacheKey, JSON.stringify(result), ttl);
              console.log(`💾 Hybrid cached result for key: ${cacheKey}`);
            } catch (cacheError) {
              console.warn("⚠️ Hybrid cache write failed:", cacheError);
            }
          }
          return result;

        default:
          return await directFn();
      }
    } catch (error) {
      console.error(`❌ Query strategy ${strategy} failed:`, error);

      // Fallback logic
      if (
        this.config.fallbackStrategy &&
        this.config.fallbackStrategy !== strategy
      ) {
        console.log(`🔄 Falling back to: ${this.config.fallbackStrategy}`);
        return await directFn(); // Always fallback to direct
      }

      throw error;
    }
  }

  // Custom SPARQL Query - Main method
  async runSPARQLQuery(
    sparql: string,
    cacheKey?: string,
    ttl?: number
  ): Promise<any[]> {
    return this.executeWithStrategy(
      () => runSPARQLQuery(sparql),
      cacheKey,
      ttl || 86400 // Default 24h TTL
    );
  }

  // Character Methods
  async getAllCharacters(): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT ?char ?charName
      WHERE {
        ?char a Cheo:Character ;
              Cheo:charName ?charName .
        FILTER(STR(?charName) != "...")
      }
      ORDER BY LCASE(STR(?charName))
    `;

    return this.runSPARQLQuery(sparql, "all-characters");
  }

  async getCharacterInformation(characterName: string): Promise<any[]> {
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
      WHERE {
        BIND("${characterName}" AS ?charInput)
        
        ?char a Cheo:Character ; 
              Cheo:charName ?charName .
        FILTER(LCASE(STR(?charName)) = LCASE(STR(?charInput)))
        
        OPTIONAL { ?char Cheo:charDescription ?description }
        OPTIONAL { ?char Cheo:charGender ?charGender }
        OPTIONAL { ?char Cheo:hasMainType ?mainType }
        OPTIONAL { ?char Cheo:hasSubType ?subType }
        
        OPTIONAL {
          ?play a Cheo:Play ; 
                Cheo:hasCharacter ?char ;
                Cheo:title ?playTitle .
        }
        
        OPTIONAL {
          ?play Cheo:hasScene ?scene .
          ?scene Cheo:hasVersion ?version .
          ?ra a Cheo:RoleAssignment ;
              Cheo:inVersion ?version ;
              Cheo:forCharacter ?char .
          { ?ra Cheo:performedBy ?actor } UNION { ?ra Cheo:performBy ?actor }
          OPTIONAL { ?actor Cheo:actorName ?actorName }
        }
      }
      GROUP BY ?charName ?description ?charGender ?mainType ?subType
    `;

    return this.runSPARQLQuery(sparql, `character-info:${characterName}`);
  }

  // Play Methods
  async getAllPlays(): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT ?play ?title
      WHERE {
        ?play a Cheo:Play ;
              Cheo:title ?title .
      }
      ORDER BY LCASE(STR(?title))
    `;

    return this.runSPARQLQuery(sparql, "all-plays");
  }

  async getPlayInformation(playTitle: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT 
        ?play 
        (?title AS ?playTitle) 
        ?author 
        ?summary
        (COUNT(DISTINCT ?scene) AS ?sceneNumber)
        (GROUP_CONCAT(DISTINCT ?sceneName; SEPARATOR=", ") AS ?allScenes)
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ") AS ?allCharacters)
      WHERE {
        BIND("${playTitle}" AS ?titleInput)
        
        ?play a Cheo:Play ; 
              Cheo:title ?title .
        FILTER(LCASE(STR(?title)) = LCASE(STR(?titleInput)))
        
        OPTIONAL { ?play Cheo:author ?author }
        OPTIONAL { ?play Cheo:summary ?summary }
        
        OPTIONAL {
          ?play Cheo:hasScene ?scene .
          OPTIONAL { ?scene Cheo:sceneName ?sceneName }
        }
        
        OPTIONAL {
          ?play Cheo:hasCharacter ?char .
          OPTIONAL { ?char Cheo:charName ?charName FILTER(STR(?charName) != "...") }
        }
      }
      GROUP BY ?play ?title ?author ?summary
    `;

    return this.runSPARQLQuery(sparql, `play-info:${playTitle}`);
  }

  // Actor Methods
  async getAllActors(): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT ?actor ?actorName
      WHERE {
        ?actor a Cheo:Actor ;
               Cheo:actorName ?actorName .
      }
      ORDER BY LCASE(STR(?actorName))
    `;

    return this.runSPARQLQuery(sparql, "all-actors");
  }

  async getActorInformation(actorName: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT 
        ?actor 
        (?actorName AS ?name) 
        (?actorGender AS ?gender)
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ") AS ?charNames)
        (GROUP_CONCAT(DISTINCT ?playTitle; SEPARATOR=", ") AS ?playTitles)
      WHERE {
        BIND("${actorName}" AS ?actorInput)
        
        ?actor a Cheo:Actor ; 
               Cheo:actorName ?actorName .
        FILTER(LCASE(STR(?actorName)) = LCASE(STR(?actorInput)))
        
        OPTIONAL { ?actor Cheo:actorGender ?actorGender }
        
        OPTIONAL {
          { ?ra Cheo:performedBy ?actor } UNION { ?ra Cheo:performBy ?actor }
          ?ra Cheo:forCharacter ?char .
          OPTIONAL { ?char Cheo:charName ?charName }
          
          ?ra Cheo:inVersion ?version .
          ?scene Cheo:hasVersion ?version .
          ?play Cheo:hasScene ?scene .
          OPTIONAL { ?play Cheo:title ?playTitle }
        }
      }
      GROUP BY ?actor ?actorName ?actorGender
    `;

    return this.runSPARQLQuery(sparql, `actor-info:${actorName}`);
  }

  // Scene Methods
  async getAllScenes(): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT ?scene ?sceneName
      WHERE {
        ?scene a Cheo:Scene ;
               Cheo:sceneName ?sceneName .
      }
      ORDER BY LCASE(STR(?sceneName))
    `;

    return this.runSPARQLQuery(sparql, "all-scenes");
  }

  async getSceneInformation(sceneURI: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT 
        ?scene
        (?sceneName AS ?name)
        ?summary
        ?inPlay
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ") AS ?allCharacters)
      WHERE {
        BIND(<${sceneURI}> AS ?scene)
        
        OPTIONAL { ?scene Cheo:sceneName ?sceneName }
        OPTIONAL { ?scene Cheo:sceneSummary ?summary }
        
        OPTIONAL {
          ?play Cheo:hasScene ?scene .
          ?play Cheo:title ?inPlay .
        }
        
        OPTIONAL {
          ?scene Cheo:hasVersion ?version .
          ?ra a Cheo:RoleAssignment ;
              Cheo:inVersion ?version ;
              Cheo:forCharacter ?char .
          OPTIONAL { ?char Cheo:charName ?charName }
        }
      }
      GROUP BY ?scene ?sceneName ?summary ?inPlay
    `;

    return this.runSPARQLQuery(sparql, `scene-info:${sceneURI}`);
  }

  // Utility Methods
  getCurrentStrategy(): QueryStrategy {
    return this.config.strategy;
  }

  updateStrategy(strategy: QueryStrategy): void {
    this.config.strategy = strategy;
    console.log(`🔧 Query strategy updated to: ${strategy}`);
  }

  // Cache Management
  async clearCache(): Promise<void> {
    if (redisCache) {
      await redisCache.clear();
      console.log("🗑️ Cache cleared");
    } else {
      console.warn("⚠️ Cache not available");
    }
  }

  async getCacheStats(): Promise<any> {
    return {
      strategy: this.config.strategy,
      cache_enabled: process.env.CACHE_ENABLED === "true",
      cache_available: !!redisCache,
      timestamp: new Date().toISOString(),
    };
  }

  // Health Check
  async healthCheck(): Promise<any> {
    const strategy = this.config.strategy;

    try {
      // Test a simple query
      await this.getAllCharacters();

      return {
        strategy,
        status: "healthy",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        strategy,
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// Create singleton instance
export const universalQueryAdapter = new UniversalQueryAdapter();

// Export for backward compatibility
export { universalQueryAdapter as queryAdapter };
