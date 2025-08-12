"use client";

import { useState } from "react";
import { mockQuotes } from "@/lib/mockData";
import { Quote } from "@/types";

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter quotes based on search term
  const filteredQuotes = mockQuotes.filter((quote) => {
    return (
      quote.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.character.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.performance &&
        quote.performance.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-4 font-traditional">
            Trích dẫn Chèo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những câu thoại và lời ca bất hủ từ nghệ thuật Chèo truyền thống
          </p>
        </div>

        {/* Search Filter */}
        <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent mb-8">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tìm kiếm trích dẫn, nhân vật hoặc vở diễn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-accent rounded-traditional focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-ancient-ink placeholder-gray-400"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold text-primary-600">
              {filteredQuotes.length}
            </span>{" "}
            trích dẫn
          </p>
        </div>

        {/* Quotes List */}
        {filteredQuotes.length > 0 ? (
          <div className="space-y-6">
            {filteredQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-medium text-ancient-ink mb-2">
              Không tìm thấy trích dẫn
            </h3>
            <p className="text-gray-600">
              Hãy thử điều chỉnh từ khóa tìm kiếm.
            </p>
          </div>
        )}

        {/* Featured Quotes Section */}
        {!searchTerm && (
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-accent rounded-lg p-8 border-2 border-primary-200">
            <h2 className="text-2xl font-bold text-ancient-ink mb-6 text-center font-traditional">
              Trích dẫn nổi bật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockQuotes.slice(0, 2).map((quote) => (
                <div
                  key={quote.id}
                  className="bg-white rounded-lg p-6 shadow-soft"
                >
                  <blockquote className="text-ancient-ink italic text-lg leading-relaxed border-l-4 border-ancient-gold pl-4 mb-4">
                    &ldquo;{quote.content}&rdquo;
                  </blockquote>
                  <div className="text-right">
                    <cite className="text-gray-600 not-italic">
                      — <strong>{quote.character}</strong>
                      {quote.performance && (
                        <span className="block text-sm text-gray-500">
                          ({quote.performance})
                        </span>
                      )}
                    </cite>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Quote Card Component
function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <div className="bg-surface rounded-lg shadow-soft hover:shadow-ancient transition-shadow duration-200 border-2 border-accent p-6">
      {/* Quote Content */}
      <blockquote className="text-ancient-ink italic text-lg md:text-xl leading-relaxed border-l-4 border-ancient-gold pl-6 mb-6">
        &ldquo;{quote.content}&rdquo;
      </blockquote>

      {/* Quote Attribution */}
      <div className="flex flex-wrap items-center gap-4 text-gray-600">
        <div className="flex items-center">
          <span className="text-lg mr-2">👤</span>
          <div>
            <span className="font-semibold text-ancient-ink">
              {quote.character}
            </span>
          </div>
        </div>

        {quote.performance && (
          <div className="flex items-center">
            <span className="text-lg mr-2">🎭</span>
            <div>
              <span className="text-sm text-gray-500">Vở diễn:</span>
              <span className="ml-1 font-medium text-ancient-ink">
                {quote.performance}
              </span>
            </div>
          </div>
        )}

        {quote.context && (
          <div className="flex items-center w-full mt-2">
            <span className="text-lg mr-2">📝</span>
            <div>
              <span className="text-sm text-gray-500">Bối cảnh:</span>
              <span className="ml-1 text-gray-700">{quote.context}</span>
            </div>
          </div>
        )}
      </div>

      {/* Share Button */}
      <div className="mt-4 pt-4 border-t border-accent flex justify-end">
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `"${quote.content}" - ${quote.character}${
                quote.performance ? ` (${quote.performance})` : ""
              }`
            );
            // You could add a toast notification here
          }}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center transition-colors duration-200"
        >
          <span className="mr-1">📋</span>
          Sao chép
        </button>
      </div>
    </div>
  );
}
