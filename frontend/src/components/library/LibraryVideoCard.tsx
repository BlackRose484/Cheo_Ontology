import Link from "next/link";
import Image from "next/image";
import { LibraryItem } from "../../types/index";

interface LibraryVideoCardProps {
  item: LibraryItem;
}

const LibraryVideoCard = ({ item }: LibraryVideoCardProps) => {
  const extractFileId = (driveUrl: string) => {
    // Extract file ID from various Google Drive URL formats
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : driveUrl;
  };

  const fileId = extractFileId(item.vidVersion || "");

  return (
    <Link
      href={`/video/${encodeURIComponent(item.vidVersion || "")}`}
      className="block h-full"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group h-full flex flex-col border border-red-100 hover:border-red-300">
        {/* Video thumbnail/preview */}
        <div className="aspect-video w-full bg-gradient-to-br from-red-100 to-yellow-100 relative overflow-hidden">
          {/* Google Drive thumbnail */}
          {fileId && (
            <Image
              src={`https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h225`}
              alt={item.sceneName || item.playTitle || "Video Chèo"}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback to gradient background if thumbnail fails
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          )}

          {/* Fallback gradient background with pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-yellow-100 flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url('/cheo-2.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="text-red-800 text-5xl relative z-10">🎭</div>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300">
            <div className="bg-gradient-to-r from-red-700 to-amber-600 bg-opacity-0 group-hover:bg-opacity-90 rounded-full p-0 group-hover:p-3 transition-all duration-300 shadow-lg">
              <svg
                className="w-0 h-0 group-hover:w-8 group-hover:h-8 text-white transition-all duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Duration badge */}
          {item.duration && (
            <div className="absolute bottom-2 right-2 bg-gradient-to-r from-red-800 to-red-900 text-white text-xs px-2 py-1 rounded shadow-md">
              {item.duration}
            </div>
          )}

          {/* Vietnamese flag corner decoration */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-red-800 to-amber-600 opacity-60 rounded-br-full"></div>

          {/* Hover overlay with video info */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-900 via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300">
            <div className="absolute bottom-2 left-2 text-white text-xs">
              <p className="font-semibold">
                {item.sceneName || item.playTitle}
              </p>
              {item.actors && item.actors.length > 0 && (
                <p className="opacity-80">
                  {item.actors.slice(0, 2).join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Video info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-red-800 transition-colors min-h-[2.5rem]">
            {item.sceneName || item.playTitle || "Video Chèo"}
          </h3>

          {/* Actors */}
          <div className="mb-1 min-h-[1rem]">
            {item.actors && item.actors.length > 0 && (
              <p className="text-gray-600 text-xs truncate">
                {item.actors.join(", ")}
              </p>
            )}
          </div>

          {/* Characters */}
          <div className="mb-2 min-h-[1.5rem]">
            {item.characters && item.characters.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.characters.slice(0, 2).map((character, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                  >
                    {character}
                  </span>
                ))}
                {item.characters.length > 2 && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                    +{item.characters.length - 2} khác
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Scene summary */}
          <div className="flex-1 flex items-start">
            {item.sceneSummary && (
              <p className="text-gray-500 text-xs line-clamp-3">
                {item.sceneSummary}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LibraryVideoCard;
