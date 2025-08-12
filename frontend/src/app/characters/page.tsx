"use client";

import { useState } from "react";
import { Character } from "@/types";
import { getCharacterByName } from "@/apis/search";

export default function CharactersPage() {
  const [selectedGender, setSelectedGender] = useState<"nam" | "nữ">("nam");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);

  // Search characters based on search term
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      return;
    }
    try {
      const response = await getCharacterByName(searchTerm);
      const results = response.data.data;
      console.log("Search results:", results);
      setFilteredCharacters(results);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-4 font-traditional">
            Nhân vật Chèo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá những nhân vật đặc sắc trong nghệ thuật Chèo truyền thống
            Việt Nam
          </p>
        </div>

        {/* Filters */}
        <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm nhân vật..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-accent rounded-traditional focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-ancient-ink placeholder-gray-400"
              />
            </div>

            {/* Gender Filter */}
            <div className="flex gap-2">
              {[
                { value: "nam" as const, label: "Nam" },
                { value: "nữ" as const, label: "Nữ" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedGender(option.value)}
                  className={`px-4 py-2 rounded-traditional font-medium transition-all duration-200 ${
                    selectedGender === option.value
                      ? "bg-[#4ade80] text-white shadow-lg"
                      : "bg-white text-ancient-ink border border-accent hover:bg-primary-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Search Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleSearch}
            className="bg-primary-500 text-black-400 font-medium py-3 px-6 rounded-traditional hover:bg-primary-600 transition-colors duration-200"
          >
            🔍 Tìm kiếm
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold text-primary-600">
              {filteredCharacters.length}
            </span>{" "}
            nhân vật
          </p>
        </div>

        {/* Characters Grid */}
        {filteredCharacters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-medium text-ancient-ink mb-2">
              Không tìm thấy nhân vật
            </h3>
            <p className="text-gray-600">
              Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Character Card Component
function CharacterCard({ character }: { character: Character }) {
  return (
    <div className="bg-surface rounded-lg shadow-soft hover:shadow-ancient transition-shadow duration-200 border-2 border-accent p-6">
      {/* Character Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-ancient-ink mb-2 font-traditional">
            {character.name}
          </h3>
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              character.gender === "nam"
                ? "bg-blue-100 text-blue-800"
                : "bg-pink-100 text-pink-800"
            }`}
          >
            {character.gender}
          </div>
        </div>
        <div className="text-3xl ml-4">
          {character.gender === "nam" ? "👨" : "👩"}
        </div>
      </div>

      {/* Description */}
      {character.description && (
        <p className="text-gray-700 mb-4 leading-relaxed">
          {character.description}
        </p>
      )}

      {/* Performances */}
      {character.performances && character.performances.length > 0 && (
        <div className="border-t border-accent pt-4">
          <h4 className="text-sm font-medium text-ancient-ink mb-2">
            Tham gia vở diễn:
          </h4>
          <div className="flex flex-wrap gap-1">
            {character.performances.map((performance, index) => (
              <span
                key={index}
                className="inline-block bg-accent text-ancient-ink px-2 py-1 rounded-full text-xs"
              >
                {performance}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quotes Count */}
      {character.quotes && character.quotes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-accent">
          <p className="text-sm text-gray-600 flex items-center">
            <span className="mr-1">💬</span>
            {character.quotes.length} trích dẫn nổi tiếng
          </p>
        </div>
      )}
    </div>
  );
}
