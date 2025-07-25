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
  chapters: {
    title: string;
    slug: string;
  }[];
}

// Get the full path to the chapters directory
const chaptersDir = path.join(process.cwd(), "src/chapters");

/**
 * Reads all chapter HTML files, parses them, and returns them as an array of objects.
 * This function runs only on the server side.
 */
export function getAllChapters(): Chapter[] {
  console.log("path.join(process.cwd()", path.join(process.cwd()));
  const filenames = fs.readdirSync(chaptersDir);

  const chapters = filenames
    .filter((filename) => filename.endsWith(".html"))
    .map((filename): Chapter => {
      const filePath = path.join(chaptersDir, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");

      // Use Cheerio to parse metadata from the HTML file itself
      const $ = cheerio.load(fileContents);
      const part = $("p > em").text().replace("Part: ", "").trim();
      const title = $("h1").text().trim();
      const slug = filename.replace(/\.html$/, "");

      return {
        slug,
        part,
        title,
        html: fileContents,
      };
    });

  // It's good practice to sort the chapters, although readdir is often consistent.
  // This ensures they appear in the correct order if the filesystem reads them randomly.
  // Since we don't have an order number, we'll rely on the filesystem order for now.
  // For a more robust solution, one could add a numeric prefix to the filenames.
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
    chapters,
  }));
}
