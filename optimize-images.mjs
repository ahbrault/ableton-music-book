// optimize-images.mjs
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import * as cheerio from "cheerio";

// --- CONFIGURATION ---
// Adjust these paths if your project structure is different.
const CONFIG = {
  // The directory where your manually cleaned HTML files are.
  chaptersDir: path.join(process.cwd(), "src/chapters"),
  // The directory where optimized images will be saved (inside your Next.js public folder).
  imagesOutputDir: path.join(process.cwd(), "public", "images", "chapters"),
  // The public URL path for the images folder.
  publicImagesPath: "/images/chapters",
};

/**
 * Processes a single HTML file to extract and optimize its base64 images.
 * @param {string} filePath - The full path to the HTML file.
 * @param {string} fileName - The name of the HTML file (e.g., "01-three-ways-to-start.html").
 */
async function processHtmlFile(filePath, fileName) {
  console.log(`[INFO] Processing file: ${fileName}`);
  const chapterSlug = fileName.replace(/\.html$/, "");
  const htmlContent = await fs.readFile(filePath, "utf8");
  const $ = cheerio.load(htmlContent);

  const imagesToProcess = [];
  $("img").each((index, element) => {
    const img = $(element);
    console.log("img", img);
    const src = img.attr("src");
    if (src && src.startsWith("data:image/")) {
      imagesToProcess.push({ element: img, src, index });
    }
  });

  if (imagesToProcess.length === 0) {
    console.log(`[SKIP] No base64 images found in ${fileName}.`);
    return;
  }

  console.log(
    `[INFO] Found ${imagesToProcess.length} image(s) to optimize in ${fileName}.`,
  );

  for (const image of imagesToProcess) {
    try {
      const base64Data = image.src.split(";base64,").pop();
      if (!base64Data) continue;

      const imageBuffer = Buffer.from(base64Data, "base64");
      const imageFileName = `image-${image.index + 1}.webp`;

      const chapterImageDir = path.join(CONFIG.imagesOutputDir, chapterSlug);
      await fs.mkdir(chapterImageDir, { recursive: true });

      const imageOutputPath = path.join(chapterImageDir, imageFileName);

      // Optimize the image
      await sharp(imageBuffer)
        .resize({ width: 800, withoutEnlargement: true }) // Max width 800px
        .webp({ quality: 80 }) // Convert to WebP format
        .toFile(imageOutputPath);

      // Update the <img> tag in the HTML
      const publicPath = `${CONFIG.publicImagesPath}/${chapterSlug}/${imageFileName}`;
      image.element.attr("src", publicPath);
      console.log(
        `  [OK] Image ${image.index + 1} optimized and saved to ${publicPath}`,
      );
    } catch (error) {
      console.error(
        `  [ERROR] Failed to process image ${image.index + 1} in ${fileName}:`,
        error,
      );
    }
  }

  // Overwrite the original HTML file with the updated content
  await fs.writeFile(filePath, $.html());
  console.log(`[SUCCESS] Updated ${fileName} with new image paths.`);
}

/**
 * Main function to run the optimization process.
 */
async function runOptimizer() {
  console.log("--- Starting Image Optimizer ---");
  try {
    const files = await fs.readdir(CONFIG.chaptersDir);
    for (const file of files) {
      if (file.endsWith(".html")) {
        await processHtmlFile(path.join(CONFIG.chaptersDir, file), file);
      }
    }
  } catch (error) {
    console.error("[FATAL] An error occurred:", error);
    if (error.code === "ENOENT") {
      console.error(
        `\n[HINT] The directory "${CONFIG.chaptersDir}" was not found.`,
      );
      console.error(
        "Please make sure the path in the CONFIG object is correct.",
      );
    }
  }
  console.log("--- Optimization Complete ---");
}

runOptimizer();
