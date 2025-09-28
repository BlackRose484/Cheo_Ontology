import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import * as inforApi from "@/apis/infor";
import * as searchApi from "@/apis/search";
import type { Character, Play, ActorName, Library, Appearance } from "@/types";

// ================================
// Library/Information Hooks with Caching
// ================================

export const useLibrary = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.library.videos(),
    queryFn: () => inforApi.getLibrary(),
    enabled,
    staleTime: 1000 * 60 * 15, // 15 minutes - video library changes less frequently
    gcTime: 1000 * 60 * 45, // Keep in cache for 45 minutes
    select: (data) => data?.data as Library,
    retry: 2,
  });
};

export const useLibraryCharacters = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.library.characters(),
    queryFn: () => inforApi.getCharacters(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes - character list is quite static
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    select: (data) => data?.data as Character[],
    retry: 2,
  });
};

export const useLibraryActors = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.library.actors(),
    queryFn: () => inforApi.getActorNames(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes - actor list is quite static
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    select: (data) => data?.data as ActorName[],
    retry: 2,
  });
};

export const useLibraryPlays = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.library.plays(),
    queryFn: () => inforApi.getPlays(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30 minutes - play list is quite static
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    select: (data) => data?.data as Play[],
    retry: 2,
  });
};

// Combined library data hook - parallel queries
export const useLibraryData = (enabled: boolean = true) => {
  const results = useQueries({
    queries: [
      {
        queryKey: queryKeys.library.videos(),
        queryFn: () => inforApi.getLibrary(),
        enabled,
        staleTime: 1000 * 60 * 15,
        gcTime: 1000 * 60 * 45,
      },
      {
        queryKey: queryKeys.library.characters(),
        queryFn: () => inforApi.getCharacters(),
        enabled,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60,
      },
      {
        queryKey: queryKeys.library.actors(),
        queryFn: () => inforApi.getActorNames(),
        enabled,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60,
      },
      {
        queryKey: queryKeys.library.plays(),
        queryFn: () => inforApi.getPlays(),
        enabled,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60,
      },
    ],
  });

  const [libraryQuery, charactersQuery, actorsQuery, playsQuery] = results;

  return {
    library: {
      data: libraryQuery.data?.data as Library | undefined,
      isLoading: libraryQuery.isLoading,
      error: libraryQuery.error,
    },
    characters: {
      data: charactersQuery.data?.data as Character[] | undefined,
      isLoading: charactersQuery.isLoading,
      error: charactersQuery.error,
    },
    actors: {
      data: actorsQuery.data?.data as ActorName[] | undefined,
      isLoading: actorsQuery.isLoading,
      error: actorsQuery.error,
    },
    plays: {
      data: playsQuery.data?.data as Play[] | undefined,
      isLoading: playsQuery.isLoading,
      error: playsQuery.error,
    },
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
    errors: results.map((result) => result.error).filter(Boolean),
  };
};

// Appearance search hook
export const useAppearanceSearch = (
  character: string,
  play: string,
  emotion: string,
  uri: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.library.appearances(character, play, emotion, uri),
    queryFn: () => searchApi.searchAppearance(character, play, emotion, uri),
    enabled: enabled && !!character && !!play && !!emotion && !!uri,
    staleTime: 1000 * 60 * 10, // 10 minutes - appearance data can change
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    select: (data) => data?.data as Appearance[],
    retry: 2,
  });
};

// ================================
// Prefetch Hooks for Performance
// ================================

export const usePrefetchLibraryData = () => {
  const queryClient = useQueryClient();

  const prefetchLibrary = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.library.videos(),
      queryFn: () => inforApi.getLibrary(),
      staleTime: 1000 * 60 * 10,
    });
  };

  const prefetchCharacters = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.library.characters(),
      queryFn: () => inforApi.getCharacters(),
      staleTime: 1000 * 60 * 15,
    });
  };

  const prefetchActors = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.library.actors(),
      queryFn: () => inforApi.getActorNames(),
      staleTime: 1000 * 60 * 15,
    });
  };

  const prefetchPlays = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.library.plays(),
      queryFn: () => inforApi.getPlays(),
      staleTime: 1000 * 60 * 15,
    });
  };

  const prefetchAllLibraryData = () => {
    prefetchLibrary();
    prefetchCharacters();
    prefetchActors();
    prefetchPlays();
  };

  return {
    prefetchLibrary,
    prefetchCharacters,
    prefetchActors,
    prefetchPlays,
    prefetchAllLibraryData,
  };
};
