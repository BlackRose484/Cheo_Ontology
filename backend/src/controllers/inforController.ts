import { Infor, Library } from "../types";
import { ActorNames } from "../types/actor";
import { CharacterNames } from "../types/character";
import { PlayTitles, SceneNames } from "../types/play";
import { runSPARQLQuery } from "../utils/graphdb";
import { DirectQueryService } from "../services/cache/directQueryService";
import { RedisCachedQueryService } from "../services/cache/redisCachedQueryService";
import { Request, Response } from "express";

const CACHE_ENABLED = process.env.CACHE_ENABLED === "true";

const inforController = {
  getCharacterNames: async (req: Request, res: Response) => {
    try {
      let results;

      if (CACHE_ENABLED) {
        results = await RedisCachedQueryService.getAllCharacters();
      } else {
        results = await DirectQueryService.getAllCharacters();
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No characters found" });
      }
      // Extract character names from results
      const characterNames: CharacterNames = results.map((result: any) => ({
        char: result?.char?.value || result?.char,
        charName: result?.charName?.value || result?.charName,
      }));

      res.json(characterNames);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getPlayTitles: async (req: Request, res: Response) => {
    try {
      let results;

      if (CACHE_ENABLED) {
        results = await RedisCachedQueryService.getAllPlays();
      } else {
        results = await DirectQueryService.getAllPlays();
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No plays found" });
      }
      const playTitles: PlayTitles = results.map((result: any) => ({
        play: result?.play?.value || result?.play,
        title: result?.title?.value || result?.title,
      }));

      res.json(playTitles);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },
  getFullInfor: async (req: Request, res: Response) => {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT DISTINCT (STRAFTER(STR(?class), STR(Cheo:)) AS ?className)
        WHERE {
          ?entity rdf:type ?class .
          FILTER(STRSTARTS(STR(?class), STR(Cheo:)))
        }
        ORDER BY ?class
    `;

    try {
      const results = await runSPARQLQuery(sparql);

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No classes found" });
      }

      const classNames: Infor = results.map(
        (result: any) => result.className.value
      );

      res.json(classNames);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getActorNames: async (req: Request, res: Response) => {
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?actor ?name
      WHERE {
          ?actor rdf:type/rdfs:subClassOf* cheo:Actor .
          ?actor cheo:actorName ?name .
      }
      ORDER BY LCASE(?name)
      `;

    try {
      const results = await runSPARQLQuery(sparql);

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No actors found" });
      }
      const actorNames: ActorNames = results.map((result: any) => ({
        actor: result?.actor.value,
        name: result?.name.value,
      }));

      res.json(actorNames);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getSceneNames: async (req: Request, res: Response) => {
    try {
      let results;

      if (CACHE_ENABLED) {
        results = await RedisCachedQueryService.getAllScenes();
      } else {
        results = await DirectQueryService.getAllScenes();
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No scenes found" });
      }

      const sceneNames: SceneNames = results.map((result: any) => ({
        scene: result?.scene?.value || result?.scene,
        name: result?.sceneName?.value || result?.sceneName,
      }));

      res.json(sceneNames);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getSceneNamesByPlay: async (req: Request, res: Response) => {
    const { play } = req.body;
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?scene ?sceneName
      WHERE {
        # Play theo URI
        BIND(<${play}> AS ?play)

        ?play a cheo:Play ;
              cheo:hasScene ?scene .

        # Lấy thông tin Scene
        OPTIONAL { ?scene cheo:sceneName ?sceneName }
      }
      ORDER BY ?sceneName
    `;
    try {
      const results = await runSPARQLQuery(sparql);

      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No scenes found" });
      }
      const sceneNames: SceneNames = results.map((result: any) => ({
        scene: result?.scene?.value,
        name: result?.sceneName?.value,
      }));

      const uniqueSceneNames = Array.from(new Set(sceneNames));

      res.json(uniqueSceneNames);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getLibrary: async (req: Request, res: Response) => {
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT
        ?vidVersion                                   # Link video
        ?sceneName                                    # Tên trích đoạn
        ?duration                                     # Thời lượng (Version hoặc Scene)
        ?sceneSummary                                 # Tóm tắt trích đoạn
        ?playTitle                                    # Thuộc vở chèo nào
        (GROUP_CONCAT(DISTINCT ?charLabel;  SEPARATOR=", ") AS ?characters)
        (GROUP_CONCAT(DISTINCT ?actorLabel; SEPARATOR=", ") AS ?actors)
      WHERE {
        # Version có link video
        ?ver a cheo:Version ; cheo:vidVersion ?vid .
        BIND(STR(?vid) AS ?vidVersion)

        # Version thuộc Scene nào
        ?scene a cheo:Scene ; cheo:hasVersion ?ver .
        OPTIONAL { ?scene cheo:sceneName    ?sceneName }
        OPTIONAL { ?scene cheo:sceneSummary ?sceneSummary }

        # Thời lượng: ưu tiên lấy ở Version; nếu không có thì lấy ở Scene
        OPTIONAL { ?ver   cheo:videoDuration  ?durVer }
        OPTIONAL { ?scene cheo:sceneDuration  ?durScene }
        BIND(COALESCE(?durVer, ?durScene) AS ?duration)

        # Scene thuộc Play nào
        ?play cheo:hasScene ?scene .
        OPTIONAL { ?play cheo:title ?playTitle }

        # Các nhân vật/diễn viên tham gia trong CHÍNH Version này
        OPTIONAL {
          ?ra a cheo:RoleAssignment ;
              cheo:inVersion ?ver ;
              cheo:forCharacter ?char .
          OPTIONAL { ?char cheo:charName ?charName }
          BIND(COALESCE(?charName, STRAFTER(STR(?char), "#")) AS ?charLabel)

          { ?ra cheo:performedBy ?actor } UNION { ?ra cheo:performBy ?actor }
          OPTIONAL { ?actor cheo:actorName ?actorName }
          BIND(COALESCE(?actorName, STRAFTER(STR(?actor), "#")) AS ?actorLabel)
        }
      }
      GROUP BY ?vidVersion ?sceneName ?duration ?sceneSummary ?playTitle
      ORDER BY LCASE(STR(?sceneName)) ?vidVersion`;

    try {
      const results = await runSPARQLQuery(sparql);
      const library: Library = results.map((result: any) => ({
        vidVersion: result?.vidVersion?.value,
        sceneName: result?.sceneName?.value,
        duration: result?.duration?.value,
        sceneSummary: result?.sceneSummary?.value,
        playTitle: result?.playTitle?.value,
        characters: result?.characters?.value.split(", "),
        actors: result?.actors?.value.split(", "),
      }));
      res.json(library);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getMainTypeCategories: async (req: Request, res: Response) => {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?mainType
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:mainType ?mainType .
      }
      ORDER BY ?mainType
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const mainTypes = results.map((result: any) => result?.mainType?.value);
      res.json(mainTypes);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },
  getSubTypeCategories: async (req: Request, res: Response) => {
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      SELECT DISTINCT ?subType
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:subType ?subType .
      }
      ORDER BY ?subType
    `;
    try {
      const results = await runSPARQLQuery(sparql);
      const subTypes = results.map((result: any) => result?.subType?.value);
      res.json(subTypes);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getSubTypesByMainType: async (req: Request, res: Response) => {
    const { mainType } = req.body;
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?subType
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType .
        FILTER(LCASE(STR(?mainType)) = LCASE("${mainType}"))
      }
      ORDER BY ?subType
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      const subTypes = results.map((result: any) => result?.subType?.value);
      res.json(subTypes);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  filterCharactersByCategory: async (req: Request, res: Response) => {
    const { mainType, subType } = req.body;
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
         PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
         
         SELECT ?char ?charName
         WHERE {
           ?char a Cheo:Character ;
                 Cheo:charName ?charName .
           FILTER(STR(?charName) != "...")
           ${mainType ? `?char Cheo:mainType "${mainType}" .` : ""}
           ${subType ? `?char Cheo:subType "${subType}" .` : ""}
         }
         ORDER BY LCASE(STR(?charName))`;

    try {
      const results = await runSPARQLQuery(sparql);

      const characters: CharacterNames = results.map((result: any) => ({
        char: result?.char?.value || result?.char,
        charName: result?.charName?.value || result?.charName,
      }));
      res.json(characters);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },
};

export default inforController;
