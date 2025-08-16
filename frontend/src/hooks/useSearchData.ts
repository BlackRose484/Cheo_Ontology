import { useState, useEffect, useCallback } from "react";
import { getCharacters, getFullInformation } from "@/apis/infor";
import {
  getPlaysByCharacter,
  getEmotionsByCharacterAndPlay,
} from "@/apis/search";

export const useSearchData = () => {
  const [characters, setCharacters] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCharacters = async () => {
    try {
      setIsLoading(true);
      const response = await getCharacters();
      setCharacters(response.data);
    } catch (error) {
      console.error("Failed to fetch characters:", error);
      setCharacters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await getFullInformation();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlaysByCharacter = useCallback(
    async (characterName: string): Promise<string[]> => {
      try {
        const response = await getPlaysByCharacter(characterName);
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch plays by character:", error);
        return [];
      }
    },
    []
  );

  const fetchExpressionsByCharacterAndPlay = useCallback(
    async (characterName: string, playName: string): Promise<string[]> => {
      try {
        const response = await getEmotionsByCharacterAndPlay(
          characterName,
          playName
        );
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch expressions:", error);
        return [];
      }
    },
    []
  );

  useEffect(() => {
    fetchCharacters();
    fetchCategories();
  }, []);

  return {
    characters,
    categories,
    isLoading,
    fetchPlaysByCharacter,
    fetchExpressionsByCharacterAndPlay,
    refetchCharacters: fetchCharacters,
    refetchCategories: fetchCategories,
  };
};

export default useSearchData;
