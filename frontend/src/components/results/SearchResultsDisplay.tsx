"use client";

import { SearchResults } from "@/types";

interface SearchResultsDisplayProps {
  results: SearchResults;
  isLoading: boolean;
}

const SearchResultsDisplay = ({
  results,
  isLoading,
}: SearchResultsDisplayProps) => {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-ancient-ink">Đang tìm kiếm...</span>
        </div>
      </div>
    );
  }

  const hasResults =
    results.characters.length > 0 ||
    results.quotes.length > 0 ||
    results.performances.length > 0;

  if (!hasResults) {
    return (
      <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-ancient-ink mb-2">
          Không tìm thấy kết quả
        </h3>
        <p className="text-gray-600">
          Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc để có kết quả tốt hơn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Characters Results */}
      {results.characters.length > 0 && (
        <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
          <h3 className="text-xl font-bold text-ancient-ink mb-4 font-traditional flex items-center">
            <span className="text-2xl mr-2">👥</span>
            Nhân vật ({results.characters.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.characters.map((character) => (
              <div
                key={character.id}
                className="bg-white rounded-lg p-4 border border-accent hover:shadow-soft transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-ancient-ink mb-1">
                      {character.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Giới tính:{" "}
                      <span className="font-medium">{character.gender}</span>
                    </p>
                    {character.description && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {character.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      character.gender === "nam"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-pink-100 text-pink-800"
                    }`}
                  >
                    {character.gender}
                  </div>
                </div>
                {character.quotes && character.quotes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {character.quotes.length} trích dẫn
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quotes Results */}
      {results.quotes.length > 0 && (
        <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
          <h3 className="text-xl font-bold text-ancient-ink mb-4 font-traditional flex items-center">
            <span className="text-2xl mr-2">💬</span>
            Trích dẫn ({results.quotes.length})
          </h3>
          <div className="space-y-4">
            {results.quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-lg p-4 border border-accent hover:shadow-soft transition-shadow duration-200"
              >
                <blockquote className="text-ancient-ink italic mb-3 text-lg leading-relaxed border-l-4 border-ancient-gold pl-4">
                  &ldquo;{quote.content}&rdquo;
                </blockquote>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <strong className="text-ancient-ink mr-1">Nhân vật:</strong>
                    {quote.character}
                  </span>
                  {quote.performance && (
                    <span className="flex items-center">
                      <strong className="text-ancient-ink mr-1">
                        Vở diễn:
                      </strong>
                      {quote.performance}
                    </span>
                  )}
                  {quote.context && (
                    <span className="flex items-center">
                      <strong className="text-ancient-ink mr-1">
                        Bối cảnh:
                      </strong>
                      {quote.context}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performances Results */}
      {results.performances.length > 0 && (
        <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
          <h3 className="text-xl font-bold text-ancient-ink mb-4 font-traditional flex items-center">
            <span className="text-2xl mr-2">🎭</span>
            Vở diễn ({results.performances.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.performances.map((performance) => (
              <div
                key={performance.id}
                className="bg-white rounded-lg p-4 border border-accent hover:shadow-soft transition-shadow duration-200"
              >
                <h4 className="font-semibold text-ancient-ink text-lg mb-2">
                  {performance.title}
                </h4>
                {performance.description && (
                  <p className="text-gray-700 mb-3 line-clamp-3">
                    {performance.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <strong className="text-ancient-ink">Nhân vật:</strong>{" "}
                    {performance.characters.length}
                  </span>
                  <span>
                    <strong className="text-ancient-ink">Trích dẫn:</strong>{" "}
                    {performance.quotes.length}
                  </span>
                </div>
                {performance.characters.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      Nhân vật chính:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {performance.characters.slice(0, 3).map((character) => (
                        <span
                          key={character.id}
                          className="inline-block bg-accent text-ancient-ink px-2 py-1 rounded-full text-xs"
                        >
                          {character.name}
                        </span>
                      ))}
                      {performance.characters.length > 3 && (
                        <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          +{performance.characters.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay;
