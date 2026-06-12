import type { Metadata } from "next";
import { Amiri, Lora, Inter } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const lora = Lora({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Учим Коран — Сура 2",
  description: "Аяты с аудио, транскрипцией и переводом для заучивания",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${amiri.variable} ${lora.variable} ${inter.variable} font-inter`}
      >
        {children}
      </body>
    </html>
  );
}
