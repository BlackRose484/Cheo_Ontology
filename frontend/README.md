# Chèo Ontology

Hệ thống tra cứu toàn diện về nghệ thuật Chèo truyền thống Việt Nam.

## Giới thiệu

Chèo Ontology là một ứng dụng web được xây dựng với Next.js và React, nhằm bảo tồn và chia sẻ kiến thức về nghệ thuật Chèo - một loại hình nghệ thuật sân khấu dân gian đặc sắc của Việt Nam.

## Tính năng chính

- 🔍 **Tìm kiếm thông minh**: Tìm kiếm đa dạng theo nhân vật, trích dẫn, vở diễn với bộ lọc chi tiết
- 👥 **Quản lý nhân vật**: Danh sách và thông tin chi tiết về các nhân vật Chèo
- 💬 **Trích dẫn nổi tiếng**: Kho tàng các câu thoại và lời ca đầy ý nghĩa
- 🎭 **Vở diễn kinh điển**: Thông tin về các vở Chèo truyền thống
- 📱 **Thiết kế responsive**: Tương thích mọi thiết bị
- 🎨 **Giao diện văn hóa**: Thiết kế mang đậm chất truyền thống Việt Nam

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS với theme tùy chỉnh
- **Font**: Libre Baskerville (Google Fonts)
- **Icons**: Emoji và SVG icons

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn

### Hướng dẫn cài đặt

1. Clone repository:

```bash
git clone <repository-url>
cd cheo-ontology
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
```

3. Chạy development server:

```bash
npm run dev
# hoặc
yarn dev
```

4. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

### Build cho production

```bash
npm run build
npm start
```

## Cấu trúc dự án

```
cheo-ontology/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── about/             # Trang giới thiệu
│   │   ├── characters/        # Trang danh sách nhân vật
│   │   ├── quotes/            # Trang trích dẫn
│   │   ├── search/            # Trang tìm kiếm
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Trang chủ
│   ├── components/            # React components
│   │   ├── layout/            # Layout components
│   │   ├── results/           # Result display components
│   │   └── search/            # Search components
│   ├── lib/                   # Utilities và mock data
│   └── types/                 # TypeScript type definitions
├── public/                    # Static files
├── tailwind.config.ts         # Tailwind configuration
└── next.config.ts            # Next.js configuration
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
