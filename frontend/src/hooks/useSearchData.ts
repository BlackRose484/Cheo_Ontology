import { getScenesAndPlayByCharacter } from "./../apis/search";
import { useState, useEffect, useCallback } from "react";
import { getCharacters, getFullInformation } from "@/apis/infor";
import { getEmotionsByCharacterAndScene } from "@/apis/search";
import { CharacterNames, SceneAndPlays } from "@/types";

export const useSearchData = () => {
  const [characters, setCharacters] = useState<CharacterNames>([]);
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

  const fetchSceneAndPlaysByCharacter = useCallback(
    async (characterName: string): Promise<SceneAndPlays> => {
      try {
        const response = await getScenesAndPlayByCharacter(characterName);
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch scenes and plays by character:", error);
        return [];
      }
    },
    []
  );

  const fetchExpressionsByCharacterAndScene = useCallback(
    async (characterName: string, sceneName: string): Promise<string[]> => {
      try {
        const response = await getEmotionsByCharacterAndScene(
          characterName,
          sceneName
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
    fetchSceneAndPlaysByCharacter,
    fetchExpressionsByCharacterAndScene,
    refetchCharacters: fetchCharacters,
    refetchCategories: fetchCategories,
  };
};

export default useSearchData;
