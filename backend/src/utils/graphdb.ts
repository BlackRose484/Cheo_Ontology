// src/graphdb.ts
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const GRAPHDB_ENDPOINT = process.env.GRAPHDB_ENDPOINT!;

export const runSelectQuery = async (sparql: string) => {
  try {
    const res = await axios.post(
      GRAPHDB_ENDPOINT,
      `query=${encodeURIComponent(sparql)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/sparql-results+json",
        },
      }
    );

    return res.data.results.bindings;
  } catch (err) {
    console.error("SPARQL query failed:", err);
    return [];
  }
};
