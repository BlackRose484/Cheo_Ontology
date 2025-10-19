import { ActorGenerals } from "./../types/actor";
import { runSPARQLQuery } from "../utils/graphdb";
import { Request, Response } from "express";
import { createErrorResponse, formatStringtoArray } from "../utils/formatters";
import {
  Appearances,
  PlayGenerals,
  PlayTitlesByCharacter,
  SceneGenerals,
} from "../types/play";
import { EmotionByCharacterAndPlays } from "../types/emotion";
import { CharacterGenerals, CharacterStates } from "../types/character";
import { universalQueryAdapter } from "../services/query/universalQueryAdapter";

const searchController = {
  searchPlayByCharacter: async (req: Request, res: Response) => {
    const character = req.body.character;
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?play ?title
      WHERE {
        BIND("${character}" AS ?charInput)

        # Tìm cá thể Character theo tên, khớp chính xác
        ?char a cheo:Character ; cheo:charName ?charName .
        FILTER(LCASE(STR(?charName)) = LCASE(STR(?charInput)))

        ?play a cheo:Play ; cheo:hasCharacter ?char .
        OPTIONAL { ?play cheo:title ?title }
      }
      ORDER BY LCASE(STR(?title))
    `;

    try {
      // Use Universal Query Adapter - automatically chooses strategy
      const results = await universalQueryAdapter.runSPARQLQuery(
        sparql,
        `search:play-by-character:${character}`
      );

      const plays: PlayTitlesByCharacter = results.map((result: any) => {
        return result.title ? result.title.value : "Unknown Title";
      });
      res.json(plays);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchSceneAndPlayByCharacter: async (req: Request, res: Response) => {
    const character = req.body.character;
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?scene ?sceneName (?playTitle AS ?Play)
      WHERE {
        # Nhân vật theo URI
        BIND(<${character}> AS ?char)

        ?char rdf:type Cheo:Character .

        # Lấy Scene và Play mà nhân vật thật sự có mặt
        ?scene a Cheo:Scene ;
              Cheo:hasVersion ?ver ;
              Cheo:sceneName ?sceneName .
              
        ?ra a Cheo:RoleAssignment ;
            Cheo:inVersion ?ver ;
            Cheo:forCharacter ?char .

        ?play Cheo:hasScene ?scene ;
              Cheo:title ?playTitle .
      }
      ORDER BY ?playTitle ?sceneName
    `;
    try {
      // Use Universal Query Adapter - automatically chooses strategy
      const results = await universalQueryAdapter.runSPARQLQuery(
        sparql,
        `search:scene-play-by-character:${character}`
      );
      const sceneAndPlays = results.map((result: any) => ({
        scene: result.scene?.value || "",
        sceneName: result.sceneName?.value || "",
        playTitle: result.Play?.value || "",
      }));
      res.json(sceneAndPlays);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchEmotionByCharacterAndScene: async (req: Request, res: Response) => {
    const { character, scene } = req.body;
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?emotion
      WHERE {
        # Input từ client: URI của nhân vật và cảnh
        BIND(<${character}> AS ?char)
        BIND(<${scene}> AS ?scene)

        # Lấy Version từ Scene
        ?scene cheo:hasVersion ?ver .

        # RoleAssignment kết nối Version với Character
        ?ra a cheo:RoleAssignment ;
            cheo:inVersion ?ver ;
            cheo:forCharacter ?char ;
            cheo:hasAppearance ?appearance .

        # Lấy emotion từ Appearance
        ?appearance cheo:emotion ?emotion .
      }
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const emotions: EmotionByCharacterAndPlays = results.map(
        (result: any) => result?.emotion?.value
      );
      res.json(emotions);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchByCharSceneEMo: async (req: Request, res: Response) => {
    const { character, scene, emotion } = req.body;

    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT
        ?charName           # Tên nhân vật
        ?charGender         # Giới tính nhân vật
        ?playTitle          # Vở kịch
        ?sceneName          # Phân cảnh
        ?emotion            # Biểu cảm
        ?actorName          # Diễn viên
        ?appearance         # Cá thể Appearance
      WHERE {
        # ---- Tham số ----
        BIND(<${character}> AS ?char)       # URI nhân vật
        BIND(<${scene}> AS ?scene)          # URI phân cảnh
        BIND("${emotion}" AS ?emoInput)     # Tên emotion (literal)

        # Scene và Play
        ?scene a cheo:Scene ;
              cheo:sceneName ?sceneName ;
              cheo:hasVersion ?ver .
        ?playInst cheo:hasScene ?scene ;
                  cheo:title ?playTitle .

        # Character
        ?char a cheo:Character ;
              cheo:charName ?charName .
        OPTIONAL { ?char cheo:charGender ?charGender }

        # RoleAssignment → Appearance
        ?ra a cheo:RoleAssignment ;
            cheo:inVersion ?ver ;
            cheo:forCharacter ?char ;
            cheo:hasAppearance ?appearance .

        ?appearance cheo:emotion ?emotion .

        # Lọc emotion nếu khác "all"
        FILTER( (?emoInput = "all") || (LCASE(STR(?emotion)) = LCASE(?emoInput)) )

        # Actor
        { ?ra cheo:performedBy ?actor } UNION { ?ra cheo:performBy ?actor }
        OPTIONAL { ?actor cheo:actorName ?actorName }
      }
      ORDER BY ?sceneName ?actorName ?appearance
`;

    try {
      const results = await runSPARQLQuery(sparql);
      const characterStates: CharacterStates = results.map((result: any) => ({
        charName: result.charName.value,
        charGender: result.charGender.value,
        playTitle: result.playTitle.value,
        sceneName: result.sceneName.value,
        actor: result.actorName.value,
        emotion: result.emotion.value,
        appearance: result.appearance.value,
      }));
      res.json(characterStates);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchCharacterGeneral: async (req: Request, res: Response) => {
    const { character } = req.body;
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT
        ?char ?charName (?charGender as ?gender) ?mainType ?subType ?description
        (?playTitle as ?inPlay)
      WHERE {
        BIND(<${character}> AS ?char)

        ?char a cheo:Character ;
              cheo:charName ?charName .

        OPTIONAL { ?char cheo:charGender  ?charGender }
        OPTIONAL { ?char cheo:mainType    ?mainType }
        OPTIONAL { ?char cheo:subType     ?subType }
        OPTIONAL { ?char cheo:description ?description }

        ?play_ a cheo:Play ; cheo:hasCharacter ?char .
        OPTIONAL { ?play_ cheo:title ?playTitle }
      }
      ORDER BY LCASE(STR(?charName)) LCASE(STR(?playTitle))

    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const characterGenerals: CharacterGenerals = results.map(
        (result: any) => ({
          char: result.char?.value || "",
          description: result.description?.value || "",
          gender: result.gender?.value || "",
          charName: result.charName?.value || "",
          mainType: result.mainType?.value || "",
          subType: result.subType?.value || "",
          inPlay: result.inPlay?.value || "",
        })
      );
      res.json(characterGenerals);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchPlayGeneral: async (req: Request, res: Response) => {
    const { play } = req.body;
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#>

      SELECT 
        (?playTitle as ?title) ?author ?summary ?sceneNum
        (GROUP_CONCAT(DISTINCT ?sceneName; SEPARATOR=", ") AS ?allScenes)
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ")  AS ?allCharacters)
      WHERE {
        # Truyền trực tiếp URI Play vào
        BIND(<${play}> AS ?play)

        ?play a cheo:Play ;
              cheo:title ?playTitle .

        OPTIONAL { ?play cheo:author  ?author  FILTER(STR(?author)  != "...") }
        OPTIONAL { ?play cheo:summary ?summary FILTER(STR(?summary) != "...") }
        OPTIONAL { ?play cheo:sceneNumber ?sceneNumber }
        BIND(STR(?sceneNumber) AS ?sceneNum)

        # các trích đoạn (Scene)
        OPTIONAL {
          ?play cheo:hasScene ?scene .
          OPTIONAL { ?scene cheo:sceneName ?sceneName FILTER(STR(?sceneName) != "...") }
        }

        # các nhân vật trong vở
        OPTIONAL { 
          ?play cheo:hasCharacter ?char .
          OPTIONAL { ?char cheo:charName ?charName FILTER(STR(?charName) != "...") }
        }
        OPTIONAL {
          ?play  cheo:hasScene ?s2 .
          ?s2    cheo:hasVersion ?v2 .
          ?ra2 a cheo:RoleAssignment ; cheo:inVersion ?v2 ; cheo:forCharacter ?char .
          OPTIONAL { ?char cheo:charName ?charName FILTER(STR(?charName) != "...") }
        }
      }
      GROUP BY ?play ?playTitle ?author ?summary ?sceneNum
      ORDER BY LCASE(STR(?playTitle))
    `;
    try {
      const results = await runSPARQLQuery(sparql);
      const playGenerals: PlayGenerals = results.map((result: any) => ({
        play: result.play?.value || "",
        author: result.author?.value || "",
        summary: result.summary?.value || "",
        title: result.title?.value || "",
        sceneNumber: result.sceneNumber?.value || 0,
        allScenes: formatStringtoArray(result.allScenes?.value) || [],
        allCharacters: formatStringtoArray(result.allCharacters?.value) || [],
      }));
      res.json(playGenerals);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchActorGeneral: async (req: Request, res: Response) => {
    const { actor } = req.body;
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT ?actor (?actorName AS ?name) (?actorGender AS ?gender)
            (GROUP_CONCAT(DISTINCT STR(?charName); separator=", ") AS ?charNames)
            (GROUP_CONCAT(DISTINCT STR(?playTitle); separator=", ") AS ?playTitles)
      WHERE {
        # Actor theo URI
        BIND(<${actor}> AS ?actor)

        ?actor a cheo:Actor ;
              cheo:actorName ?actorName .
        OPTIONAL { ?actor cheo:actorGender ?actorGender }

        # RoleAssignment → Character → Scene → Play
        ?ra a cheo:RoleAssignment .
        { ?ra cheo:performedBy ?actor } UNION { ?ra cheo:performBy ?actor }
        ?ra cheo:forCharacter ?char ;
            cheo:inVersion ?ver .
        ?scene cheo:hasVersion ?ver .
        ?play  cheo:hasScene ?scene .

        OPTIONAL { ?char cheo:charName ?charName }
        OPTIONAL { ?play cheo:title    ?playTitle }
      }
      GROUP BY ?actor ?actorName ?actorGender
      ORDER BY LCASE(STR(?name))
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const actorGenerals: ActorGenerals = results.map((result: any) => ({
        actor: result.actor?.value || "",
        gender: result.gender?.value || "",
        name: result.name?.value || "",
        charNames: formatStringtoArray(result.charNames?.value || ""),
        playTitles: formatStringtoArray(result.playTitles?.value || ""),
      }));

      res.json(actorGenerals);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchAppearance: async (req: Request, res: Response) => {
    const { character, play, uri } = req.body;
    const sparql = `
      PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT
        ?start
        ?end
        ?emotion
        (STR(?vidLink) AS ?vidVersion)
      WHERE {
        # ---- Tham số ----
        BIND("${play}" AS ?playInput)
        BIND("${character}" AS ?charInput)

        # Play
        ?play a cheo:Play ;
              cheo:title ?playTitle ;
              cheo:hasScene ?scene .
        FILTER( LCASE(STR(?playTitle)) = LCASE(?playInput) )

        # Scene → Version
        ?scene cheo:hasVersion ?ver .
        OPTIONAL { ?ver cheo:vidVersion ?vidLink }

        # Character
        ?char a cheo:Character ;
              cheo:charName ?charName .
        FILTER( LCASE(STR(?charName)) = LCASE(?charInput) )

        # RoleAssignment → Appearance
        ?ra a cheo:RoleAssignment ;
            cheo:inVersion ?ver ;
            cheo:forCharacter ?char ;
            cheo:hasAppearance ?appearance .

        # Lọc chính xác theo uri Appearance
        FILTER( ?appearance = <${uri}> )

        # Thuộc tính
        OPTIONAL { ?appearance cheo:start   ?start }
        OPTIONAL { ?appearance cheo:end     ?end }
        OPTIONAL { ?appearance cheo:emotion ?emotion }
      }
      ORDER BY ?appearance
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const appearances: Appearances = results.map((result: any) => ({
        start: result.start?.value || "",
        end: result.end?.value || "",
        emotion: result.emotion?.value || "",
        vidVersion: result.vidVersion?.value || "",
      }));
      res.json(appearances);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchSceneGeneral: async (req: Request, res: Response) => {
    const { scene } = req.body;
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT
        ?scene (?sceneName AS ?name) (?sceneSummary AS ?summary)
        (?playTitle AS ?inPlay)
        (GROUP_CONCAT(DISTINCT ?charName; SEPARATOR=", ") AS ?allCharacters)
      WHERE {
        # --- Scene theo URI ---
        BIND(<${scene}> AS ?scene)

        ?scene a cheo:Scene .
        OPTIONAL { ?scene cheo:sceneName ?sceneName }
        OPTIONAL { ?scene cheo:sceneSummary ?sceneSummary }

        # --- Scene thuộc Play nào ---
        ?play cheo:hasScene ?scene .
        OPTIONAL { ?play cheo:title ?playTitle }

        # --- Các nhân vật xuất hiện trong Scene ---
        OPTIONAL {
          ?scene cheo:hasVersion ?ver .
          ?ra a cheo:RoleAssignment ;
              cheo:inVersion ?ver ;
              cheo:forCharacter ?char .
          OPTIONAL { ?char cheo:charName ?charName }
        }
      }
      GROUP BY ?scene ?sceneName ?sceneSummary ?play ?playTitle
      ORDER BY LCASE(STR(?sceneName))
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const sceneGenerals: SceneGenerals = results.map((result: any) => ({
        scene: result.scene?.value || "",
        name: result.name?.value || "",
        summary: result.summary?.value || "",
        inPlay: result.inPlay?.value || "",
        allCharacters: formatStringtoArray(result.allCharacters?.value || ""),
      }));

      res.json(sceneGenerals);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },
};

export default searchController;
