import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import Footer from "@/components/layout/Footer";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-traditional",
});

export const metadata: Metadata = {
  title: "Chèo Google - Hệ thống tra cứu nghệ thuật Chèo truyền thống",
  description:
    "Khám phá và tìm hiểu về nghệ thuật Chèo Việt Nam qua các nhân vật, trích dẫn và vở diễn nổi tiếng",
  keywords:
    "chèo, nghệ thuật truyền thống, văn hóa việt nam, nhân vật chèo, trích dẫn chèo",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "icon",
        url: "/logo.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} font-traditional antialiased min-h-screen flex flex-col`}
      >
        <Layout>
          <main className="flex-1">{children}</main>
          <Footer />
        </Layout>
      </body>
    </html>
  );
}
