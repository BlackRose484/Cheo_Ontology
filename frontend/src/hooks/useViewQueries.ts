import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import * as viewApi from "@/apis/view";
import type {
  CharacterInformation,
  PlayInformation,
  ActorInformation,
  SceneInformation,
} from "@/types";

// ================================
// View/Detail Hooks with Caching
// ================================

export const useCharacterInformation = (
  character: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.view.character(character),
    queryFn: () => viewApi.getCharacterInformation(character),
    enabled: enabled && !!character.trim(),
    staleTime: 1000 * 60 * 20, // 20 minutes - detailed info changes less frequently
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    select: (data) => {
      // Handle both array and single object responses
      const result = Array.isArray(data?.data) ? data.data[0] : data?.data;
      return result as CharacterInformation;
    },
    retry: (failureCount) => {
      // Custom retry logic
      if (failureCount >= 2) return false;
      return true;
    },
  });
};

export const usePlayInformation = (play: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.view.play(play),
    queryFn: () => viewApi.getPlayInformation(play),
    enabled: enabled && !!play.trim(),
    staleTime: 1000 * 60 * 20,
    gcTime: 1000 * 60 * 60,
    select: (data) => {
      const result = Array.isArray(data?.data) ? data.data[0] : data?.data;
      return result as PlayInformation;
    },
  });
};

export const useActorInformation = (actor: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.view.actor(actor),
    queryFn: () => viewApi.getActorInformation(actor),
    enabled: enabled && !!actor.trim(),
    staleTime: 1000 * 60 * 20,
    gcTime: 1000 * 60 * 60,
    select: (data) => {
      const result = Array.isArray(data?.data) ? data.data[0] : data?.data;
      return result as ActorInformation;
    },
  });
};

export const useSceneInformation = (scene: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.view.scene(scene),
    queryFn: () => viewApi.getSceneInformation(scene),
    enabled: enabled && !!scene.trim(),
    staleTime: 1000 * 60 * 15, // Scenes might change more often
    gcTime: 1000 * 60 * 45,
    select: (data) => {
      const result = Array.isArray(data?.data) ? data.data[0] : data?.data;
      return result as SceneInformation;
    },
  });
};

// ================================
// Prefetch Hooks for Navigation
// ================================

export const usePrefetchViewData = () => {
  const queryClient = useQueryClient();

  const prefetchCharacter = (character: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.view.character(character),
      queryFn: () => viewApi.getCharacterInformation(character),
      staleTime: 1000 * 60 * 15,
    });
  };

  const prefetchPlay = (play: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.view.play(play),
      queryFn: () => viewApi.getPlayInformation(play),
      staleTime: 1000 * 60 * 15,
    });
  };

  const prefetchActor = (actor: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.view.actor(actor),
      queryFn: () => viewApi.getActorInformation(actor),
      staleTime: 1000 * 60 * 15,
    });
  };

  return {
    prefetchCharacter,
    prefetchPlay,
    prefetchActor,
  };
};
