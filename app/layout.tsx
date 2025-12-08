import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Code Riddle",
  description: "Create and solve riddles with prize letters and audio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />

        <div className="flex-1 flex items-center justify-center px-6">
          <main className="max-w-[980px] w-full">{children}</main>
        </div>

        <footer className="border-t border-gray-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
          <div className="max-w-[980px] w-full mx-auto px-6 py-4">
            Made with ❤️ — CodeRiddle
          </div>
        </footer>
      </body>
    </html>
  );
}
