import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import * as searchApi from "@/apis/search";
import type {
  CharacterGenerals,
  PlayGenerals,
  ActorGenerals,
  SceneGenerals,
  CharacterStates,
} from "@/types";

// ================================
// Search Hooks with Caching
// ================================

export const useAllCharacters = () => {
  return useQuery({
    queryKey: queryKeys.search.characters(),
    queryFn: searchApi.getAllCharacters,
    staleTime: 1000 * 60 * 10, // 10 minutes - characters don't change often
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    select: (data) => data?.data || [], // Transform response if needed
  });
};

export const useCharacterByName = (name: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.search.characterByName(name),
    queryFn: () => searchApi.getCharacterByName(name),
    enabled: enabled && !!name.trim(),
    staleTime: 1000 * 60 * 15, // 15 minutes for specific character data
    select: (data) => data?.data as CharacterGenerals,
  });
};

export const usePlaysByCharacter = (
  character: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.search.playsByCharacter(character),
    queryFn: () => searchApi.getPlaysByCharacter(character),
    enabled: enabled && !!character.trim(),
    staleTime: 1000 * 60 * 10,
    select: (data) => data?.data || [],
  });
};

export const useScenesAndPlayByCharacter = (
  character: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.search.scenesAndPlayByCharacter(character),
    queryFn: () => searchApi.getScenesAndPlayByCharacter(character),
    enabled: enabled && !!character.trim(),
    staleTime: 1000 * 60 * 10,
    select: (data) => data?.data || [],
  });
};

export const useEmotionsByCharacterAndScene = (
  character: string,
  scene: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.search.emotionsByCharacterAndScene(character, scene),
    queryFn: () => searchApi.getEmotionsByCharacterAndScene(character, scene),
    enabled: enabled && !!character.trim() && !!scene.trim(),
    staleTime: 1000 * 60 * 5, // 5 minutes for emotion data
    select: (data) => data?.data || [],
  });
};

export const useCharacterStates = (
  character: string,
  scene: string,
  emotion: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.search.characterStates(character, scene, emotion),
    queryFn: () => searchApi.getCharacterStates(character, scene, emotion),
    enabled:
      enabled && !!character.trim() && !!scene.trim() && !!emotion.trim(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data as CharacterStates,
  });
};

// General Search Hooks
export const useActorGeneral = (actor: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.search.actorByName(actor),
    queryFn: () => searchApi.searchActorGeneral(actor),
    enabled: enabled && !!actor.trim(),
    staleTime: 1000 * 60 * 15,
    select: (data) => data?.data as ActorGenerals,
  });
};

export const usePlayGeneral = (play: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.search.playByName(play),
    queryFn: () => searchApi.searchPlayGeneral(play),
    enabled: enabled && !!play.trim(),
    staleTime: 1000 * 60 * 15,
    select: (data) => data?.data as PlayGenerals,
  });
};

export const useCharacterGeneral = (
  character: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.search.characterByName(character),
    queryFn: () => searchApi.searchCharacterGeneral(character),
    enabled: enabled && !!character.trim(),
    staleTime: 1000 * 60 * 15,
    select: (data) => data?.data as CharacterGenerals,
  });
};

export const useSceneGeneral = (scene: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.search.sceneByName(scene),
    queryFn: () => searchApi.searchSceneGeneral(scene),
    enabled: enabled && !!scene.trim(),
    staleTime: 1000 * 60 * 15,
    select: (data) => data?.data as SceneGenerals,
  });
};

export const useAppearanceSearch = (
  character: string,
  play: string,
  emotion: string,
  uri: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.search.appearances(character, play, emotion, uri),
    queryFn: () => searchApi.searchAppearance(character, play, emotion, uri),
    enabled: enabled && !!character && !!play && !!emotion && !!uri,
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data || [],
  });
};

// ================================
// Prefetch Hooks for Performance
// ================================

export const usePrefetchCharacter = () => {
  const queryClient = useQueryClient();

  return (name: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.search.characterByName(name),
      queryFn: () => searchApi.getCharacterByName(name),
      staleTime: 1000 * 60 * 10,
    });
  };
};

export const usePrefetchPlay = () => {
  const queryClient = useQueryClient();

  return (name: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.search.playByName(name),
      queryFn: () => searchApi.searchPlayGeneral(name),
      staleTime: 1000 * 60 * 10,
    });
  };
};

// ================================
// Cache Invalidation Hooks
// ================================

export const useInvalidateSearchCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.search.all });
    },
    invalidateCharacters: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.search.characters(),
      });
    },
    invalidatePlays: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.search.plays() });
    },
    invalidateActors: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.search.actors() });
    },
    invalidateScenes: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.search.scenes() });
    },
  };
};

// ================================
// Mutation Hooks (for future use)
// ================================

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ type, name }: { type: string; name: string }) => {
      // Future: Add to favorites functionality
      return Promise.resolve({ type, name });
    },
    onSuccess: () => {
      // Invalidate relevant queries after mutation
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
