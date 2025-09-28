import { QueryClient } from "@tanstack/react-query";

// Create a client with optimized cache configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 1000 * 60 * 5,
      // Keep cached data for 30 minutes
      gcTime: 1000 * 60 * 30,
      // Retry failed requests up to 2 times
      retry: 2,
      // Don't refetch when window regains focus for better performance
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect unless explicitly needed
      refetchOnReconnect: "always",
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  // Search queries
  search: {
    all: ["search"] as const,
    characters: () => [...queryKeys.search.all, "characters"] as const,
    characterByName: (name: string) =>
      [...queryKeys.search.characters(), name] as const,
    plays: () => [...queryKeys.search.all, "plays"] as const,
    playByName: (name: string) => [...queryKeys.search.plays(), name] as const,
    playsByCharacter: (character: string) =>
      [...queryKeys.search.all, "plays-by-character", character] as const,
    scenes: () => [...queryKeys.search.all, "scenes"] as const,
    sceneByName: (name: string) =>
      [...queryKeys.search.scenes(), name] as const,
    scenesAndPlayByCharacter: (character: string) =>
      [...queryKeys.search.all, "scenes-play-by-character", character] as const,
    actors: () => [...queryKeys.search.all, "actors"] as const,
    actorByName: (name: string) =>
      [...queryKeys.search.actors(), name] as const,
    emotions: () => [...queryKeys.search.all, "emotions"] as const,
    emotionsByCharacterAndScene: (character: string, scene: string) =>
      [...queryKeys.search.emotions(), character, scene] as const,
    characterStates: (character: string, scene: string, emotion: string) =>
      [
        ...queryKeys.search.all,
        "character-states",
        character,
        scene,
        emotion,
      ] as const,
    appearances: (
      character: string,
      play: string,
      emotion: string,
      uri: string
    ) =>
      [
        ...queryKeys.search.all,
        "appearances",
        character,
        play,
        emotion,
        uri,
      ] as const,
  },

  // View/Detail queries
  view: {
    all: ["view"] as const,
    character: (name: string) =>
      [...queryKeys.view.all, "character", name] as const,
    play: (name: string) => [...queryKeys.view.all, "play", name] as const,
    actor: (name: string) => [...queryKeys.view.all, "actor", name] as const,
    scene: (name: string) => [...queryKeys.view.all, "scene", name] as const,
  },

  // Library/Information queries
  library: {
    all: ["library"] as const,
    videos: () => [...queryKeys.library.all, "videos"] as const,
    characters: () => [...queryKeys.library.all, "characters"] as const,
    actors: () => [...queryKeys.library.all, "actors"] as const,
    plays: () => [...queryKeys.library.all, "plays"] as const,
    videoById: (id: string) => [...queryKeys.library.videos(), id] as const,
    appearances: (
      character: string,
      play: string,
      emotion: string,
      uri: string
    ) =>
      [
        ...queryKeys.library.all,
        "appearances",
        character,
        play,
        emotion,
        uri,
      ] as const,
  },

  // AI Chat queries
  ai: {
    all: ["ai"] as const,
    models: () => [...queryKeys.ai.all, "models"] as const,
    suggestions: () => [...queryKeys.ai.all, "suggestions"] as const,
    chatResponse: (message: string, model: string) =>
      [
        ...queryKeys.ai.all,
        "chat",
        message.toLowerCase().trim(),
        model,
      ] as const,
  },
} as const;

// Cache utilities
export const cacheUtils = {
  // Invalidate all search related queries
  invalidateSearch: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.search.all });
  },

  // Invalidate specific character data
  invalidateCharacter: (name: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.view.character(name),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.search.characterByName(name),
    });
  },

  // Clear all cache
  clearAll: () => {
    queryClient.clear();
  },

  // Get cache statistics
  getCacheStats: () => {
    const cache = queryClient.getQueryCache();
    return {
      totalQueries: cache.getAll().length,
      searchQueries: cache.findAll({ queryKey: queryKeys.search.all }).length,
      viewQueries: cache.findAll({ queryKey: queryKeys.view.all }).length,
      aiQueries: cache.findAll({ queryKey: queryKeys.ai.all }).length,
    };
  },
};
