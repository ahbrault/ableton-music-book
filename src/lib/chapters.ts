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

// FIX: Corrected path to the chapters directory
const chaptersDir = path.join(process.cwd(), "src/chapters");

// Memoize chapters to avoid reading files multiple times
let chaptersCache: Chapter[];

export function getAllChapters(): Chapter[] {
  if (chaptersCache) {
    return chaptersCache;
  }

  const filenames = fs.readdirSync(chaptersDir);

  chaptersCache = filenames
    .filter((filename) => filename.endsWith(".html"))
    .sort() // Sort by filename prefix (01-, 02-, etc.)
    .map((filename): Chapter => {
      const filePath = path.join(chaptersDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");

      const $ = cheerio.load(fileContents);
      // FIX: The parser script generates H2 for titles, not H1
      const title = $("h1").text().trim();
      const part = $("p > em").text().replace("Part: ", "").trim();
      const slug = filename.replace(/\.html$/, "");

      return { slug, part, title, html: fileContents };
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

export function getChapterPaths() {
  return getAllChapters().map((chapter) => ({
    // FIX: Match the dynamic segment names [part] and [slug]
    part: slugify(chapter.part),
    slug: chapter.slug,
  }));
}

export function getChapterData(partSlug: string, chapterSlug: string) {
  const allChapters = getAllChapters();
  const chapterIndex = allChapters.findIndex(
    (c) => slugify(c.part) === partSlug && c.slug === chapterSlug,
  );

  if (chapterIndex === -1) return null;

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

// --- NEW FUNCTIONS FOR THE PART PAGE ---

/**
 * Generates all possible URL paths for the part pages.
 */
export function getPartPaths() {
  const parts = new Set(getAllChapters().map((c) => slugify(c.part)));
  return Array.from(parts).map((part) => ({
    part: part,
  }));
}

/**
 * Gets the data for a specific part, including all its chapters.
 */
export function getPartData(partSlug: string) {
  const allChapters = getAllChapters();
  const chaptersInPart = allChapters.filter(
    (c) => slugify(c.part) === partSlug,
  );

  if (chaptersInPart.length === 0) {
    return null;
  }

  return {
    partTitle: chaptersInPart[0].part,
    chapters: chaptersInPart,
  };
}
