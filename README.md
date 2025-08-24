# 🎭 Chèo Ontology - Hệ thống tra cứu nghệ thuật Chèo truyền thống

<div align="center">
  <img src="frontend/public/logo.png" alt="Chèo Ontology Logo" width="120" height="120">
  
  **🇻🇳 Khám phá và bảo tồn di sản văn hóa nghệ thuật Chèo Việt Nam 🇻🇳**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
</div>

## 🌟 Giới thiệu

**Chèo Ontology** là một hệ thống tra cứu hiện đại và đầy đủ về nghệ thuật Chèo - một trong những loại hình nghệ thuật truyền thống đặc sắc nhất của Việt Nam. Dự án được phát triển với mục tiêu bảo tồn, quảng bá và lan tỏa giá trị văn hóa dân tộc đến với thế hệ trẻ và cộng đồng quốc tế.

### 🎯 Tầm nhìn

Trở thành nền tảng số hàng đầu về nghệ thuật Chèo, góp phần bảo tồn và phát triển di sản văn hóa phi vật thể của dân tộc Việt Nam.

### 🚀 Sứ mệnh

- 📚 **Bảo tồn**: Lưu giữ và số hóa tài liệu về nghệ thuật Chèo
- 🔍 **Tra cứu**: Cung cấp công cụ tìm kiếm thông minh và chính xác
- 🎭 **Giáo dục**: Hỗ trợ việc học tập và nghiên cứu về Chèo
- 🌍 **Quảng bá**: Giới thiệu nghệ thuật Chèo đến cộng đồng rộng lớn

## ✨ Tính năng chính

### 🔎 Tìm kiếm thông minh

- **Tìm kiếm đa chiều**: Theo nhân vật, trích dẫn, vở diễn, cảnh quay
- **Gợi ý thông minh**: Autocomplete và tìm kiếm ngữ nghĩa
- **Bộ lọc nâng cao**: Lọc theo thể loại, thời đại, khu vực

### 🎭 Thư viện nhân vật

- **Cơ sở dữ liệu nhân vật**: Thông tin chi tiết về các nhân vật Chèo
- **Phân loại theo vai**: Sinh, đàn, tiều, điệu, hề, thề, mơ
- **Tính cách và đặc điểm**: Mô tả tính cách, trang phục, đặc trưng
- **Video minh họa**: Các đoạn video biểu diễn tiêu biểu

### 💬 Kho trích dẫn

- **Câu thoại kinh điển**: Thu thập các câu thoại nổi tiếng
- **Phân loại theo chủ đề**: Tình yêu, lý tưởng, triết lý, hài hước
- **Ngữ cảnh sử dụng**: Giải thích ý nghĩa và hoàn cảnh

### 🎬 Thư viện video

- **Video biểu diễn**: Các đoạn video chất lượng cao
- **Phân loại theo cảm xúc**: Vui, buồn, giận, sợ, bình thường
- **Ghi chú và giải thích**: Thông tin về màn trình diễn

## 🛠️ Công nghệ sử dụng

### 🎨 Frontend

```typescript
🖥️ Framework: Next.js 14 (App Router)
📝 Language: TypeScript 5.0+
🎨 Styling: Tailwind CSS 4.0
🎭 UI Components: Custom React Components
🌍 Internationalization: Tiếng Việt (primary)
📱 Responsive: Mobile-first design
```

### ⚙️ Backend

```typescript
🔧 Runtime: Node.js 18+
📝 Language: TypeScript
🏗️ Framework: Express.js
🗄️ Database: GraphDB / RDF Store
🔍 Search Engine: Elasticsearch (planned)
```

### 🎨 Design System

```css
🎨 Colors: Vietnamese Flag Theme (Red, Yellow, White)
🔤 Typography: Be Vietnam Pro (Vietnamese optimized)
🎭 Cultural Elements: Traditional Vietnamese patterns
📐 Layout: Grid-based responsive design
```

### 🚀 Development Tools

