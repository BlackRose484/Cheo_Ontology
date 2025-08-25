// src/graphdb.ts
import { runSPARQLQuery as runLocalSPARQLQuery } from "./localOwlAdapter";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const GRAPHDB_ENDPOINT = process.env.GRAPHDB_ENDPOINT;
const USE_LOCAL_OWL = process.env.USE_LOCAL_OWL !== "false"; // Mặc định sử dụng OWL local

export const runSPARQLQuery = async (sparql: string) => {
  // Ưu tiên sử dụng OWL file local
  if (USE_LOCAL_OWL) {
    try {
      return await runLocalSPARQLQuery(sparql);
    } catch (localError) {
      console.warn(
        "Local OWL query failed, falling back to GraphDB:",
        localError
      );

      // Fallback sang GraphDB nếu local không thành công
      if (!GRAPHDB_ENDPOINT) {
        console.error("No GraphDB endpoint configured and local OWL failed");
        return [];
      }
    }
  }

  // Fallback hoặc sử dụng GraphDB nếu được cấu hình
  if (GRAPHDB_ENDPOINT) {
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
      console.error("GraphDB SPARQL query failed:", err);
      return [];
    }
  }

  console.error("No SPARQL endpoint available (neither local OWL nor GraphDB)");
  return [];
};
