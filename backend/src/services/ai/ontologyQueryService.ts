import { IntentAnalysis } from "./geminiService";
import { runSPARQLQuery } from "../../utils/graphdb";

export class OntologyQueryService {
  static async queryByIntent(analysis: IntentAnalysis) {
    try {
      switch (analysis.intent) {
        case "find_character":
          return await this.findCharacters(analysis.filters || {});
        case "find_play":
          return await this.findPlays(analysis.filters || {});
        case "find_scene":
          return await this.findScenes(analysis.filters || {});
        case "find_actor":
          return await this.findActors(analysis.filters || {});
        case "find_emotion":
          return await this.findEmotions(analysis.filters || {});
        default:
          return null;
      }
    } catch (error) {
      console.error("Ontology query error:", error);
      return null;
    }
  }

  private static async findCharacters(filters: any) {
    let sparql = `
      PREFIX cheo: <http://www.semanticweb.org/ontology/cheo#>
      SELECT DISTINCT ?character ?name ?gender ?description ?play
      WHERE {
        ?character a cheo:Character ;
                   cheo:hasName ?name .
        OPTIONAL { ?character cheo:hasGender ?gender }
        OPTIONAL { ?character cheo:hasDescription ?description }
        OPTIONAL { ?character cheo:appearsIn ?play }
    `;

    // Add filters
    const conditions = [];
    if (filters.gender) {
      conditions.push(
        `FILTER(CONTAINS(LCASE(STR(?gender)), "${filters.gender.toLowerCase()}"))`
      );
    }
    if (filters.play) {
      conditions.push(
        `FILTER(CONTAINS(LCASE(STR(?play)), "${filters.play.toLowerCase()}"))`
      );
    }
    if (filters.character) {
      conditions.push(
        `FILTER(CONTAINS(LCASE(STR(?name)), "${filters.character.toLowerCase()}"))`
      );
    }

    if (conditions.length > 0) {
      sparql += " " + conditions.join(" ");
    }

    sparql += ` } LIMIT 10`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "characters",
        count: results?.length || 0,
        data: results || [],
        query: sparql,
      };
    } catch (error) {
      console.error("Character query error:", error);
      return {
        type: "characters",
        count: 0,
        data: [],
        error: "Failed to query characters",
      };
    }
  }

  private static async findPlays(filters: any) {
    let sparql = `
      PREFIX cheo: <http://www.semanticweb.org/ontology/cheo#>
      SELECT DISTINCT ?play ?title ?author ?description
      WHERE {
        ?play a cheo:Play ;
              cheo:hasTitle ?title .
        OPTIONAL { ?play cheo:hasAuthor ?author }
        OPTIONAL { ?play cheo:hasDescription ?description }
    `;

    if (filters.play) {
      sparql += ` FILTER(CONTAINS(LCASE(STR(?title)), "${filters.play.toLowerCase()}"))`;
    }

    sparql += ` } LIMIT 10`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "plays",
        count: results?.length || 0,
        data: results || [],
        query: sparql,
      };
    } catch (error) {
      console.error("Play query error:", error);
      return {
        type: "plays",
        count: 0,
        data: [],
        error: "Failed to query plays",
      };
    }
  }

  private static async findScenes(filters: any) {
    const sparql = `
      PREFIX cheo: <http://www.semanticweb.org/ontology/cheo#>
      SELECT DISTINCT ?scene ?title ?description ?play
      WHERE {
        ?scene a cheo:Scene ;
               cheo:hasTitle ?title .
        OPTIONAL { ?scene cheo:hasDescription ?description }
        OPTIONAL { ?scene cheo:belongsToPlay ?play }
      } LIMIT 10
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "scenes",
        count: results?.length || 0,
        data: results || [],
        query: sparql,
      };
    } catch (error) {
      console.error("Scene query error:", error);
      return {
        type: "scenes",
        count: 0,
        data: [],
        error: "Failed to query scenes",
      };
    }
  }

  private static async findActors(filters: any) {
    let sparql = `
      PREFIX cheo: <http://www.semanticweb.org/ontology/cheo#>
      SELECT DISTINCT ?actor ?name ?gender ?character
      WHERE {
        ?actor a cheo:Actor ;
               cheo:hasName ?name .
        OPTIONAL { ?actor cheo:hasGender ?gender }
        OPTIONAL { ?actor cheo:playsCharacter ?character }
    `;

    if (filters.gender) {
      sparql += ` FILTER(CONTAINS(LCASE(STR(?gender)), "${filters.gender.toLowerCase()}"))`;
    }

    sparql += ` } LIMIT 10`;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "actors",
        count: results?.length || 0,
        data: results || [],
        query: sparql,
      };
    } catch (error) {
      console.error("Actor query error:", error);
      return {
        type: "actors",
        count: 0,
        data: [],
        error: "Failed to query actors",
      };
    }
  }

  private static async findEmotions(filters: any) {
    const sparql = `
      PREFIX cheo: <http://www.semanticweb.org/ontology/cheo#>
      SELECT DISTINCT ?emotion ?type ?character ?scene
      WHERE {
        ?emotion a cheo:Emotion ;
                cheo:hasType ?type .
        OPTIONAL { ?emotion cheo:expressedByCharacter ?character }
        OPTIONAL { ?emotion cheo:appearsInScene ?scene }
      } LIMIT 10
    `;

    try {
      const results = await runSPARQLQuery(sparql);
      return {
        type: "emotions",
        count: results?.length || 0,
        data: results || [],
        query: sparql,
      };
    } catch (error) {
      console.error("Emotion query error:", error);
      return {
        type: "emotions",
        count: 0,
        data: [],
        error: "Failed to query emotions",
      };
    }
  }
}
