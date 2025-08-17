import { Play } from "./../../../frontend/src/types/index";
import { ActorGenerals } from "./../types/actor";
import { runSPARQLQuery } from "../utils/graphdb";
import { Request, Response } from "express";
import { createErrorResponse, formatNameForId } from "../utils/formatters";
import {
  Appearances,
  PlayGenerals,
  PlayTitlesByCharacter,
} from "../types/play";
import { EmotionByCharacterAndPlays } from "../types/emotion";
import { CharacterGenerals, CharacterStates } from "../types/character";

const searchController = {
  searchPlayByCharacter: async (req: Request, res: Response) => {
    const character = req.body.character;
    const character_ = formatNameForId(character);
    const sparql = `
      PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?play ?title
      WHERE {
        VALUES ?char { cheo:char_${character_}}
        ?play rdf:type cheo:Play ;
              cheo:hasCharacter ?char .
        OPTIONAL { ?play cheo:title ?title }
      }
      ORDER BY LCASE(STR(?title))
    `;

    try {
      const results = await runSPARQLQuery(sparql);
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

  searchEmotionByCharacterAndPlay: async (req: Request, res: Response) => {
    const { character, play } = req.body;
    const character_ = formatNameForId(character);
    const play_ = formatNameForId(play);

    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
        PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT DISTINCT ?emotion
        WHERE {
          BIND(cheo:play_${play_} AS ?play)

          ?play  cheo:hasScene   ?scene .
          ?scene cheo:hasVersion ?ver .

          ?ra a cheo:RoleAssignment ;
              cheo:inVersion    ?ver ;
              cheo:forCharacter cheo:char_${character_};
              cheo:hasAppearance ?app .

          OPTIONAL { ?app cheo:emotion ?emotion }  # emotion là literal
        }
        ORDER BY ?emotion
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const emotions: EmotionByCharacterAndPlays = results.map(
        (result: any) => result.emotion.value
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
  searchByCharPlayEMo: async (req: Request, res: Response) => {
    const { character, play, emotion } = req.body;
    const play_ = formatNameForId(play);
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT
        ?charName           # Tên nhân vật
        ?charGender         # Giới tính nhân vật
        ?playTitle          # Vở kịch
        ?sceneName          # Phân cảnh (trích đoạn)
        ?emotion            # Nét biểu cảm
        ?actorName          # Diễn viên (ứng với Appearance này)
        ?appearance         # ID/cá thể Appearance (cho nút Chi tiết)
      WHERE {
        # ---- Tham số ----
        VALUES ?play { cheo:play_${play_} }     # vở chèo
        BIND("${character}" AS ?charInput)          # tên nhân vật (literal)
        BIND("${
          emotion == "all" ? "" : emotion
        }" AS ?emoInput)               # biểu cảm (literal)

        OPTIONAL { ?play cheo:title ?playTitle }

        # Tìm cá thể Character theo tên
        ?char a cheo:Character ; cheo:charName ?charName .
        FILTER( regex(STR(?charName), ?charInput, "i") )
        OPTIONAL { ?char cheo:charGender ?charGender }   # <-- giới tính

        # Play → Scene → Version
        ?play  cheo:hasScene   ?scene .
        OPTIONAL { ?scene cheo:sceneName ?sceneName }
        ?scene cheo:hasVersion ?ver .

        # RoleAssignment của nhân vật đó trong version, kéo ra Appearance
        ?ra a cheo:RoleAssignment ;
            cheo:inVersion    ?ver ;
            cheo:forCharacter ?char ;
            cheo:hasAppearance ?appearance .

        # Lọc theo emotion trên Appearance
        ?appearance cheo:emotion ?emotion .
        FILTER( regex(STR(?emotion), ?emoInput, "i") )

        # Diễn viên gắn với RoleAssignment này
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
    const character_ = formatNameForId(character);
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT DISTINCT ?character ?description ?gender ?name ?role ?charGender ?charName ?mainType ?subType
        WHERE {
            ?character rdf:type/rdfs:subClassOf* cheo:Character .
          
            FILTER CONTAINS(STR(?character), "${character_}") 
            
            # Lấy các thông tin liên quan
            OPTIONAL { ?character cheo:description ?description . }
            OPTIONAL { ?character cheo:gender ?gender . }
            OPTIONAL { ?character cheo:role ?role . }
            OPTIONAL { ?character cheo:charGender ?charGender . }
            OPTIONAL { ?character cheo:charName ?charName . }
            OPTIONAL { ?character cheo:mainType ?mainType . }
            OPTIONAL { ?character cheo:subType ?subType . }
        }
      `;
    try {
      const results = await runSPARQLQuery(sparql);
      const characterGenerals: CharacterGenerals = results.map(
        (result: any) => ({
          description: result.description?.value || "",
          gender: result.gender?.value || "",
          role: result.role?.value || "",
          charGender: result.charGender?.value || "",
          charName: result.charName?.value || "",
          mainType: result.mainType?.value || "",
          subType: result.subType?.value || "",
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

    const play_ = formatNameForId(play);
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?play ?author ?summary ?title ?sceneNumber 
      WHERE {
          ?play a cheo:Play .
          FILTER CONTAINS(STR(?play), "${play_}")

          OPTIONAL {?play cheo:author ?author}
          OPTIONAL {?play cheo:summary ?summary}
          OPTIONAL {?play cheo:title ?title}
          OPTIONAL {?play cheo:sceneNumber ?sceneNumber} 
      }
    `;
    try {
      const results = await runSPARQLQuery(sparql);
      const playGenerals: PlayGenerals = results.map((result: any) => ({
        author: result.author?.value || "",
        summary: result.summary?.value || "",
        title: result.title?.value || "",
        sceneNumber: result.sceneNumber?.value || 0,
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
    const actor_ = formatNameForId(actor);
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?actor ?actorGender ?actorName 
      WHERE {
          ?actor a cheo:Actor .
          FILTER CONTAINS(STR(?actor), "${actor_}")

          OPTIONAL {?actor cheo:actorGender ?actorGender}
          OPTIONAL {?actor cheo:actorName ?actorName}
          
    }`;

    try {
      const results = await runSPARQLQuery(sparql);
      const actorGenerals: ActorGenerals = results.map((result: any) => ({
        actor: result.actor?.value || "",
        actorGender: result.actorGender?.value || "",
        actorName: result.actorName?.value || "",
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
    const { character, play, emotion } = req.body;
    const play_ = formatNameForId(play);

    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
        PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT DISTINCT
          ?start
          ?end
          ?emotion
          (STR(?vidLink) AS ?vidVersion)
        WHERE {
          # ---- Tham số ----
          VALUES ?play { cheo:play_${play_} }
          BIND("${character}" AS ?charInput)
          BIND("${emotion}" AS ?emoInput)

          # Character theo tên
          ?char a cheo:Character ; cheo:charName ?charName .
          FILTER( regex(STR(?charName), ?charInput, "i") )

          # Play → Scene → Version
          ?play cheo:hasScene ?scene .
          ?scene cheo:hasVersion ?ver .
          OPTIONAL { ?ver cheo:vidVersion ?vidLink }

          # RoleAssignment của nhân vật → Appearance
          ?ra a cheo:RoleAssignment ;
              cheo:inVersion    ?ver ;
              cheo:forCharacter ?char ;
              cheo:hasAppearance ?appearance .

          # Các thuộc tính của Appearance
          OPTIONAL { ?appearance cheo:start   ?start }
          OPTIONAL { ?appearance cheo:end     ?end }
          OPTIONAL { ?appearance cheo:emotion ?emotion }

          # Lọc theo emotion
          FILTER( regex(STR(?emotion), ?emoInput, "i") )
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
};

export default searchController;
