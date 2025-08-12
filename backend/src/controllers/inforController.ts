import { runSelectQuery } from "../utils/graphdb";
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
      const results = await runSelectQuery(sparql);
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No characters found" });
      }
      // Extract character names from results
      const characterNames = results.map(
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
      const results = await runSelectQuery(sparql);
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No plays found" });
      }
      // Extract play titles from results
      const playTitles = results.map((result: any) => result.title.value);

      res.json(playTitles);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      res.status(500).json({ error: "Error running SPARQL query" });
    }
  },
};

export default inforController;
