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
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT 
        ?actorName 
        ?origin 
        ?lifespan 
        ?description
        (GROUP_CONCAT(DISTINCT ?playTitle; SEPARATOR=", ") AS ?plays)
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ") AS ?characters)
        (GROUP_CONCAT(
            DISTINCT CONCAT(STR(?scene), ",", COALESCE(?sceneName, "")); 
            SEPARATOR="|xx|"
        ) AS ?scenes)
      WHERE {
        ?actor rdf:type Cheo:Actor ;
               Cheo:actorName ?actorName .

        FILTER(LCASE(STR(?actorName)) = LCASE("${actorName}"))

        OPTIONAL { ?actor Cheo:origin ?origin . }
        OPTIONAL { ?actor Cheo:lifespan ?lifespan . }
        OPTIONAL { ?actor Cheo:description ?description . }

        OPTIONAL {
          ?ra a Cheo:RoleAssignment ;
              Cheo:performedBy ?actor ;
              Cheo:inPlay ?play .
          ?play Cheo:title ?playTitle .
        }

        OPTIONAL {
          ?ra a Cheo:RoleAssignment ;
              Cheo:performedBy ?actor ;
              Cheo:forCharacter ?char .
          ?char Cheo:charName ?charName .
        }

        OPTIONAL {
          ?ra a Cheo:RoleAssignment ;
              Cheo:performedBy ?actor ;
              Cheo:inVersion ?ver .
          ?ver Cheo:inScene ?scene .
          OPTIONAL { ?scene Cheo:sceneName ?sceneName . }
        }
      }
      GROUP BY ?actorName ?origin ?lifespan ?description
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getSceneInformation(sceneURI: string): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT 
        ?sceneName 
        ?sceneDescription 
        ?playTitle
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ") AS ?characters)
        (GROUP_CONCAT(DISTINCT ?actorName; SEPARATOR=", ") AS ?actors)
      WHERE {
        BIND(<${sceneURI}> AS ?scene)
        
        ?scene rdf:type Cheo:Scene .
        
        OPTIONAL { ?scene Cheo:sceneName ?sceneName . }
        OPTIONAL { ?scene Cheo:sceneDescription ?sceneDescription . }

        OPTIONAL {
          ?play Cheo:hasScene ?scene ;
                Cheo:title ?playTitle .
        }

        OPTIONAL {
          ?ver Cheo:inScene ?scene .
          ?ra a Cheo:RoleAssignment ;
              Cheo:inVersion ?ver ;
              Cheo:forCharacter ?char .
          ?char Cheo:charName ?charName .
        }

        OPTIONAL {
          ?ver Cheo:inScene ?scene .
          ?ra a Cheo:RoleAssignment ;
              Cheo:inVersion ?ver ;
              Cheo:performedBy ?actor .
          ?actor Cheo:actorName ?actorName .
        }
      }
      GROUP BY ?sceneName ?sceneDescription ?playTitle
    `;

    return await runSPARQLQuery(sparql);
  }

  // List methods
  static async getAllCharacters(): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?charName ?charGender ?mainType ?subType
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName ;
              Cheo:charGender ?charGender ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType .
      }
      ORDER BY ?charName
    `;

    return await runSPARQLQuery(sparql);
  }

  static async getAllPlays(): Promise<any[]> {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?title ?author
      WHERE {
        ?play rdf:type Cheo:Play ;
              Cheo:title ?title .
        OPTIONAL { ?play Cheo:author ?author . }
      }
      ORDER BY ?title
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
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?scene ?sceneName ?playTitle
      WHERE {
        ?scene rdf:type Cheo:Scene .
        OPTIONAL { ?scene Cheo:sceneName ?sceneName . }
        OPTIONAL {
          ?play Cheo:hasScene ?scene ;
                Cheo:title ?playTitle .
        }
      }
      ORDER BY ?playTitle ?sceneName
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
