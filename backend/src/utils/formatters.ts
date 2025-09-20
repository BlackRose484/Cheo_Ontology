// Utility functions for formatting SPARQL query results
import { ApiResponse } from "../types";

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

export const formatNameForId = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

export const formatStringtoArray = (str: string): string[] => {
  try {
    return str.split(",").map((item) => item.trim());
  } catch (error) {
    return [];
  }
};

export const formatForScenes = (
  str: string,
  regex1: string,
  regex2: string
) => {
  try {
    return str.split(regex2).map((item) => {
      const [scene, name] = item.split(regex1).map((part) => part.trim());
      return { scene, name };
    });
  } catch (error) {
    return [];
  }
};
