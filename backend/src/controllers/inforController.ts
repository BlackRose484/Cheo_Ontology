import { Infor } from "../types";
import { ActorNames } from "../types/actor";
import { CharacterNames } from "../types/character";
import { PlayTitles } from "../types/play";
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
};

export default inforController;
