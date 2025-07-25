// lib/chapters.ts
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

// Interfaces (no changes)
export interface Chapter {
  slug: string;
  part: string;
  title: string;
  html: string;
  // NEW: Add fileName for sorting
  fileName: string;
}

export interface TableOfContentsPart {
  title: string;
  slug: string;
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

const chaptersDir = path.join(process.cwd(), "src/chapters");

// Memoize chapters to avoid reading files multiple times during a build
let chaptersCache: Chapter[];

export function getAllChapters(): Chapter[] {
  if (chaptersCache) {
    return chaptersCache;
  }

  const filenames = fs.readdirSync(chaptersDir);

  chaptersCache = filenames
    .filter((filename) => filename.endsWith(".html"))
    .sort() // Sort by filename (e.g., "01-...", "02-...")
    .map((filename): Chapter => {
      const filePath = path.join(chaptersDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");

      const $ = cheerio.load(fileContents);
      const title = $("h1").text().trim();
      const part = $("p > em").text().replace("Part: ", "").trim();
      const slug = filename.replace(/\.html$/, "");

      return { slug, part, title, html: fileContents, fileName: filename };
    });

  return chaptersCache;
}

export function getTableOfContents(): TableOfContentsPart[] {
  const chapters = getAllChapters();
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

// --- NEW FUNCTIONS FOR DYNAMIC ROUTING ---

/**
 * Generates all possible URL paths for static generation.
 */
export function getChapterPaths() {
  return getAllChapters().map((chapter) => ({
    part: slugify(chapter.part),
    slug: chapter.slug,
  }));
}

/**
 * Gets the data for a single chapter, plus its next/previous siblings.
 */
export function getChapterData(part: string, slug: string) {
  const allChapters = getAllChapters();
  const chapterIndex = allChapters.findIndex(
    (c) => slugify(c.part) === part && c.slug === slug,
  );

  if (chapterIndex === -1) {
    return null;
  }

  const chapter = allChapters[chapterIndex];
  const prevChapter = allChapters[chapterIndex - 1] || null;
  const nextChapter = allChapters[chapterIndex + 1] || null;

  return {
    chapter,
    prev: prevChapter
      ? { part: slugify(prevChapter.part), slug: prevChapter.slug }
      : null,
    next: nextChapter
      ? { part: slugify(nextChapter.part), slug: nextChapter.slug }
      : null,
  };
}