```bash
📦 Package Manager: npm
🔨 Build Tool: Next.js built-in
🧹 Code Quality: ESLint + Prettier
🔧 Development: Hot reload, TypeScript strict mode
🌍 Deployment: Vercel (planned)
```

## 📁 Cấu trúc project

```
Cheo-Ontology/
├── 🎭 frontend/                 # Next.js frontend application
│   ├── 📁 src/
│   │   ├── 📁 app/             # App Router pages
│   │   │   ├── 🏠 page.tsx     # Trang chủ
│   │   │   ├── 🔍 search/      # Trang tìm kiếm
│   │   │   ├── 📚 library/     # Thư viện
│   │   │   ├── 🎭 characters/  # Nhân vật
│   │   │   └── 🎬 videos/      # Video
│   │   ├── 📁 components/      # React components
│   │   │   ├── 🧭 layout/      # Layout components
│   │   │   ├── 🔍 search/      # Search components
│   │   │   └── 📊 results/     # Result display
│   │   ├── 📁 apis/           # API client functions
│   │   ├── 📁 types/          # TypeScript definitions
│   │   └── 📁 utils/          # Utility functions
│   └── 📁 public/             # Static assets
│       ├── 🖼️ logo.png        # Logo Chèo Ontology
│       └── 📷 *.jpg           # Hình ảnh minh họa
├── ⚙️ backend/                 # Node.js backend API
│   ├── 📁 src/
│   │   ├── 🔌 controllers/    # API controllers
│   │   ├── 🛣️ routes/         # API routes
│   │   ├── 📝 types/          # Type definitions
│   │   └── 🔧 utils/          # Utilities
│   └── 📦 package.json
└── 📖 README.md               # Documentation
```

## 🚀 Cài đặt và chạy

### 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **TypeScript**: >= 5.0.0

### 💾 Clone repository

```bash
git clone https://github.com/BlackRose484/Cheo_Ontology.git
cd Cheo_Ontology
```

### 🎭 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt và truy cập: `http://localhost:3000`

### ⚙️ Backend Setup

```bash
cd backend
npm install
npm run dev
```

API server sẽ chạy tại: `http://localhost:8000`

## 🎨 Giao diện và thiết kế

### 🇻🇳 Vietnamese Cultural Theme

- **Màu sắc chủ đạo**: Đỏ (🔴), Vàng (🟡), Trắng (⚪) - Lấy cảm hứng từ quốc kỳ Việt Nam
- **Typography**: Be Vietnam Pro - Font chữ tối ưu cho tiếng Việt
- **Biểu tượng**: Logo truyền thống kết hợp hiện đại
- **Layout**: Responsive design, mobile-first approach

### 📱 Responsive Design

- **Desktop**: Giao diện đầy đủ với sidebar và multi-column layout
- **Tablet**: Adaptive layout với collapsible navigation
- **Mobile**: Touch-optimized interface với bottom navigation

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng!

### 🌟 Cách đóng góp

1. **Fork** repository này
2. **Tạo branch** cho tính năng mới: `git checkout -b feature/amazing-feature`
3. **Commit** thay đổi: `git commit -m 'Add some amazing feature'`
4. **Push** lên branch: `git push origin feature/amazing-feature`
5. **Tạo Pull Request**

### 📝 Quy tắc đóng góp

- Sử dụng **tiếng Việt** trong comments và documentation
- Tuân thủ **TypeScript strict mode**
- Viết **unit tests** cho các tính năng mới
- Đảm bảo **responsive design** trên mọi thiết bị

## 📧 Liên hệ

- **👨‍💻 Developer**: BlackRose484
- **📧 Email**: hungnbc2@gmail.com
- **🌐 Website**: [Project Website]
- **📱 Social**: [Social Media Links]

## 📄 License

Dự án này được phát hành dưới giấy phép MIT License. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">
  <p><strong>🎭 Được phát triển với ❤️ vì tình yêu nghệ thuật Chèo Việt Nam 🇻🇳</strong></p>
  <p><em>"Chèo không chỉ là nghệ thuật, mà còn là linh hồn của dân tộc"</em></p>
</div>
