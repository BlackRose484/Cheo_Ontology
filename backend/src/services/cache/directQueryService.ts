import { runSPARQLQuery } from "../../utils/graphdb";

/**
 * Direct query service - Runs SPARQL queries directly without cache
 */
export class DirectQueryService {
  static async getCharacterInformation(characterName: string): Promise<any[]> {
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
          ?ver Cheo:inScene ?scene .
          OPTIONAL { ?scene Cheo:sceneName ?sceneName . }
        }
      }
      GROUP BY ?charName ?description ?charGender ?mainType ?subType
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getPlayInformation(playTitle: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT 
        ?title 
        ?author 
        ?summary 
        (COUNT(DISTINCT ?scene) AS ?sceneNumber)
        (GROUP_CONCAT(
            DISTINCT CONCAT(STR(?scene), ",", COALESCE(?sceneName, "")); 
            SEPARATOR="|xx|"
        ) AS ?scenes)
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ") AS ?characters)
        (GROUP_CONCAT(DISTINCT ?actorName; SEPARATOR=", ") AS ?actors)
      WHERE {
        ?play rdf:type Cheo:Play ;
              Cheo:title ?title .

        FILTER(LCASE(STR(?title)) = LCASE("${playTitle}"))

        OPTIONAL { ?play Cheo:author ?author . }
        OPTIONAL { ?play Cheo:summary ?summary . }

        OPTIONAL {
          ?play Cheo:hasScene ?scene .
          OPTIONAL { ?scene Cheo:sceneName ?sceneName . }
        }

        OPTIONAL {
          ?play Cheo:hasCharacter ?char .
          ?char Cheo:charName ?charName .
        }

        OPTIONAL {
          ?ra a Cheo:RoleAssignment ;
              Cheo:inPlay ?play ;
              Cheo:performedBy ?actor .
          ?actor Cheo:actorName ?actorName .
        }
      }
      GROUP BY ?title ?author ?summary
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getActorInformation(actorName: string): Promise<any[]> {
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
          ?ra a Cheo:RoleAssignment ;
              Cheo:performedBy ?actor ;
              Cheo:inPlay ?play .
          ?play Cheo:title ?playTitle .
          FILTER(STR(?playTitle) != "...")
        }

        OPTIONAL {
          ?ra a Cheo:RoleAssignment ;
              Cheo:performedBy ?actor ;
              Cheo:forCharacter ?char .
          ?char Cheo:charName ?charName .
          FILTER(STR(?charName) != "...")
        }
      }
      GROUP BY ?actorName ?actorGender
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getSceneInformation(sceneURI: string): Promise<any[]> {
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
        OPTIONAL { ?scene cheo:sceneSummary ?sceneSummary FILTER(STR(?sceneSummary) != "...") }

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
      ORDER BY LCASE(STR(?playTitle)) LCASE(STR(?sceneName))
    `;

    return await runSPARQLQuery(sparql);
  }

  // List methods
  static async getAllCharacters(): Promise<any[]> {
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
      ORDER BY LCASE(?charName)
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getAllPlays(): Promise<any[]> {
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
      ORDER BY LCASE(?title)
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getAllActors(): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?actorName ?origin ?lifespan
      WHERE {
        ?actor rdf:type Cheo:Actor ;
               Cheo:actorName ?actorName .
        OPTIONAL { ?actor Cheo:origin ?origin . }
        OPTIONAL { ?actor Cheo:lifespan ?lifespan . }
      }
      ORDER BY ?actorName
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getAllScenes(): Promise<any[]> {
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
      ORDER BY LCASE(?playTitle) LCASE(?sceneName)
    `;

    return await runSPARQLQuery(sparql);
  }

  // Search methods
  static async searchCharacters(query: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?charName ?charGender ?mainType ?subType
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName ;
              Cheo:charGender ?charGender ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType .
        
        FILTER(CONTAINS(LCASE(STR(?charName)), LCASE("${query}")))
      }
      ORDER BY ?charName
    `;

    return await runSPARQLQuery(sparql);
  }

  static async searchPlays(query: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?title ?author
      WHERE {
        ?play rdf:type Cheo:Play ;
              Cheo:title ?title .
        OPTIONAL { ?play Cheo:author ?author . }
        
        FILTER(CONTAINS(LCASE(STR(?title)), LCASE("${query}")))
      }
      ORDER BY ?title
    `;

    return await runSPARQLQuery(sparql);
  }

  static async searchActors(query: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?actorName ?origin ?lifespan
      WHERE {
        ?actor rdf:type Cheo:Actor ;
               Cheo:actorName ?actorName .
        OPTIONAL { ?actor Cheo:origin ?origin . }
        OPTIONAL { ?actor Cheo:lifespan ?lifespan . }
        
        FILTER(CONTAINS(LCASE(STR(?actorName)), LCASE("${query}")))
      }
      ORDER BY ?actorName
    `;

    return await runSPARQLQuery(sparql);
  }
}
