import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import Footer from "@/components/layout/Footer";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-traditional",
});

export const metadata: Metadata = {
  title: "Chèo Ontology - Hệ thống tra cứu nghệ thuật Chèo truyền thống",
  description:
    "Khám phá và tìm hiểu về nghệ thuật Chèo Việt Nam qua các nhân vật, trích dẫn và vở diễn nổi tiếng",
  keywords:
    "chèo, nghệ thuật truyền thống, văn hóa việt nam, nhân vật chèo, trích dẫn chèo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${libreBaskerville.variable} font-traditional antialiased min-h-screen flex flex-col`}
      >
        <Layout>
          <main className="flex-1">{children}</main>
          <Footer />
        </Layout>
      </body>
    </html>
  );
}
