// Utility functions for formatting SPARQL query results
import {
  CharacterSparqlResult,
  SceneSparqlResult,
  PlaySparqlResult,
  Character,
  Scene,
  Play,
  ApiResponse,
  BaseEntity,
  BaseSparqlResult,
} from "../types";

/**
 * Generic function to extract ID from URI
 * @param uri - The URI string
 * @returns Extracted ID
 */
export const extractIdFromUri = (uri: string): string => {
  return uri.split("#").pop() || uri.split("/").pop() || uri;
};

/**
 * Format SPARQL query results for character data
 * @param sparqlResults - Raw results from SPARQL query
 * @returns Formatted character data
 */
export const formatCharacterResults = (
  sparqlResults: CharacterSparqlResult[]
): Character[] => {
  if (!Array.isArray(sparqlResults)) {
    return [];
  }

  return sparqlResults.map((result) => {
    // Extract ID from URI (get the part after #)
    const id = result.character?.value
      ? extractIdFromUri(result.character.value)
      : "";

    const character: Character = {
      id,
      name: result.name?.value || "",
    };

    // Add optional fields only if they exist
    if (result.description?.value) {
      character.description = result.description.value;
    }

    if (result.gender?.value) {
      character.gender = result.gender.value;
    }

    if (result.role?.value) {
      character.role = result.role.value;
    }

    return character;
  });
};

/**
 * Format SPARQL query results for scene data
 * @param sparqlResults - Raw results from SPARQL query
 * @returns Formatted scene data
 */
export const formatSceneResults = (
  sparqlResults: SceneSparqlResult[]
): Scene[] => {
  if (!Array.isArray(sparqlResults)) {
    return [];
  }

  return sparqlResults.map((result) => {
    const id = result.scene?.value ? extractIdFromUri(result.scene.value) : "";

    const scene: Scene = {
      id,
      name: result.name?.value || "",
    };

    if (result.description?.value) {
      scene.description = result.description.value;
    }

    if (result.act?.value) {
      scene.act = result.act.value;
    }

    if (result.location?.value) {
      scene.location = result.location.value;
    }

    return scene;
  });
};

/**
 * Format SPARQL query results for play data
 * @param sparqlResults - Raw results from SPARQL query
 * @returns Formatted play data
 */
export const formatPlayResults = (
  sparqlResults: PlaySparqlResult[]
): Play[] => {
  if (!Array.isArray(sparqlResults)) {
    return [];
  }

  return sparqlResults.map((result) => {
    const id = result.play?.value ? extractIdFromUri(result.play.value) : "";

    const play: Play = {
      id,
      name: result.title?.value || result.name?.value || "",
    };

    if (result.title?.value) {
      play.title = result.title.value;
    }

    if (result.description?.value) {
      play.description = result.description.value;
    }

    if (result.author?.value) {
      play.author = result.author.value;
    }

    if (result.genre?.value) {
      play.genre = result.genre.value;
    }

    if (result.year?.value) {
      play.year = parseInt(result.year.value, 10);
    }

    return play;
  });
};

/**
 * Create a standardized API response
 * @param data - The data to return
 * @param message - Optional message
 * @returns Standardized API response
 */
export const createApiResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };

  // Add count if data is an array
  if (Array.isArray(data)) {
    response.count = data.length;
  }

  if (message) {
    response.message = message;
  }

  return response;
};

/**
 * Create an error response
 * @param message - Error message
 * @param data - Optional error data
 * @returns Standardized error response
 */
export const createErrorResponse = (
  message: string,
  data?: any
): ApiResponse<any> => {
  return {
    success: false,
    data: data || null,
    message,
  };
};
