import { runSelectQuery } from "../utils/graphdb";
import { Request, Response } from "express";
import {
  formatCharacterResults,
  createApiResponse,
  createErrorResponse,
} from "../utils/formatters";
import { SearchCharacterRequest } from "../types";

const searchController = {
  searchCharacter: async (
    req: Request<{}, {}, SearchCharacterRequest>,
    res: Response
  ) => {
    console.log("Received search request:", req.body);
    const { name } = req.body;
    if (!name) {
      const errorResponse = createErrorResponse(
        "Name query parameter is required."
      );
      return res.status(400).json(errorResponse);
    }

    const sparql = `
        PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

        SELECT ?character ?name ?description ?gender ?role
        WHERE {
          ?character rdf:type cheo:Character .
          ?character cheo:name ?name .
          FILTER (lcase(str(?name)) = lcase("${name}")) .
          
          OPTIONAL { ?character cheo:description ?description. }
          OPTIONAL { ?character cheo:gender ?gender. }
          OPTIONAL { ?character cheo:role ?role. }
        }
    `;

    try {
      const results = await runSelectQuery(sparql);
      const formattedCharacters = formatCharacterResults(results);
      const response = createApiResponse(
        formattedCharacters,
        `Found ${formattedCharacters.length} character(s) matching "${name}"`
      );
      res.json(response);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  searchAllCharacters: async (req: Request, res: Response) => {
    const sparql = `
      PREFIX cheo: <http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT ?character ?name ?description ?gender ?role
      WHERE {
        ?character rdf:type cheo:Character .
        
        OPTIONAL { ?character cheo:name ?name. }
        OPTIONAL { ?character cheo:description ?description. }
        OPTIONAL { ?character cheo:gender ?gender. }
        OPTIONAL { ?character cheo:role ?role. }
      }
      ORDER BY ?name
    `;
    try {
      const results = await runSelectQuery(sparql);
      const formattedCharacters = formatCharacterResults(results);
      const response = createApiResponse(
        formattedCharacters,
        `Retrieved ${formattedCharacters.length} character(s)`
      );
      res.json(response);
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
