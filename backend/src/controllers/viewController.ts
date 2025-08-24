import { ActorInformation } from "../types/actor";
import { CharacterInformation } from "../types/character";
import { PlayInformation } from "../types/play";
import {
  createErrorResponse,
  formatNameForId,
  formatStringtoArray,
} from "../utils/formatters";
import { runSPARQLQuery } from "../utils/graphdb";
import { Request, Response } from "express";

const ViewController = {
  getCharacterInformation: async (req: Request, res: Response) => {
    const { character } = req.body;
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT (?charName AS ?name) ?description (?charGender AS ?gender) ?mainType ?subType
            (GROUP_CONCAT(DISTINCT ?playTitle; separator=", ") AS ?plays)
            (GROUP_CONCAT(DISTINCT ?actorName; separator=", ") AS ?actors)
            (GROUP_CONCAT(DISTINCT ?sceneName; separator=", ") AS ?scenes)
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName ;
              Cheo:charGender ?charGender ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType .

        FILTER(?charName = "${character}")    # lấy chính xác theo tên

        OPTIONAL { 
          ?char Cheo:description ?description .
          FILTER(STRLEN(STR(?description)) > 0 && STR(?description) != "...")
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
          ?play Cheo:hasCharacter ?char ;
                Cheo:hasScene ?scene .
          ?scene Cheo:sceneName ?sceneName .
        }
      }
      GROUP BY ?charName ?description ?charGender ?mainType ?subType

  `;

    try {
      const results = await runSPARQLQuery(sparql);
      // Trả về phần tử duy nhất
      const characterInfo: CharacterInformation = results.map(
        (result: any) => ({
          name: result.name?.value || "",
          gender: result.gender?.value || "",
          mainType: result.mainType?.value || "",
          subType: result.subType?.value || "",
          description: result.description?.value || "",
          plays: formatStringtoArray(result.plays?.value) || [],
          actors: formatStringtoArray(result.actors?.value) || [],
          scenes: formatStringtoArray(result.scenes?.value) || [],
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
        (GROUP_CONCAT(DISTINCT ?sceneName;  separator=", ") AS ?scenes)
        (GROUP_CONCAT(DISTINCT ?charName;   separator=", ") AS ?characters)
        (GROUP_CONCAT(DISTINCT ?actorName;  separator=", ") AS ?actors)
      WHERE {
        # Play (lọc đúng tên)
        ?play rdf:type Cheo:Play ;
              Cheo:title ?playTitle .
        FILTER(STR(?playTitle) = "${play}")
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
          ?play  Cheo:hasScene  ?scene .
          ?scene Cheo:sceneName ?sceneName .
          FILTER(STR(?sceneName) != "...")
        }

        OPTIONAL {
          ?play  Cheo:hasCharacter ?char .
          ?char  Cheo:charName     ?charName .
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

    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const playInfo: PlayInformation = results.map((result: any) => ({
        title: result.title?.value || "",
        author: result.author?.value || "",
        summary: result.summary?.value || "",
        sceneNumber: result.sceneNumber?.value || "",
        scenes: formatStringtoArray(result.scenes?.value) || [],
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
};

export default ViewController;
