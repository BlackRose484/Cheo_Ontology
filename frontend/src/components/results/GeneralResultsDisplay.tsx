"use client";

import { useRouter } from "next/navigation";
import {
  CharacterGeneral,
  PlayGeneral,
  ActorGeneral,
  SceneGeneral,
  GeneralDescriptionFilters,
  CharacterGenerals,
  PlayGenerals,
  ActorGenerals,
  SceneGenerals,
} from "@/types";
import { DISPLAY_CATEGORIES } from "@/constants/base";

interface GeneralDescriptionResults {
  category: string;
  items:
    | CharacterGenerals
    | PlayGenerals
    | ActorGenerals
    | SceneGenerals
    | string[];
  totalCount: number;
  searchCriteria: GeneralDescriptionFilters;
}

interface GeneralResultsDisplayProps {
  results: GeneralDescriptionResults | null;
  isLoading: boolean;
}

const GeneralResultsDisplay = ({
  results,
  isLoading,
}: GeneralResultsDisplayProps) => {
  const router = useRouter();

  const handleNavigateToDetail = (type: string, name: string) => {
    // Encode tên để đảm bảo URL an toàn
    const encodedName = encodeURIComponent(name);
    router.push(`/${type.toLowerCase()}/${encodedName}`);
  };
  if (isLoading) {
    return (
      <div className="bg-white/80 rounded-lg shadow-lg p-8 border-2 border-yellow-400 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <span className="ml-3 text-red-800">Đang tải thông tin...</span>
        </div>
      </div>
    );
  }

  if (!results || results.items.length === 0) {
    return (
      <div className="bg-white/80 rounded-lg shadow-lg p-8 border-2 border-yellow-400 text-center backdrop-blur-sm">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-xl font-medium text-red-800 mb-2">
          Không tìm thấy thông tin
        </h3>
        <p className="text-red-600">
          Hãy thử tìm kiếm với danh mục và thông tin khác.
        </p>
      </div>
    );
  }

  const categoryDisplay =
    DISPLAY_CATEGORIES[results.category as keyof typeof DISPLAY_CATEGORIES] ||
    results.category;

  // Character Display Component
  const CharacterCard = ({ character }: { character: CharacterGeneral }) => (
    <div className="bg-white/90 rounded-lg p-6 border-2 border-yellow-300 hover:shadow-lg transition-shadow duration-200 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 mb-3 text-lg flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            {character.name || character.charName}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p>
                <strong className="text-red-700">Giới tính:</strong>
                <span className="ml-1 capitalize text-gray-700">
                  {character.gender || character.charGender}
                </span>
              </p>
              {character.mainType && (
                <p>
                  <strong className="text-red-700">Loại chính:</strong>
                  <span className="ml-1 text-gray-700">
                    {character.mainType}
                  </span>
                </p>
              )}
              {character.subType && (
                <p>
                  <strong className="text-red-700">Loại phụ:</strong>
                  <span className="ml-1 text-gray-700">
                    {character.subType}
                  </span>
                </p>
              )}
            </div>
            <div className="space-y-2">
              {character.inPlay && (
                <p>
                  <strong className="text-red-700">Vở chèo:</strong>
                  <button
                    onClick={() =>
                      handleNavigateToDetail("play", character.inPlay!)
                    }
                    className="ml-1 text-yellow-700 hover:text-yellow-800 hover:underline cursor-pointer font-medium"
                  >
                    {character.inPlay}
                  </button>
                </p>
              )}
              {character.description && (
                <p>
                  <strong className="text-red-700">Mô tả:</strong>
                  <span className="ml-1 text-gray-700">
                    {character.description}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium border border-red-300">
            Nhân vật
          </span>
          <button
            onClick={() =>
              handleNavigateToDetail(
                "character",
                character.name || character.charName
              )
            }
            className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-yellow-100 text-xs rounded hover:from-red-600 hover:to-red-700 transition-all duration-200 border border-yellow-400"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );

  // Play Display Component
  const PlayCard = ({ play }: { play: PlayGeneral }) => (
    <div className="bg-white/90 rounded-lg p-6 border-2 border-yellow-300 hover:shadow-lg transition-shadow duration-200 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 mb-3 text-lg flex items-center gap-2">
            <span className="text-2xl">🎪</span>
            {play.title}
          </h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {play.author && (
                  <p>
                    <strong className="text-red-700">Tác giả:</strong>
                    <span className="ml-1 text-red-600">
                      {play.author !== "unknown"
                        ? play.author
                        : "Chưa có thông tin"}
                    </span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {play.allCharacter && play.allCharacter.length > 0 && (
                  <div>
                    <p className="font-semibold text-red-700 mb-1">
                      Nhân vật chính:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {play.allCharacter.slice(0, 3).map((char, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleNavigateToDetail("character", char)
                          }
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors border border-red-300"
                        >
                          {char}
                        </button>
                      ))}
                      {play.allCharacter.length > 3 && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded border border-yellow-300">
                          +{play.allCharacter.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {play.allScenes && play.allScenes.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Cảnh:</p>
                    <div className="flex flex-wrap gap-1">
                      {play.allScenes.slice(0, 3).map((scene, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded border border-yellow-300"
                        >
                          {scene}
                        </span>
                      ))}
                      {play.allScenes.length > 3 && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded border border-red-300">
                          +{play.allScenes.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {play.summary && (
              <div className="mt-3">
                <p>
                  <strong className="text-gray-700">Tóm tắt:</strong>
                </p>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                  {play.summary}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium border border-red-300">
            Vở diễn
          </span>
          <button
            onClick={() => handleNavigateToDetail("play", play.title)}
            className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-yellow-100 text-xs rounded hover:from-red-600 hover:to-red-700 transition-all duration-200 border border-yellow-400"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );

  // Actor Display Component
  const ActorCard = ({ actor }: { actor: ActorGeneral }) => (
    <div className="bg-white rounded-lg p-6 border border-accent hover:shadow-soft transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-ancient-ink mb-3 text-lg flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            {actor.name}
          </h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>
                  <strong className="text-gray-700">Giới tính:</strong>
                  <span className="ml-1 capitalize">{actor.gender}</span>
                </p>
                {actor.charNames && actor.charNames.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Nhân vật đã thủ vai:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {actor.charNames.slice(0, 3).map((charName, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleNavigateToDetail("character", charName)
                          }
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors border border-red-300"
                        >
                          {charName}
                        </button>
                      ))}
                      {actor.charNames.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{actor.charNames.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {actor.playTitles && actor.playTitles.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Vở chèo đã tham gia:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {actor.playTitles.slice(0, 3).map((playTitle, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleNavigateToDetail("play", playTitle)
                          }
                          className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded hover:bg-yellow-200 transition-colors border border-yellow-300"
                        >
                          {playTitle}
                        </button>
                      ))}
                      {actor.playTitles.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{actor.playTitles.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <p className="text-gray-600 italic mt-2">
                  Nghệ sĩ chuyên nghiệp trong lĩnh vực nghệ thuật Chèo truyền
                  thống
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium border border-red-300">
            Diễn viên
          </span>
          <button
            onClick={() => handleNavigateToDetail("actor", actor.name)}
            className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-yellow-100 text-xs rounded hover:from-red-600 hover:to-red-700 transition-all duration-200 border border-yellow-400"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );

  // Scene Display Component
  const SceneCard = ({ scene }: { scene: SceneGeneral }) => (
    <div className="bg-white rounded-lg p-6 border border-accent hover:shadow-soft transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-ancient-ink mb-3 text-lg flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            {scene.name}
          </h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {scene.startTime && (
                  <p>
                    <strong className="text-gray-700">
                      Thời gian bắt đầu:
                    </strong>
                    <span className="ml-1">{scene.startTime}</span>
                  </p>
                )}
                {scene.endTime && (
                  <p>
                    <strong className="text-gray-700">
                      Thời gian kết thúc:
                    </strong>
                    <span className="ml-1">{scene.endTime}</span>
                  </p>
                )}
                {scene.version && (
                  <p>
                    <strong className="text-gray-700">Phiên bản:</strong>
                    <span className="ml-1">{scene.version}</span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                {scene.inPlay && (
                  <p>
                    <strong className="text-gray-700">Vở chèo:</strong>
                    <button
                      onClick={() =>
                        handleNavigateToDetail("play", scene.inPlay!)
                      }
                      className="ml-1 text-yellow-700 hover:text-yellow-800 hover:underline cursor-pointer font-medium"
                    >
                      {scene.inPlay}
                    </button>
                  </p>
                )}
                {scene.allCharacters && scene.allCharacters.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">
                      Nhân vật xuất hiện:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {scene.allCharacters.slice(0, 3).map((char, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            handleNavigateToDetail("character", char)
                          }
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors border border-red-300"
                        >
                          {char}
                        </button>
                      ))}
                      {scene.allCharacters.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{scene.allCharacters.length - 3} khác
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {scene.summary && (
              <div className="mt-3">
                <p>
                  <strong className="text-gray-700">Tóm tắt:</strong>
                </p>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                  {scene.summary}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="ml-4 flex flex-col gap-2">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
            Cảnh
          </span>
          <button
            onClick={() => handleNavigateToDetail("scene", scene.scene || "")}
            className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );

  // Generic String Display Component (for other types)
  const GenericCard = ({ item }: { item: string }) => (
    <div className="bg-white rounded-lg p-5 border border-accent hover:shadow-soft transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-ancient-ink mb-2 text-lg">
            {item}
          </h4>
          <p className="text-sm text-gray-600">
            Thông tin chi tiết sẽ được bổ sung khi có API tương ứng.
          </p>
        </div>
        <div className="ml-4">
          <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
            {categoryDisplay}
          </span>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    switch (results.category) {
      case "Character":
        return (results.items as CharacterGenerals).map((character, index) => (
          <CharacterCard key={index} character={character} />
        ));
      case "Play":
        return (results.items as PlayGenerals).map((play, index) => (
          <PlayCard key={index} play={play} />
        ));
      case "Actor":
        return (results.items as ActorGenerals).map((actor, index) => (
          <ActorCard key={index} actor={actor} />
        ));
      case "Scene":
        return (results.items as SceneGenerals).map((scene, index) => (
          <SceneCard key={index} scene={scene} />
        ));
      default:
        return (results.items as string[]).map((item, index) => (
          <GenericCard key={index} item={item} />
        ));
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-ancient-ink font-traditional flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span>Thông tin về {categoryDisplay}</span>
          <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-300">
            {results.totalCount} kết quả
          </span>
        </h3>

        {/* Search criteria display */}
        <div className="bg-red-50 p-3 rounded-lg border border-red-200 mt-3">
          <div className="flex items-center gap-2 text-red-800">
            <span>🔍</span>
            <span className="text-sm">
              <strong>Đang xem:</strong> {categoryDisplay}
              {results.searchCriteria.selectedItem && (
                <span>
                  {" "}
                  - &quot;{results.searchCriteria.selectedItem}&quot;
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">{renderResults()}</div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hiển thị {results.items.length} kết quả</span>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/search")}
              className="text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Tìm kiếm mới →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralResultsDisplay;
