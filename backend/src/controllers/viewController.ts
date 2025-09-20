import { ActorInformation } from "../types/actor";
import { CharacterInformation } from "../types/character";
import { PlayInformation, SceneInformation } from "../types/play";
import {
  createErrorResponse,
  formatForScenes,
  formatStringtoArray,
} from "../utils/formatters";
import { runSPARQLQuery } from "../utils/graphdb";
import { Request, Response } from "express";

const ViewController = {
  getCharacterInformation: async (req: Request, res: Response) => {
    const { character } = req.body;
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
      ORDER BY LCASE(?charName)
  `;

    try {
      const results = await runSPARQLQuery(sparql);
      const characterInfo: CharacterInformation = results.map(
        (result: any) => ({
          name: result.name?.value || "",
          gender: result.gender?.value || "",
          mainType: result.mainType?.value || "",
          subType: result.subType?.value || "",
          description: result.description?.value || "",
          plays: formatStringtoArray(result.plays?.value) || [],
          actors: formatStringtoArray(result.actors?.value) || [],
          scenes: formatForScenes(result.scenes?.value, ",", "|xx|") || [],
        })
      );
      res.json(characterInfo);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  getPlayInformation: async (req: Request, res: Response) => {
    const { play } = req.body;
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
      ORDER BY LCASE(?playTitle)
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const playInfo: PlayInformation = results.map((result: any) => ({
        title: result.title?.value || "",
        author: result.author?.value || "",
        summary: result.summary?.value || "",
        sceneNumber: result.sceneNumber?.value || "",
        scenes: formatForScenes(result.scenes?.value, ",", "|xx|") || [],
        characters: formatStringtoArray(result.characters?.value) || [],
        actors: formatStringtoArray(result.actors?.value) || [],
      }));
      res.json(playInfo);
    } catch (error) {
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },
  getActorInformation: async (req: Request, res: Response) => {
    const { actor } = req.body;
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
        FILTER(STR(?actorName) = "${actor}")
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
      ORDER BY LCASE(?actorName)
`;

    try {
      const results = await runSPARQLQuery(sparql);
      const actorInfo: ActorInformation = results.map((result: any) => ({
        name: result.name?.value || "",
        gender: result.gender?.value || "",
        plays: formatStringtoArray(result.plays?.value) || [],
        characters: formatStringtoArray(result.characters?.value) || [],
      }));
      res.json(actorInfo);
    } catch (error) {
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  getSceneInformation: async (req: Request, res: Response) => {
    const { scene } = req.body;
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
      const sceneInfo: SceneInformation = results.map((result: any) => ({
        name: result.name?.value || "",
        summary: result.summary?.value || "",
        allCharacters: formatStringtoArray(result?.allCharacters?.value) || [],
        inPlay: result.inPlay?.value || "",
        allVideos: formatStringtoArray(result?.allVideos?.value) || [],
        allActors: formatStringtoArray(result?.allActors?.value) || [],
      }));
      res.json(sceneInfo);
    } catch (error) {
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },
};

export default ViewController;
