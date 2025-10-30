import { QueryEngine } from "@comunica/query-sparql-file";
import * as path from "path";
import * as fs from "fs";

const OWL_FILE_PATH = path.join(__dirname, "../db/OntologyCheo1.owl");

const queryEngine = new QueryEngine();

export const runSPARQLQuery = async (sparql: string) => {
  try {
    if (!fs.existsSync(OWL_FILE_PATH)) {
      throw new Error(`OWL file not found at: ${OWL_FILE_PATH}`);
    }

    const bindingsStream = await queryEngine.queryBindings(sparql, {
      sources: [OWL_FILE_PATH],
    });

    const bindings = await bindingsStream.toArray();

    const results = bindings.map((binding) => {
      const result: any = {};

      binding.forEach((term, variable) => {
        result[variable.value] = {
          type: term.termType === "Literal" ? "literal" : "uri",
          value: term.value,
          datatype:
            term.termType === "Literal" && (term as any).datatype
              ? (term as any).datatype.value
              : undefined,
        };
      });

      return result;
    });

    return results;
  } catch (error) {
    console.error("Local OWL SPARQL query failed:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return [];
  }
};

export { runSPARQLQuery as runLocalSPARQLQuery };
