"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCharacters, getActorNames, getPlays } from "@/apis/infor";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [plays, setPlays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"characters" | "actors" | "plays">(
    "characters"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [charactersRes, actorsRes, playsRes] = await Promise.all([
          getCharacters(),
          getActorNames(),
          getPlays(),
        ]);

        if (charactersRes.data) setCharacters(charactersRes.data);
        if (actorsRes.data) setActors(actorsRes.data);
        if (playsRes.data) setPlays(playsRes.data);
        console.log("Fetched data:", {
          characters: charactersRes.data,
          actors: actorsRes.data,
          plays: playsRes.data,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-amber-100">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-800 via-red-900 to-red-800 text-white py-16">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/90 via-red-900/90 to-red-800/90"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Thư viện Chèo
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Khám phá nhân vật, diễn viên và vở diễn trong nghệ thuật Chèo
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("characters")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "characters"
                  ? "bg-red-800 text-white border-b-2 border-red-800"
                  : "text-gray-600 hover:text-red-800 hover:bg-red-100"
              }`}
            >
              <span className="text-xl mr-2">🎭</span>
              Nhân vật ({characters.length})
            </button>
            <button
              onClick={() => setActiveTab("actors")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "actors"
                  ? "bg-red-800 text-white border-b-2 border-red-800"
                  : "text-gray-600 hover:text-red-800 hover:bg-red-100"
              }`}
            >
              <span className="text-xl mr-2">🎬</span>
              Diễn viên ({actors.length})
            </button>
            <button
              onClick={() => setActiveTab("plays")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "plays"
                  ? "bg-red-800 text-white border-b-2 border-red-800"
                  : "text-gray-600 hover:text-red-800 hover:bg-red-100"
              }`}
            >
              <span className="text-xl mr-2">🎪</span>
              Vở diễn ({plays.length})
            </button>
          </div>

          <div className="p-6">
            {/* Characters Tab */}
            {activeTab === "characters" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Danh sách nhân vật Chèo
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map((character, index) => (
                    <Link
                      key={index}
                      href={`/character/${encodeURIComponent(character)}`}
                      className="block p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-800 mb-1">
                            {character}
                          </h4>
                        </div>
                        <span className="text-blue-600 group-hover:translate-x-1 transition-transform ml-2">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Actors Tab */}
            {activeTab === "actors" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Danh sách diễn viên
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {actors.map((actor, index) => (
                    <Link
                      key={index}
                      href={`/actor/${encodeURIComponent(actor)}`}
                      className="block p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:border-green-300 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 group-hover:text-green-800 mb-1">
                            {actor}
                          </h4>
                        </div>
                        <span className="text-green-600 group-hover:translate-x-1 transition-transform ml-2">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Plays Tab */}
            {activeTab === "plays" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Danh sách vở diễn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plays.map((play, index) => (
                    <Link
                      key={index}
                      href={`/play/${encodeURIComponent(play)}`}
                      className="block p-6 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 group-hover:text-purple-800 mb-2 text-lg">
                            {play}
                          </h4>
                        </div>
                        <span className="text-purple-600 group-hover:translate-x-1 transition-transform ml-2">
                          →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🎭</div>
            <div className="text-2xl font-bold text-gray-800">
              {characters.length}
            </div>
            <div className="text-gray-600">Nhân vật</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🎬</div>
            <div className="text-2xl font-bold text-gray-800">
              {actors.length}
            </div>
            <div className="text-gray-600">Diễn viên</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🎪</div>
            <div className="text-2xl font-bold text-gray-800">
              {plays.length}
            </div>
            <div className="text-gray-600">Vở diễn</div>
          </div>
        </div>
      </div>
    </div>
  );
}
