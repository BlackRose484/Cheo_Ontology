import { runSPARQLQuery } from "../utils/graphdb";
import { Request, Response } from "express";
import { createErrorResponse, formatNameForId } from "../utils/formatters";
import { PlayTitlesByCharacter } from "../types/play";
import { EmotionByCharacterAndPlays } from "../types/emotion";
import { CharacterStates } from "../types/character";

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
};

export default searchController;
