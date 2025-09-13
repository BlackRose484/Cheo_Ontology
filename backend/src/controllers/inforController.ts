import { Infor, Library } from "../types";
import { ActorNames } from "../types/actor";
import { CharacterNames } from "../types/character";
import { PlayTitles, SceneNames } from "../types/play";
import { runSPARQLQuery } from "../utils/graphdb";
import { Request, Response } from "express";

const inforController = {
  getCharacterNames: async (req: Request, res: Response) => {
    const sparql = `
      PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?charName
      WHERE {
          ?instance rdf:type ?type .
          ?type rdfs:subClassOf* cheo:Character .
          ?instance cheo:charName ?charName .
      }
      ORDER BY LCASE(?charName)
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No characters found" });
      }
      // Extract character names from results
      const characterNames: CharacterNames = results.map(
        (result: any) => result.charName.value
      );

      res.json(characterNames);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getPlayTitles: async (req: Request, res: Response) => {
    const sparql = `
      PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?title
      WHERE {
        ?instance rdf:type ?type .
        ?type rdfs:subClassOf* cheo:Play .
        ?instance cheo:title ?title .
      }
      ORDER BY LCASE(?title)
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No plays found" });
      }
      // Extract play titles from results
      const playTitles: PlayTitles = results.map(
        (result: any) => result.title.value
      );

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
      // Extract actor names from results
      const actorNames: ActorNames = results.map(
        (result: any) => result.name.value
      );
      res.json(actorNames);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },

  getSceneNames: async (req: Request, res: Response) => {
    const sparql = `PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

      SELECT DISTINCT ?scene ?name
      WHERE {
          ?scene rdf:type/rdfs:subClassOf* cheo:Scene .
          ?scene cheo:sceneName ?name .
      }
      ORDER BY LCASE(?name)
      `;

    try {
      const results = await runSPARQLQuery(sparql);
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No scenes found" });
      }
      // Extract scene names from results
      const sceneNames: SceneNames = results.map(
        (result: any) => result.name.value
      );
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
        BIND("${play}" AS ?qPlay)   # ← tên vở được truyền từ client

        # Tìm đúng Play theo title
        ?play a cheo:Play ;
              cheo:title ?playTitle ;
              cheo:hasScene ?scene .
        FILTER( LCASE(STR(?playTitle)) = LCASE(?qPlay) )

        # Lấy thông tin Scene
        OPTIONAL { ?scene cheo:sceneName ?sceneName }
      }
      ORDER BY ?sceneName`;
    try {
      const results = await runSPARQLQuery(sparql);
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No scenes found" });
      }
      const sceneNames: SceneNames = results.map(
        (result: any) => result.sceneName.value
      );

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

  filterCharactersByCategory: async (req: Request, res: Response) => {
    const { mainType, subType } = req.body;
    const sparql = `PREFIX Cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT DISTINCT ?charName
      WHERE {
        ?char rdf:type Cheo:Character ;
              Cheo:charName ?charName ;
              Cheo:mainType ?mainType ;
              Cheo:subType ?subType .

        # Nếu có mainType đầu vào
        BIND("${mainType}" AS ?qMainType)
        FILTER( ?qMainType = "" || LCASE(STR(?mainType)) = LCASE(?qMainType) )

        # Nếu có subType đầu vào
        BIND("${subType}" AS ?qSubType)
        FILTER( ?qSubType = "" || LCASE(STR(?subType)) = LCASE(?qSubType) )
      }
      ORDER BY LCASE(?charName)`;
    try {
      const results = await runSPARQLQuery(sparql);
      const characters = results.map((result: any) => result?.charName?.value);
      res.json(characters);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },
};

export default inforController;
