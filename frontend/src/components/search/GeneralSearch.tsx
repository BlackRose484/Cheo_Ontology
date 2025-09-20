"use client";

import { useState, useEffect } from "react";
import {
  ActorName,
  ActorNames,
  CharacterName,
  GeneralDescriptionFilters,
  PlayTitle,
  PlayTitles,
  SceneName,
  SceneNames,
} from "@/types";
import useSearchData from "@/hooks/useSearchData";
import { CATEGORIES, DISPLAY_CATEGORIES } from "@/constants/base";
import { getActorNames, getPlays, getSceneNamesByPlay } from "@/apis/infor";

interface GeneralSearchProps {
  onSearch: (filters: GeneralDescriptionFilters) => void;
  initialFilters?: Partial<GeneralDescriptionFilters>;
}

const GeneralSearch = ({
  onSearch,
  initialFilters = {},
}: GeneralSearchProps) => {
  const [filters, setFilters] = useState<GeneralDescriptionFilters>({
    category: "",
    selectedItem: "",
    ...initialFilters,
  });
  // Get basic data from hook
  const { characters, categories } = useSearchData();
  const [plays, setPlays] = useState<PlayTitles>([]);
  const [actors, setActors] = useState<ActorNames>([]);
  const [scenes, setScenes] = useState<SceneNames>([]);
  const [itemLabel, setItemLabel] = useState<string>("");
  const [play4Scenes, setPlay4Scenes] = useState<string>("");
  const [isLoadingCategoryData, setIsLoadingCategoryData] = useState(false);

  // Fetch category-specific data when category changes
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!filters.category) return;

      setIsLoadingCategoryData(true);
      try {
        switch (filters.category) {
          case "Play":
            const playsResponse = await getPlays();
            setPlays(playsResponse.data || []);
            break;
          case "Actor":
            const actorsResponse = await getActorNames();
            setActors(actorsResponse.data || []);
            break;
          case "Scene":
            const playsForScenesResponse = await getPlays();
            setPlays(playsForScenesResponse.data || []);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Failed to fetch ${filters.category} data:`, error);
      } finally {
        setIsLoadingCategoryData(false);
      }
    };

    fetchCategoryData();
  }, [filters.category]);

  // Separate effect to fetch scenes when selectedPlay changes for Scene category
  useEffect(() => {
    const fetchScenesByPlay = async () => {
      if (filters.category === "Scene" && play4Scenes) {
        setIsLoadingCategoryData(true);
        try {
          const scenesByPlayResponse = await getSceneNamesByPlay(play4Scenes);
          setScenes(scenesByPlayResponse.data || []);
        } catch (error) {
          console.error(
            `Failed to fetch scenes for play ${play4Scenes}:`,
            error
          );
        } finally {
          setIsLoadingCategoryData(false);
        }
      }
    };

    fetchScenesByPlay();
  }, [play4Scenes, filters.category]);

  const handleFilterChange = (
    key: keyof GeneralDescriptionFilters,
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Update item label based on selected item
      if (key === "selectedItem") {
        const selectedOption = categorySpecificOptions.find(
          (option) => option.value === value
        );
        setItemLabel(selectedOption ? selectedOption.label : "");
      }

      // Reset dependent fields when category changes
      if (key === "category") {
        newFilters.selectedItem = "";
      }

      return newFilters;
    });
  };

  const handleSearch = () => {
    if (!filters.category) {
      alert("Vui lòng chọn danh mục cần tìm hiểu");
      return;
    }

    onSearch(filters);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      selectedItem: "",
    });
    setPlays([]);
    setActors([]);
    setScenes([]);
  };

  // Generate category options
  const categoryOptions: { value: string; label: string }[] = CATEGORIES.filter(
    (category) => categories.includes(category)
  ).map((category) => ({
    value: category,
    label:
      DISPLAY_CATEGORIES[category as keyof typeof DISPLAY_CATEGORIES] ||
      category,
  }));

  // Generate options for selected category
  const getCategorySpecificOptions = () => {
    switch (filters.category) {
      case "Character":
        return characters.map((char: CharacterName) => ({
          value: char.char,
          label: char.charName,
        }));
      case "Play":
        return plays.map((play: PlayTitle) => ({
          value: play.play,
          label: play.title,
        }));
      case "Actor":
        return actors.map((actor: ActorName) => ({
          value: actor.actor,
          label: actor.name,
        }));
      case "Scene":
        return scenes.map((scene: SceneName) => ({
          value: scene.scene,
          label: scene.name,
        }));
      default:
        return [];
    }
  };

  const categorySpecificOptions = getCategorySpecificOptions();

  return (
    <div className="bg-white/90 p-8 rounded-lg border-2 border-red-800 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
          <span>📖</span>
          <span>Xem mô tả chi tiết</span>
        </h3>
        <p className="text-red-800">
          Chọn danh mục và thông tin cụ thể bạn muốn tìm hiểu về nghệ thuật Chèo
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-lg">
          <span className="text-red-900">Tìm hiểu về</span>
          <select
            className="px-4 py-3 border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 bg-white min-w-[180px] text-base"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">Chọn danh mục</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dynamic dropdown based on selected category */}
          {filters.category && filters.category !== "Scene" && (
            <>
              <span className="text-red-900">cụ thể là</span>
              <select
                className="px-4 py-3 border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 bg-white min-w-[200px] text-base"
                value={filters.selectedItem}
                onChange={(e) =>
                  handleFilterChange("selectedItem", e.target.value)
                }
                disabled={isLoadingCategoryData}
              >
                <option value="">
                  {isLoadingCategoryData
                    ? "Đang tải..."
                    : `Chọn ${DISPLAY_CATEGORIES[
                        filters.category as keyof typeof DISPLAY_CATEGORIES
                      ]?.toLowerCase()}`}
                </option>
                {categorySpecificOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Special handling for Scene category - first select play, then scene */}
          {filters.category === "Scene" && (
            <>
              <span className="text-red-900">từ vở chèo</span>
              <select
                className="px-4 py-3 border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 bg-white min-w-[200px] text-base"
                value={play4Scenes}
                onChange={(e) => setPlay4Scenes(e.target.value)}
                disabled={isLoadingCategoryData}
              >
                <option value="">
                  {isLoadingCategoryData ? "Đang tải..." : "Chọn vở chèo"}
                </option>
                {plays.map((play: PlayTitle) => (
                  <option key={play.play} value={play.play}>
                    {play.title}
                  </option>
                ))}
              </select>

              {play4Scenes && (
                <>
                  <span className="text-red-900">trích đoạn</span>
                  <select
                    className="px-4 py-3 border-2 border-red-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-red-900 bg-white min-w-[200px] text-base"
                    value={filters.selectedItem}
                    onChange={(e) =>
                      handleFilterChange("selectedItem", e.target.value)
                    }
                    disabled={isLoadingCategoryData}
                  >
                    <option value="">
                      {isLoadingCategoryData
                        ? "Đang tải..."
                        : "Chọn trích đoạn"}
                    </option>
                    {categorySpecificOptions.map((option) => (
                      <option
                        key={option.value + Math.random()}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </>
          )}
        </div>

        {/* Additional information display */}
        {filters.category && filters.selectedItem && (
          <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-400">
            <div className="flex items-center gap-2 text-red-900">
              <span>ℹ️</span>
              <span className="font-medium">
                Bạn đang tìm hiểu về:{" "}
                {
                  DISPLAY_CATEGORIES[
                    filters.category as keyof typeof DISPLAY_CATEGORIES
                  ]
                }
                <span> &quot;{itemLabel}&quot;</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleSearch}
          disabled={!filters.category}
          className="px-8 py-3 bg-gradient-to-r from-red-800 to-red-900 text-amber-200 rounded-lg hover:from-red-900 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-amber-400"
        >
          <span>📖</span>
          <span>Tìm hiểu</span>
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

export default GeneralSearch;
