import { Character, Quote, Performance } from "@/types";

export const mockCharacters: Character[] = [
  {
    id: "1",
    name: "Thị Mầu",
    gender: "nữ",
    description:
      "Nhân vật nữ chính trong nhiều vở chèo, thường đóng vai người phụ nữ thông minh, dũng cảm.",
    performances: ["Quan Âm Thị Kính", "Tấm Cám"],
  },
  {
    id: "2",
    name: "Chú Cuội",
    gender: "nam",
    description:
      "Nhân vật hài hước, thông minh trong truyền thuyết dân gian Việt Nam.",
    performances: ["Chú Cuội cung trăng", "Sự tích cây đa"],
  },
  {
    id: "3",
    name: "Cô Bông",
    gender: "nữ",
    description:
      "Nhân vật nữ thứ, thường đóng vai người hầu hoặc bạn của nữ chính.",
    performances: ["Quan Âm Thị Kính", "Lưu Bình Dương Lễ"],
  },
  {
    id: "4",
    name: "Lão Phủ",
    gender: "nam",
    description:
      "Nhân vật già, thường đóng vai cha của các nhân vật chính hoặc quan chức.",
    performances: ["Tấm Cám", "Lưu Bình Dương Lễ"],
  },
  {
    id: "5",
    name: "Thị Nở",
    gender: "nữ",
    description: "Nhân vật nữ phụ, thường có tính cách vui vẻ, hồn nhiên.",
    performances: ["Chú Cuội cung trăng", "Sự tích cây đa"],
  },
];

export const mockQuotes: Quote[] = [
  {
    id: "1",
    content: "Làm người phải biết ơn nghĩa, đáp đền công ân nuôi dưỡng.",
    character: "Thị Mầu",
    performance: "Quan Âm Thị Kính",
    context: "Khi nhân vật thể hiện lòng biết ơn với cha mẹ nuôi",
  },
  {
    id: "2",
    content:
      "Trăng kia tròn khuyết mấy phen, lòng người thay đổi còn hơn trăng kia.",
    character: "Chú Cuội",
    performance: "Chú Cuội cung trăng",
    context: "Suy ngẫm về tình người và sự thay đổi của cuộc đời",
  },
  {
    id: "3",
    content: "Chị ơi chị, sao chị nỡ lòng bỏ em một mình?",
    character: "Cô Bông",
    performance: "Quan Âm Thị Kính",
    context: "Khi chia ly với chị gái",
  },
  {
    id: "4",
    content: "Con cái là báu vật của cha mẹ, phải giữ gìn như ngọc như vàng.",
    character: "Lão Phủ",
    performance: "Tấm Cám",
    context: "Lời khuyên của người cha",
  },
  {
    id: "5",
    content: "Cười một cái cho đời vui, khóc chi cho mắt đỏ hoe.",
    character: "Thị Nở",
    performance: "Chú Cuội cung trăng",
    context: "Triết lý sống lạc quan",
  },
];

export const mockPerformances: Performance[] = [
  {
    id: "1",
    title: "Quan Âm Thị Kính",
    description:
      "Vở chèo nổi tiếng kể về câu chuyện cô gái cải trang thành nam để tu hành, thể hiện đức tính nhân từ và lòng từ bi.",
    characters: [mockCharacters[0], mockCharacters[2]], // Thị Mầu, Cô Bông
    quotes: [mockQuotes[0], mockQuotes[2]],
  },
  {
    id: "2",
    title: "Chú Cuội cung trăng",
    description:
      "Vở chèo dựa trên truyền thuyết dân gian về Chú Cuội, với những tình tiết hài hước và ý nghĩa giáo dục.",
    characters: [mockCharacters[1], mockCharacters[4]], // Chú Cuội, Thị Nở
    quotes: [mockQuotes[1], mockQuotes[4]],
  },
  {
    id: "3",
    title: "Tấm Cám",
    description:
      "Vở chèo dựa trên câu chuyện cổ tích nổi tiếng, thể hiện sự tương phản giữa thiện và ác.",
    characters: [mockCharacters[0], mockCharacters[3]], // Thị Mầu, Lão Phủ
    quotes: [mockQuotes[3]],
  },
  {
    id: "4",
    title: "Lưu Bình Dương Lễ",
    description: "Vở chèo kể về tình bạn và nghĩa khí giữa hai người bạn thân.",
    characters: [mockCharacters[2], mockCharacters[3]], // Cô Bông, Lão Phủ
    quotes: [],
  },
  {
    id: "5",
    title: "Sự tích cây đa",
    description:
      "Vở chèo về nguồn gốc của cây đa trong văn hóa dân gian Việt Nam.",
    characters: [mockCharacters[1], mockCharacters[4]], // Chú Cuội, Thị Nở
    quotes: [],
  },
];

// Search function to simulate API call
export const searchMockData = (query: string, type: string = "all") => {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return {
      characters: [],
      quotes: [],
      performances: [],
    };
  }

  const filteredCharacters = mockCharacters.filter(
    (character) =>
      character.name.toLowerCase().includes(normalizedQuery) ||
      (character.description &&
        character.description.toLowerCase().includes(normalizedQuery))
  );

  const filteredQuotes = mockQuotes.filter(
    (quote) =>
      quote.content.toLowerCase().includes(normalizedQuery) ||
      quote.character.toLowerCase().includes(normalizedQuery) ||
      (quote.performance &&
        quote.performance.toLowerCase().includes(normalizedQuery))
  );

  const filteredPerformances = mockPerformances.filter(
    (performance) =>
      performance.title.toLowerCase().includes(normalizedQuery) ||
      (performance.description &&
        performance.description.toLowerCase().includes(normalizedQuery))
  );

  switch (type) {
    case "characters":
      return { characters: filteredCharacters, quotes: [], performances: [] };
    case "quotes":
      return { characters: [], quotes: filteredQuotes, performances: [] };
    case "performances":
      return { characters: [], quotes: [], performances: filteredPerformances };
    default:
      return {
        characters: filteredCharacters,
        quotes: filteredQuotes,
        performances: filteredPerformances,
      };
  }
};
