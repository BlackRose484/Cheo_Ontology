"use client";

import { useEffect, useState } from "react";
import { CharacterName, SearchStatesFilters, SceneAndPlays } from "@/types";
import useSearchData from "@/hooks/useSearchData";
import { DISPLAY_EMOTIONS, EMOTIONS } from "@/constants/base";

interface CharacterStateSearchProps {
  onSearch: (filters: SearchStatesFilters) => void;
  initialFilters?: SearchStatesFilters;
}

const CharacterStateSearch = ({
  onSearch,
  initialFilters = {},
}: CharacterStateSearchProps) => {
  const [filters, setFilters] = useState<SearchStatesFilters>({
    character: "",
    scene: "",
    emotion: "",
    ...initialFilters,
  });

  const {
    characters,
    fetchSceneAndPlaysByCharacter,
    fetchExpressionsByCharacterAndScene,
  } = useSearchData();

  const [characterScenes, setCharacterScenes] = useState<SceneAndPlays>([]);
  const [selectedPlayTitle, setSelectedPlayTitle] = useState<string>("");
  const [characterExpressions, setCharacterExpressions] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (filters.character) {
      fetchSceneAndPlaysByCharacter(filters.character).then(
        (scenes: SceneAndPlays) => {
          setCharacterScenes(scenes);
        }
      );
    } else {
      setCharacterScenes([]);
      setSelectedPlayTitle("");
      setCharacterExpressions([]);
    }
  }, [filters.character, fetchSceneAndPlaysByCharacter]);

  useEffect(() => {
    if (filters.character && filters.scene) {
      // Tìm play title từ scene được chọn
      const selectedScene = characterScenes.find(
        (scene) => scene.scene === filters.scene
      );
      if (selectedScene) {
        setSelectedPlayTitle(selectedScene.playTitle);
        fetchExpressionsByCharacterAndScene(
          filters.character,
          selectedScene.scene
        ).then((expressions) => {
          setCharacterExpressions(expressions);
        });
      }
    } else {
      setCharacterExpressions([]);
      setSelectedPlayTitle("");
    }
  }, [
    filters.character,
    filters.scene,
    characterScenes,
    fetchExpressionsByCharacterAndScene,
  ]);

  const handleFilterChange = (
    key: keyof SearchStatesFilters,
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: value,
      };

      // Reset dependent fields when parent field changes
      if (key === "character") {
        newFilters.scene = "";
        newFilters.emotion = "";
        setCharacterExpressions([]);
        setSelectedPlayTitle("");
      } else if (key === "scene") {
        newFilters.emotion = "";
      }

      return newFilters;
    });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const resetFilters = () => {
    setFilters({
      character: "",
      scene: "",
      emotion: "",
    });
    setCharacterScenes([]);
    setSelectedPlayTitle("");
    setCharacterExpressions([]);
  };

  // Generate dropdown options
  const characterOptions = [
    ...(!filters.character ? [{ value: "", label: "Chọn nhân vật" }] : []),
    ...characters.map((character: CharacterName) => ({
      value: character.char,
      label: character.charName,
    })),
  ];

  const sceneOptions = [
    ...(!filters.scene ? [{ value: "", label: "Chọn trích đoạn" }] : []),
    ...characterScenes.map((sceneData) => ({
      value: sceneData.scene,
      label: sceneData.sceneName,
    })),
  ];

  const expressionOptions: { value: string; label: string }[] = [
    { value: "", label: "Tất cả" },
    ...EMOTIONS.filter((emotion) => characterExpressions.includes(emotion)).map(
      (emotion) => ({
        value: emotion,
        label:
          DISPLAY_EMOTIONS[emotion as keyof typeof DISPLAY_EMOTIONS] || emotion,
      })
    ),
  ];

  return (
    <div className="bg-white/90 p-8 rounded-lg border-2 border-red-800 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
          <span>🎭</span>
          <span>Tìm kiếm nhân vật theo trích đoạn</span>
        </h3>
        <p className="text-red-800">
          Chọn nhân vật, sau đó chọn trích đoạn mà nhân vật tham gia, và biểu
          cảm (tùy chọn).
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-lg">
          <span className="text-red-900">Nhân vật</span>
          <select
            value={filters.character || ""}
            onChange={(e) => handleFilterChange("character", e.target.value)}
            className="px-4 py-3 border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 bg-white min-w-[150px] text-base"
            style={{ width: "180px" }}
          >
            {characterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Show scene dropdown only when character is selected */}
          {filters.character && (
            <>
              <span className="text-red-900">trong trích đoạn</span>
              <select
                value={filters.scene || ""}
                onChange={(e) => handleFilterChange("scene", e.target.value)}
                className="px-4 py-3 border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 bg-white min-w-[220px] text-base"
              >
                {sceneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Show play title (fixed display) when scene is selected */}
          {filters.scene && selectedPlayTitle && (
            <>
              <span className="text-red-900">của vở chèo</span>
              <span className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-700 min-w-[220px] text-base font-medium">
                {selectedPlayTitle}
              </span>
            </>
          )}

          {/* Show expression dropdown only when both character and scene are selected */}
          {filters.character && filters.scene && (
            <>
              <span className="text-red-900">với biểu cảm</span>
              <select
                value={filters.emotion || ""}
                onChange={(e) => handleFilterChange("emotion", e.target.value)}
                className="px-4 py-3 border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 bg-white min-w-[160px] text-base max-h-40 overflow-y-auto"
              >
                {expressionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleSearch}
          disabled={!filters.character}
          className="px-8 py-3 bg-gradient-to-r from-red-800 to-red-900 text-amber-200 rounded-lg hover:from-red-900 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-amber-400"
        >
          <span>🎭</span>
          <span>Tìm kiếm</span>
        </button>

        <button
          onClick={resetFilters}
          className="px-6 py-3 bg-amber-200 text-red-900 rounded-lg hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 border-2 border-red-800"
        >
          <span>🔄</span>
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default CharacterStateSearch;
