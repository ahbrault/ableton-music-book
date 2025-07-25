// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getChapterPaths, getPartPaths } from '@/lib/chapters';

// IMPORTANT: Replace this with your actual domain name before deploying
const BASE_URL = 'https://ableton-book.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    // 1. Generate URLs for each part (e.g., /problems-of-beginning)
    const partUrls = getPartPaths().map((partPath) => ({
        url: `${BASE_URL}/${partPath.part}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    // 2. Generate URLs for each individual chapter
    const chapterUrls = getChapterPaths().map((chapterPath) => ({
        url: `${BASE_URL}/${chapterPath.part}/${chapterPath.slug}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const, // The content is static
        priority: 1.0,
    }));

    // 3. Add the homepage URL (which redirects to the first chapter)
    const homeUrl = {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.5,
    };

    return [homeUrl, ...partUrls, ...chapterUrls];
}
