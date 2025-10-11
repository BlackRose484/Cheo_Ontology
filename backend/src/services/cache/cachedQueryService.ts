import { cheoCache } from "./cacheService";

export class CachedQueryService {
  static async getCharacterInformation(character: string): Promise<any[]> {
    const cacheKey = `character_info_${character.toLowerCase().trim()}`;

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

        FILTER(LCASE(STR(?charName)) = LCASE("${character}"))

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

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 7200);
  }

  static async getPlayInformation(play: string): Promise<any[]> {
    const cacheKey = `play_info_${play.toLowerCase().trim()}`;

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
        FILTER(LCASE(STR(?playTitle)) = LCASE("${play}"))
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

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 7200);
  }

  static async getActorInformation(actor: string): Promise<any[]> {
    const cacheKey = `actor_info_${actor.toLowerCase().trim()}`;

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
        FILTER(STR(?actorName) = "${actor}")
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

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 7200);
  }

  static async getSceneInformation(scene: string): Promise<any[]> {
    const cacheKey = `scene_info_${encodeURIComponent(scene)}`;

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
        BIND(<${scene}> AS ?scene)

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

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 7200);
  }

  static async searchPlayByCharacter(character: string): Promise<any[]> {
    const cacheKey = `search_plays_by_char_${character.toLowerCase().trim()}`;

    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?play ?title
      WHERE {
        BIND("${character}" AS ?charInput)

        ?char a cheo:Character ; cheo:charName ?charName .
        FILTER(LCASE(STR(?charName)) = LCASE(STR(?charInput)))

        ?play a cheo:Play ; cheo:hasCharacter ?char .
        OPTIONAL { ?play cheo:title ?title }
      }
      ORDER BY LCASE(STR(?title))`;

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 3600);
  }

  static async searchSceneAndPlayByCharacter(
    character: string
  ): Promise<any[]> {
    const cacheKey = `search_scenes_by_char_${encodeURIComponent(character)}`;

    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?scene ?sceneName (?playTitle AS ?Play)
      WHERE {
        BIND(<${character}> AS ?char)

        ?char rdf:type Cheo:Character .

        ?scene a Cheo:Scene ;
              Cheo:hasVersion ?ver ;
              Cheo:sceneName ?sceneName .
              
        ?ra a Cheo:RoleAssignment ;
            Cheo:inVersion ?ver ;
            Cheo:forCharacter ?char .

        ?play Cheo:hasScene ?scene ;
              Cheo:title ?playTitle .
      }
      ORDER BY ?playTitle ?sceneName`;

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 3600);
  }

  static async searchEmotionByCharacterAndScene(
    character: string,
    scene: string
  ): Promise<any[]> {
    const cacheKey = `search_emotions_${encodeURIComponent(
      character
    )}_${encodeURIComponent(scene)}`;

    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?emotion
      WHERE {
        BIND(<${character}> AS ?char)
        BIND(<${scene}> AS ?scene)

        ?scene cheo:hasVersion ?ver .

        ?ra a cheo:RoleAssignment ;
            cheo:inVersion ?ver ;
            cheo:forCharacter ?char ;
            cheo:hasAppearance ?appearance .

        ?appearance cheo:emotion ?emotion .
      }`;

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 3600);
  }

  static async searchByCharSceneEmo(
    character: string,
    scene: string,
    emotion: string
  ): Promise<any[]> {
    const cacheKey = `search_complete_${encodeURIComponent(
      character
    )}_${encodeURIComponent(scene)}_${emotion.toLowerCase()}`;

    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT
        ?charName
        ?charGender
        ?playTitle
        ?sceneName
        ?emotion
        ?actorName
        ?appearance
      WHERE {
        BIND(<${character}> AS ?char)
        BIND(<${scene}> AS ?scene)
        BIND("${emotion}" AS ?emoInput)

        ?scene a cheo:Scene ;
              cheo:sceneName ?sceneName ;
              cheo:hasVersion ?ver .
        ?playInst cheo:hasScene ?scene ;
                  cheo:title ?playTitle .

        ?char a cheo:Character ;
              cheo:charName ?charName .
        OPTIONAL { ?char cheo:charGender ?charGender }

        ?ra a cheo:RoleAssignment ;
            cheo:inVersion ?ver ;
            cheo:forCharacter ?char ;
            cheo:hasAppearance ?appearance .

        ?appearance cheo:emotion ?emotion .

        FILTER( (?emoInput = "all") || (LCASE(STR(?emotion)) = LCASE(?emoInput)) )

        { ?ra cheo:performedBy ?actor } UNION { ?ra cheo:performBy ?actor }
        OPTIONAL { ?actor cheo:actorName ?actorName }
      }
      ORDER BY ?sceneName ?actorName ?appearance`;

    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, 3600);
  }

  static async runGenericCachedQuery(
    sparql: string,
    queryType: string = "generic",
    ttl: number = 1800
  ): Promise<any[]> {
    const cacheKey = `${queryType}_${this.generateSimpleHash(sparql)}`;
    return await cheoCache.runCachedSPARQLQuery(sparql, cacheKey, ttl);
  }

  private static generateSimpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString();
  }
}

export default CachedQueryService;
