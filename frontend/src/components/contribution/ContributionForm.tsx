"use client";

import React, { useState } from "react";
import { X, Play, User, FileText } from "lucide-react";
import { submitContribution, ContributionData } from "../../apis/contribution";

interface ContributionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"play" | "character" | "actor">(
    "play"
  );
  const [playData, setPlayData] = useState({
    playName: "",
    sceneCount: 1,
    author: "",
    summary: "",
    scenes: [{ name: "", summary: "", videoCount: 0, videoLinks: [""] }],
  });

  const [characterData, setCharacterData] = useState({
    characters: [{ name: "", type: "", gender: "", description: "" }],
  });

  const [actorData, setActorData] = useState({
    actors: [{ name: "", character: "", description: "" }],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addScene = () => {
    setPlayData((prev) => ({
      ...prev,
      sceneCount: prev.sceneCount + 1,
      scenes: [
        ...prev.scenes,
        { name: "", summary: "", videoCount: 0, videoLinks: [""] },
      ],
    }));
  };

  const removeScene = (index: number) => {
    if (playData.scenes.length > 1) {
      setPlayData((prev) => ({
        ...prev,
        sceneCount: prev.sceneCount - 1,
        scenes: prev.scenes.filter((_, i) => i !== index),
      }));
    }
  };

  const updateScene = (
    index: number,
    field: string,
    value: string | number | string[]
  ) => {
    setPlayData((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene, i) =>
        i === index ? { ...scene, [field]: value } : scene
      ),
    }));
  };

  const addVideoLink = (sceneIndex: number) => {
    updateScene(sceneIndex, "videoLinks", [
      ...playData.scenes[sceneIndex].videoLinks,
      "",
    ]);
  };

  const updateVideoLink = (
    sceneIndex: number,
    linkIndex: number,
    value: string
  ) => {
    const newLinks = [...playData.scenes[sceneIndex].videoLinks];
    newLinks[linkIndex] = value;
    updateScene(sceneIndex, "videoLinks", newLinks);
  };

  const addCharacter = () => {
    setCharacterData((prev) => ({
      characters: [
        ...prev.characters,
        { name: "", type: "", gender: "", description: "" },
      ],
    }));
  };

  const removeCharacter = (index: number) => {
    if (characterData.characters.length > 1) {
      setCharacterData((prev) => ({
        characters: prev.characters.filter((_, i) => i !== index),
      }));
    }
  };

  const updateCharacter = (index: number, field: string, value: string) => {
    setCharacterData((prev) => ({
      characters: prev.characters.map((char, i) =>
        i === index ? { ...char, [field]: value } : char
      ),
    }));
  };

  const addActor = () => {
    setActorData((prev) => ({
      actors: [...prev.actors, { name: "", character: "", description: "" }],
    }));
  };

  const removeActor = (index: number) => {
    if (actorData.actors.length > 1) {
      setActorData((prev) => ({
        actors: prev.actors.filter((_, i) => i !== index),
      }));
    }
  };

  const updateActor = (index: number, field: string, value: string) => {
    setActorData((prev) => ({
      actors: prev.actors.map((actor, i) =>
        i === index ? { ...actor, [field]: value } : actor
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate Play Data
    if (!playData.playName.trim()) {
      newErrors.playName = "Tên vở chèo là bắt buộc";
    }
    if (!playData.author.trim()) {
      newErrors.author = "Tên tác giả là bắt buộc";
    }
    if (!playData.summary.trim()) {
      newErrors.summary = "Tóm tắt vở chèo là bắt buộc";
    }

    // Validate Scenes
    playData.scenes.forEach((scene, index) => {
      if (!scene.name.trim()) {
        newErrors[`scene_${index}_name`] = `Tên cảnh ${index + 1} là bắt buộc`;
      }
      if (!scene.summary.trim()) {
        newErrors[`scene_${index}_summary`] = `Tóm tắt cảnh ${
          index + 1
        } là bắt buộc`;
      }
    });

    // Validate Characters
    characterData.characters.forEach((character, index) => {
      if (!character.name.trim()) {
        newErrors[`character_${index}_name`] = `Tên nhân vật ${
          index + 1
        } là bắt buộc`;
      }
      if (!character.type) {
        newErrors[`character_${index}_type`] = `Loại nhân vật ${
          index + 1
        } là bắt buộc`;
      }
      if (!character.gender) {
        newErrors[`character_${index}_gender`] = `Giới tính nhân vật ${
          index + 1
        } là bắt buộc`;
      }
    });

    // Validate Actors
    actorData.actors.forEach((actor, index) => {
      if (!actor.name.trim()) {
        newErrors[`actor_${index}_name`] = `Tên diễn viên ${
          index + 1
        } là bắt buộc`;
      }
      if (!actor.character.trim()) {
        newErrors[
          `actor_${index}_character`
        ] = `Nhân vật thủ vai của diễn viên ${index + 1} là bắt buộc`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc trong tất cả các form!");
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData: ContributionData = {
        playData: {
          ...playData,
          sceneCount: playData.scenes.length,
        },
        characterData,
        actorData,
        contributorInfo: {
          // Có thể thêm thông tin người đóng góp sau
        },
      };

      const response = await submitContribution(submissionData);

      if (response.data.success) {
        alert(`Cảm ơn bạn đã đóng góp thông tin cho:
          📚 Vở chèo: ${playData.playName}
          🎭 ${characterData.characters.length} nhân vật
          👥 ${actorData.actors.length} diễn viên
          📝 ${playData.scenes.length} cảnh

          Thông tin sẽ được xem xét và bổ sung vào hệ thống!`);
        onClose();
      } else {
        alert(`Lỗi: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error submitting contribution:", error);
      alert("Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-red-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 via-red-900 to-red-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                🎭 Đóng góp cho Chèo Việt Nam
              </h2>
              <p className="text-red-100 text-sm">
                Chia sẻ kiến thức và góp phần bảo tồn nghệ thuật Chèo truyền
                thống
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-red-700/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
          <div className="flex">
            <button
              className={`flex items-center px-8 py-4 font-semibold transition-all duration-300 relative ${
                activeTab === "play"
                  ? "text-red-800 bg-white border-b-3 border-red-600 shadow-sm"
                  : "text-red-600 hover:text-red-800 hover:bg-red-50"
              }`}
              onClick={() => setActiveTab("play")}
            >
              <Play className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Vở Chèo & Trích đoạn</div>
                <div className="text-xs text-red-500 font-normal">
                  Thông tin về vở diễn
                </div>
              </div>
            </button>
            <button
              className={`flex items-center px-8 py-4 font-semibold transition-all duration-300 relative ${
                activeTab === "character"
                  ? "text-red-800 bg-white border-b-3 border-red-600 shadow-sm"
                  : "text-red-600 hover:text-red-800 hover:bg-red-50"
              }`}
              onClick={() => setActiveTab("character")}
            >
              <User className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Nhân vật</div>
                <div className="text-xs text-red-500 font-normal">
                  Các vai diễn trong vở
                </div>
              </div>
            </button>
            <button
              className={`flex items-center px-8 py-4 font-semibold transition-all duration-300 relative ${
                activeTab === "actor"
                  ? "text-red-800 bg-white border-b-3 border-red-600 shadow-sm"
                  : "text-red-600 hover:text-red-800 hover:bg-red-50"
              }`}
              onClick={() => setActiveTab("actor")}
            >
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Diễn viên</div>
                <div className="text-xs text-red-500 font-normal">
                  Nghệ sĩ biểu diễn
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)] bg-gradient-to-br from-gray-50 to-red-50">
          <form onSubmit={handleSubmit}>
            {activeTab === "play" && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                  <h3 className="text-lg font-semibold text-red-900 mb-6 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-red-600" />
                    Thông tin cơ bản về vở Chèo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-red-800 mb-3">
                        Tên vở chèo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/70"
                        value={playData.playName}
                        onChange={(e) =>
                          setPlayData((prev) => ({
                            ...prev,
                            playName: e.target.value,
                          }))
                        }
                        placeholder="Nhập tên vở chèo..."
                      />
                      {errors.playName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.playName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-red-800 mb-3">
                        Tác giả
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/70"
                        value={playData.author}
                        onChange={(e) =>
                          setPlayData((prev) => ({
                            ...prev,
                            author: e.target.value,
                          }))
                        }
                        placeholder="Nhập tên tác giả..."
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-red-800 mb-3">
                      Tóm tắt vở chèo
                    </label>
                    <textarea
                      className="w-full p-4 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/70"
                      rows={4}
                      value={playData.summary}
                      onChange={(e) =>
                        setPlayData((prev) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                      placeholder="Nhập tóm tắt nội dung vở chèo..."
                    />
                  </div>
                </div>

                {/* Episodes */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-red-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-red-600" />
                      Trích đoạn
                    </h3>
                    <button
                      type="button"
                      onClick={addScene}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
                    >
                      + Thêm trích đoạn
                    </button>
                  </div>

                  {playData.scenes.map((scene, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-md"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-red-900 text-lg">
                          🎭 Trích đoạn {index + 1}
                        </h4>
                        {playData.scenes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeScene(index)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-200 rounded-lg transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-semibold text-red-800 mb-3">
                            Tên trích đoạn{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                            value={scene.name}
                            onChange={(e) =>
                              updateScene(index, "name", e.target.value)
                            }
                            placeholder="Nhập tên trích đoạn..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-red-800 mb-3">
                            Số video biểu diễn cung cấp
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                            value={scene.videoCount}
                            onChange={(e) =>
                              updateScene(
                                index,
                                "videoCount",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-red-800 mb-3">
                          Tóm tắt trích đoạn
                        </label>
                        <textarea
                          className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                          rows={3}
                          value={scene.summary}
                          onChange={(e) =>
                            updateScene(index, "summary", e.target.value)
                          }
                          placeholder="Nhập tóm tắt trích đoạn..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-red-800 mb-3">
                          🎬 Link video biểu diễn
                        </label>
                        {scene.videoLinks.map((link, linkIndex) => (
                          <div
                            key={linkIndex}
                            className="flex items-center mb-3"
                          >
                            <input
                              type="url"
                              className="flex-1 p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                              value={link}
                              onChange={(e) =>
                                updateVideoLink(
                                  index,
                                  linkIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Link video ${linkIndex + 1}...`}
                            />
                            {scene.videoLinks.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newLinks = scene.videoLinks.filter(
                                    (_, i) => i !== linkIndex
                                  );
                                  updateScene(index, "videoLinks", newLinks);
                                }}
                                className="ml-3 p-3 text-red-600 hover:text-red-800 hover:bg-red-200 rounded-lg transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addVideoLink(index)}
                          className="text-sm text-red-600 hover:text-red-800 font-medium px-4 py-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          + Thêm link video
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Nhân vật */}
            {activeTab === "character" && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-red-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-red-600" />
                      Thông tin nhân vật
                    </h3>
                    <button
                      type="button"
                      onClick={addCharacter}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
                    >
                      + Thêm nhân vật
                    </button>
                  </div>

                  {characterData.characters.map((character, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-md"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-red-900 text-lg">
                          👤 Nhân vật {index + 1}
                        </h4>
                        {characterData.characters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCharacter(index)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-200 rounded-lg transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-red-800 mb-3">
                            Tên nhân vật <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                            value={character.name}
                            onChange={(e) =>
                              updateCharacter(index, "name", e.target.value)
                            }
                            placeholder="Nhập tên nhân vật..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-red-800 mb-3">
                            Loại nhân vật{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                            value={character.type}
                            onChange={(e) =>
                              updateCharacter(index, "type", e.target.value)
                            }
                          >
                            <option value="">Chọn loại nhân vật</option>
                            <option value="Chính">🌟 Nhân vật chính</option>
                            <option value="Phụ">⭐ Nhân vật phụ</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-red-800 mb-3">
                            Giới tính <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                            value={character.gender}
                            onChange={(e) =>
                              updateCharacter(index, "gender", e.target.value)
                            }
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">👨 Nam</option>
                            <option value="Nữ">👩 Nữ</option>
                            <option value="Khác">🎭 Khác</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-red-800 mb-3">
                          Mô tả nhân vật
                        </label>
                        <textarea
                          className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                          rows={4}
                          value={character.description}
                          onChange={(e) =>
                            updateCharacter(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Nhập mô tả về tính cách, vai trò của nhân vật này..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Diễn viên */}
            {activeTab === "actor" && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-red-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-red-600" />
                      Thông tin diễn viên
                    </h3>
                    <button
                      type="button"
                      onClick={addActor}
                      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg transform hover:scale-105 font-medium"
                    >
                      + Thêm diễn viên
                    </button>
                  </div>

                  {actorData.actors.map((actor, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 mb-6 shadow-md"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-red-900 text-lg">
                          🎭 Diễn viên {index + 1}
                        </h4>
                        {actorData.actors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeActor(index)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-200 rounded-lg transition-all"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-semibold text-red-800 mb-3">
                            Tên diễn viên{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                            value={actor.name}
                            onChange={(e) =>
                              updateActor(index, "name", e.target.value)
                            }
                            placeholder="Nhập tên diễn viên..."
                          />
                          {errors[`actor_${index}_name`] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors[`actor_${index}_name`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-red-800 mb-3">
                            Nhân vật thủ vai{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                            value={actor.character}
                            onChange={(e) =>
                              updateActor(index, "character", e.target.value)
                            }
                            placeholder="Nhân vật thủ vai..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-red-800 mb-3">
                          Mô tả diễn viên
                        </label>
                        <textarea
                          className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                          rows={4}
                          value={actor.description}
                          onChange={(e) =>
                            updateActor(index, "description", e.target.value)
                          }
                          placeholder="Nhập mô tả về diễn viên, phong cách diễn xuất..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-8 pb-18 border-t-2 border-red-200 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 mr-4 text-red-700 border-2 border-red-300 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all duration-200 font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl transition-all duration-200 shadow-lg font-semibold ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transform hover:scale-105"
                }`}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đóng góp"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContributionForm;
