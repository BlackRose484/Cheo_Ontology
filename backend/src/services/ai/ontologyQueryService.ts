import { IntentAnalysis } from "./geminiService";
import { runSPARQLQuery } from "../../utils/graphdb";
import { formatStringtoArray, formatForScenes } from "../../utils/formatters";

export class OntologyQueryService {
  static async queryByIntent(analysis: IntentAnalysis) {
    try {
      const searchTerm = analysis.entities?.[0] || "";

      switch (analysis.intent) {
        case "find_character":
          if (searchTerm) {
            return await this.getCharacterDetails(searchTerm);
          }
          return await this.searchCharacters(analysis.filters || {});

        case "find_play":
          if (searchTerm) {
            return await this.getPlayDetails(searchTerm);
          }
          return await this.searchPlays(analysis.filters || {});

        case "find_actor":
          if (searchTerm) {
            return await this.getActorDetails(searchTerm);
          }
          return await this.searchActors(analysis.filters || {});

        case "find_scene":
          if (searchTerm) {
            return await this.getSceneDetails(searchTerm);
          }
          return await this.searchScenes(analysis.filters || {});

        case "general_info":
          return await this.generalSearch(analysis.entities || []);

        default:
          return await this.generalSearch(analysis.entities || []);
      }
    } catch (error) {
      console.error("Ontology query error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  static async getCharacterDetails(characterName: string) {
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
      const characterInfo = results.map((result: any) => ({
        name: result.name?.value || "",
        gender: result.gender?.value || "",
        mainType: result.mainType?.value || "",
        subType: result.subType?.value || "",
        description: result.description?.value || "",
        plays: formatStringtoArray(result.plays?.value) || [],
        actors: formatStringtoArray(result.actors?.value) || [],
        scenes: formatForScenes(result.scenes?.value, ",", "|xx|") || [],
      }));

      return {
        type: "character_details",
        count: characterInfo.length,
        data: characterInfo,
        searchTerm: characterName,
        query: sparql,
      };
    } catch (error) {
      console.error("Character details query error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to get character details",
      };
    }
  }

  static async getPlayDetails(playName: string) {
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
        FILTER(LCASE(STR(?playTitle)) = LCASE("${playName}"))
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
      const playInfo = results.map((result: any) => ({
        title: result.title?.value || "",
        author: result.author?.value || "",
        summary: result.summary?.value || "",
        sceneNumber: result.sceneNumber?.value || "",
        scenes: formatForScenes(result.scenes?.value, ",", "|xx|") || [],
        characters: formatStringtoArray(result.characters?.value) || [],
        actors: formatStringtoArray(result.actors?.value) || [],
      }));

      return {
        type: "play_details",
        count: playInfo.length,
        data: playInfo,
        searchTerm: playName,
        query: sparql,
      };
    } catch (error) {
      console.error("Play details query error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to get play details",
      };
    }
  }

