import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "./components/navbar/NavBar";
import "./style/globals.css";
import "./style/bgTest.css";
import Footer from "./components/footer/footer";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen background-pattern bg-fixed`}
      >
        <NavBar isPrize={false} />
          <main className="flex-1 flex items-center justify-center px-6 py-8">
            <div className="max-w-[1080px] w-screen">{children}</div>
          </main>
        <Footer />
      </body>
    </html>
  );
}
