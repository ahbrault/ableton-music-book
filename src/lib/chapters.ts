// lib/chapters.ts
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

// Define the structure for our chapter and TOC objects
export interface Chapter {
  slug: string;
  part: string;
  title: string;
  html: string;
}

export interface TableOfContentsPart {
  title: string;
  slug: string; // We'll add a slug for linking
  chapters: {
    title: string;
    slug: string;
  }[];
}

// Utility to create URL-friendly slugs
function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/[\u200c-\u200d\uFEFF]/g, "")
    .trim()
    .replace(/“|”|"/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Correct the path to your chapters directory
const chaptersDir = path.join(process.cwd(), "src/chapters");

/**
 * Reads all chapter HTML files, parses them, and returns them sorted correctly.
 */
export function getAllChapters(): Chapter[] {
  const filenames = fs.readdirSync(chaptersDir);

  const chapters = filenames
    .filter((filename) => filename.endsWith(".html"))
    .sort() // This will sort files alphabetically, e.g., "01-...", "02-..."
    .map((filename): Chapter => {
      const filePath = path.join(chaptersDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");

      const $ = cheerio.load(fileContents);
      // The title is now in an H2 tag from our parser script
      const title = $("h1").text().trim();
      const part = $("p > em").text().replace("Part: ", "").trim();
      const slug = filename.replace(/\.html$/, "");

      return {
        slug,
        part,
        title,
        html: fileContents,
      };
    });

  return chapters;
}

/**
 * Groups the chapters by their "part" to build a structured table of contents.
 */
export function getTableOfContents(chapters: Chapter[]): TableOfContentsPart[] {
  const tocMap = new Map<string, { title: string; slug: string }[]>();

  chapters.forEach((chapter) => {
    if (!tocMap.has(chapter.part)) {
      tocMap.set(chapter.part, []);
    }
    tocMap.get(chapter.part)?.push({
      title: chapter.title,
      slug: chapter.slug,
    });
  });

  return Array.from(tocMap.entries()).map(([title, chapters]) => ({
    title,
    slug: slugify(title),
    chapters,
  }));
}
