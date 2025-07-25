// app/page.tsx
import { getAllChapters, getTableOfContents } from "@/lib/chapters";
import Sidebar from "@/components/Sidebar";

// This is a React Server Component, so we can fetch data directly.
export default function HomePage() {
  const allChapters = getAllChapters();
  const tableOfContents = getTableOfContents(allChapters);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar tableOfContents={tableOfContents} />

      <main className="flex-1 relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {allChapters.map((chapter) => (
            <article
              key={chapter.slug}
              id={chapter.slug}
              className="chapter-section scroll-mt-16 mb-16 pb-16 border-b border-gray-200 last:border-b-0"
            >
              {/* This is safe because we generated and cleaned the HTML ourselves. */}
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: chapter.html }}
              />
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
