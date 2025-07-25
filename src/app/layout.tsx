// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import clsx from "clsx";
import Sidebar from "@/components/Sidebar";
import { getTableOfContents } from "@/lib/chapters";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lexend = localFont({
  src: "../fonts/lexend.woff2",
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Making Music - A Web Reader",
  description:
    "74 Creative Strategies for Electronic Music Producers by Dennis DeSantis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tableOfContents = getTableOfContents();

  return (
    <html
      lang="en"
      className={clsx("h-full antialiased", inter.variable, lexend.variable)}
      suppressHydrationWarning
    >
      <body className="lg:flex min-h-full bg-white dark:bg-slate-900">
        <Sidebar tableOfContents={tableOfContents} />
        {children}
      </body>
    </html>
  );
}