  static async getActorDetails(actorName: string) {
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
      const actorInfo = results.map((result: any) => ({
        name: result.name?.value || "",
        gender: result.gender?.value || "",
        plays: formatStringtoArray(result.plays?.value) || [],
        characters: formatStringtoArray(result.characters?.value) || [],
      }));

      return {
        type: "actor_details",
        count: actorInfo.length,
        data: actorInfo,
        searchTerm: actorName,
        query: sparql,
      };
    } catch (error) {
      console.error("Actor details query error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to get actor details",
      };
    }
  }

  static async getSceneDetails(sceneUri: string) {
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
        BIND(<${sceneUri}> AS ?scene)

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
      const sceneInfo = results.map((result: any) => ({
        name: result.name?.value || "",
        summary: result.summary?.value || "",
        allCharacters: formatStringtoArray(result?.allCharacters?.value) || [],
        inPlay: result.inPlay?.value || "",
        allVideos: formatStringtoArray(result?.allVideos?.value) || [],
        allActors: formatStringtoArray(result?.allActors?.value) || [],
      }));

      return {
        type: "scene_details",
        count: sceneInfo.length,
        data: sceneInfo,
        searchTerm: sceneUri,
        query: sparql,
      };
    } catch (error) {
      console.error("Scene details query error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to get scene details",
      };
    }
  }

  static async searchCharacters(filters: any) {
    let sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?charName ?mainType ?subType ?charGender
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType ;
              Cheo:charGender ?charGender .`;

    const conditions = [];
    if (filters.gender) {
      conditions.push(
        `FILTER(LCASE(STR(?charGender)) = LCASE("${filters.gender}"))`
      );
    }
    if (filters.character) {
      conditions.push(
        `FILTER(CONTAINS(LCASE(STR(?charName)), LCASE("${filters.character}")))`
      );
    }

    if (conditions.length > 0) {
      sparql += "\n        " + conditions.join("\n        ");
    }

    sparql += `
      }
      ORDER BY LCASE(?charName)
      LIMIT 15`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "characters",
        count: results.length,
        data: results,
        query: sparql,
      };
    } catch (error) {
      console.error("Characters search error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to search characters",
      };
    }
  }

  static async searchPlays(filters: any) {
    let sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?title ?author ?summary
      WHERE {
        ?play rdf:type Cheo:Play ;
              Cheo:title ?title .
        
        OPTIONAL { ?play Cheo:author ?author }
        OPTIONAL { ?play Cheo:summary ?summary }`;

    if (filters.play) {
      sparql += `
        FILTER(CONTAINS(LCASE(STR(?title)), LCASE("${filters.play}")))`;
    }

    sparql += `
      }
      ORDER BY LCASE(?title)
      LIMIT 15`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "plays",
        count: results.length,
        data: results,
        query: sparql,
      };
    } catch (error) {
      console.error("Plays search error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to search plays",
      };
    }
  }

  static async searchActors(filters: any) {
    let sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?actorName ?actorGender
      WHERE {
        ?actor rdf:type Cheo:Actor ;
              Cheo:actorName ?actorName .
        
        OPTIONAL { ?actor Cheo:actorGender ?actorGender }`;

    const conditions = [];
    if (filters.actor) {
      conditions.push(
        `FILTER(CONTAINS(LCASE(STR(?actorName)), LCASE("${filters.actor}")))`
      );
    }
    if (filters.gender) {
      conditions.push(
        `FILTER(LCASE(STR(?actorGender)) = LCASE("${filters.gender}"))`
      );
    }

    if (conditions.length > 0) {
      sparql += "\n        " + conditions.join("\n        ");
    }

    sparql += `
      }
      ORDER BY LCASE(?actorName)
      LIMIT 15`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "actors",
        count: results.length,
        data: results,
        query: sparql,
      };
    } catch (error) {
      console.error("Actors search error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to search actors",
      };
    }
  }

  static async searchScenes(filters: any) {
    let sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?sceneName ?playTitle
      WHERE {
        ?scene rdf:type Cheo:Scene ;
              Cheo:sceneName ?sceneName .
        
        OPTIONAL {
          ?play Cheo:hasScene ?scene ;
                Cheo:title ?playTitle .
        }`;

    const conditions = [];
    if (filters.scene) {
      conditions.push(
        `FILTER(CONTAINS(LCASE(STR(?sceneName)), LCASE("${filters.scene}")))`
      );
    }
    if (filters.play) {
      conditions.push(
        `FILTER(CONTAINS(LCASE(STR(?playTitle)), LCASE("${filters.play}")))`
      );
    }

    if (conditions.length > 0) {
      sparql += "\n        " + conditions.join("\n        ");
    }

    sparql += `
      }
      ORDER BY LCASE(?sceneName)
      LIMIT 15`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "scenes",
        count: results.length,
        data: results,
        query: sparql,
      };
    } catch (error) {
      console.error("Scenes search error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to search scenes",
      };
    }
  }

  static async generalSearch(entities: string[]) {
    if (!entities || entities.length === 0) {
      return {
        type: "general",
        count: 0,
        data: [],
        error: "No search terms provided",
      };
    }

    const searchTerm = entities[0];
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?entity ?type ?name ?title ?description
      WHERE {
        {
          ?entity rdf:type Cheo:Character ;
                  Cheo:charName ?name .
          OPTIONAL { ?entity Cheo:description ?description }
          BIND("Character" AS ?type)
          FILTER(CONTAINS(LCASE(STR(?name)), LCASE("${searchTerm}")))
        }
        UNION
        {
          ?entity rdf:type Cheo:Play ;
                  Cheo:title ?title .
          OPTIONAL { ?entity Cheo:summary ?description }
          BIND(?title AS ?name)
          BIND("Play" AS ?type)
          FILTER(CONTAINS(LCASE(STR(?title)), LCASE("${searchTerm}")))
        }
        UNION
        {
          ?entity rdf:type Cheo:Actor ;
                  Cheo:actorName ?name .
          BIND("Actor" AS ?type)
          FILTER(CONTAINS(LCASE(STR(?name)), LCASE("${searchTerm}")))
        }
        UNION
        {
          ?entity rdf:type Cheo:Scene ;
                  Cheo:sceneName ?name .
          OPTIONAL { ?entity Cheo:summary ?description }
          BIND("Scene" AS ?type)
          FILTER(CONTAINS(LCASE(STR(?name)), LCASE("${searchTerm}")))
        }
      }
      ORDER BY ?type ?name
      LIMIT 20`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "general",
        count: results.length,
        data: results,
        searchTerm: searchTerm,
        query: sparql,
      };
    } catch (error) {
      console.error("General search error:", error);
      return {
        type: "error",
        count: 0,
        data: [],
        error: "Failed to perform general search",
      };
    }
  }
}
