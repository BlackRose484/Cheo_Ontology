"use client";

import { useState, useEffect } from "react";
import { GeneralDescriptionFilters } from "@/types";
import useSearchData from "@/hooks/useSearchData";
import { CATEGORIES, DISPLAY_CATEGORIES } from "@/constants/base";
import { getActorNames, getPlays, getSceneNames } from "@/apis/infor";

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

  // Local states for category-specific data
  const [plays, setPlays] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [scenes, setScenes] = useState<string[]>([]);
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
            const scenesResponse = await getSceneNames();
            setScenes(scenesResponse.data || []);
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

  const handleFilterChange = (
    key: keyof GeneralDescriptionFilters,
    value: string
  ) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };

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
        return characters.map((char) => ({
          value: char,
          label: char,
        }));
      case "Play":
        return plays.map((play) => ({
          value: play,
          label: play,
        }));
      case "Actor":
        return actors.map((actor) => ({
          value: actor,
          label: actor,
        }));
      case "Scene":
        return scenes.map((scene) => ({
          value: scene,
          label: scene,
        }));
      default:
        return [];
    }
  };

  const categorySpecificOptions = getCategorySpecificOptions();

  return (
    <div className="bg-white/90 p-8 rounded-lg border-2 border-red-300 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
          <span>📖</span>
          <span>Xem mô tả chi tiết</span>
        </h3>
        <p className="text-red-600">
          Chọn danh mục và thông tin cụ thể bạn muốn tìm hiểu về nghệ thuật Chèo
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-lg">
          <span className="text-red-700">Tìm hiểu về</span>
          <select
            className="px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white min-w-[180px] text-base"
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
          {filters.category && (
            <>
              <span className="text-red-700">cụ thể là</span>
              <select
                className="px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white min-w-[200px] text-base"
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
        </div>

        {/* Additional information display */}
        {filters.category && filters.selectedItem && (
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
            <div className="flex items-center gap-2 text-red-800">
              <span>ℹ️</span>
              <span className="font-medium">
                Bạn đang tìm hiểu về:{" "}
                {
                  DISPLAY_CATEGORIES[
                    filters.category as keyof typeof DISPLAY_CATEGORIES
                  ]
                }
                &quot;{filters.selectedItem}&quot;
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleSearch}
          disabled={!filters.category}
          className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-yellow-400"
        >
          <span>📖</span>
          <span>Tìm hiểu</span>
        </button>

        <button
          onClick={resetFilters}
          className="px-6 py-3 bg-yellow-200 text-red-700 rounded-lg hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 border-2 border-red-300"
        >
          <span>🔄</span>
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default GeneralSearch;
