"use client";

import { useEffect, useState } from "react";
import { SearchStatesFilters } from "@/types";
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
    play: "",
    emotion: "",
    ...initialFilters,
  });

  const {
    characters,
    fetchPlaysByCharacter,
    fetchExpressionsByCharacterAndPlay,
  } = useSearchData();

  const [characterPlays, setCharacterPlays] = useState<string[]>([]);
  const [characterExpressions, setCharacterExpressions] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (filters.character) {
      console.log("Fetching plays for character:", filters.character);
      fetchPlaysByCharacter(filters.character).then((plays) => {
        console.log("Received plays:", plays);
        setCharacterPlays(plays);
      });
    } else {
      setCharacterPlays([]);
      setCharacterExpressions([]);
    }
  }, [filters.character, fetchPlaysByCharacter]);

  useEffect(() => {
    if (filters.character && filters.play) {
      fetchExpressionsByCharacterAndPlay(
        filters.character,
        filters.play
      ).then((expressions) => {
        setCharacterExpressions(expressions);
      });
    } else {
      setCharacterExpressions([]);
    }
  }, [
    filters.character,
    filters.play,
    fetchExpressionsByCharacterAndPlay,
  ]);

  const handleFilterChange = (key: keyof SearchStatesFilters, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: value,
      };

      // Reset dependent fields when parent field changes
      if (key === "character") {
        newFilters.play = "";
        newFilters.emotion = "";
        setCharacterExpressions([]);
      } else if (key === "play") {
        newFilters.emotion = "all";
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
      play: "",
      emotion: "",
    });
    setCharacterPlays([]);
    setCharacterExpressions([]);
  };

  // Generate dropdown options
  const characterOptions = [
    ...(!filters.character ? [{ value: "", label: "Chọn nhân vật" }] : []),
    ...characters.map((character) => ({
      value: character,
      label: character,
    })),
  ];

  const playOptions = [
    ...(!filters.play ? [{ value: "", label: "Chọn vở chèo" }] : []),
    ...characterPlays.map((play) => ({
      value: play,
      label: play,
    })),
  ];

  console.log("CharacterPlays:", characterPlays);
  console.log("PlayOptions:", playOptions);

  const expressionOptions: { value: string; label: string }[] = [
    { value: "all", label: "Tất cả" },
    ...EMOTIONS.filter((emotion) => characterExpressions.includes(emotion)).map(
      (emotion) => ({
        value: emotion,
        label:
          DISPLAY_EMOTIONS[emotion as keyof typeof DISPLAY_EMOTIONS] || emotion,
      })
    ),
  ];

  return (
    <div className="bg-white p-8 rounded-lg border-2 border-primary-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary-600 mb-2 flex items-center gap-2">
          <span>🎭</span>
          <span>Tìm kiếm nhân vật theo trích đoạn</span>
        </h3>
        <p className="text-gray-600">
          Chọn nhân vật, sau đó chọn vở chèo mà nhân vật tham gia, và biểu cảm
          (tùy chọn).
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-lg">
          <span className="text-gray-700">Nhân vật</span>
          <select
            value={filters.character || ""}
            onChange={(e) =>
              handleFilterChange("character", e.target.value)
            }
            className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[200px] text-base"
          >
            {characterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Show play dropdown only when character is selected */}
          {filters.character && (
            <>
              <span className="text-gray-700">trong vở chèo</span>
              <select
                value={filters.play || ""}
                onChange={(e) =>
                  handleFilterChange("play", e.target.value)
                }
                className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[220px] text-base"
              >
                {playOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Show expression dropdown only when both character and play are selected */}
          {filters.character && filters.play && (
            <>
              <span className="text-gray-700">với biểu cảm</span>
              <select
                value={filters.emotion || ""}
                onChange={(e) =>
                  handleFilterChange("emotion", e.target.value)
                }
                className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[160px] text-base"
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
          className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>🎭</span>
          <span>Tìm kiếm</span>
        </button>

        <button
          onClick={resetFilters}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 font-medium text-lg flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default CharacterStateSearch;
