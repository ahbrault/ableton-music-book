// app/page.tsx
import { getAllChapters, getTableOfContents } from "@/lib/chapters";
import Sidebar from "@/components/Sidebar";

// This page now accepts searchParams to control which part is displayed.
export default function HomePage({
  searchParams,
}: {
  searchParams: { part?: string };
}) {
  const allChapters = getAllChapters();
  const tableOfContents = getTableOfContents(allChapters);
  console.log('allChapters', allChapters)
  console.log('tableOfContents', tableOfContents)

  // Determine the current part to display.
  // Default to the first part if no param is provided or if the param is invalid.
  const currentPartSlug = searchParams.part || tableOfContents[0]?.slug || '';
  const currentPart = tableOfContents.find(p => p.slug === currentPartSlug);

  // A helper function to create a URL-friendly slug
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  // Filter chapters to show only those from the current part.
  const chaptersToShow = allChapters.filter(
    (chapter) => slugify(chapter.part) === currentPartSlug
  );


  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        tableOfContents={tableOfContents}
        activePartSlug={currentPartSlug}
      />

      <main className="flex-1 relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {chaptersToShow.map((chapter) => (
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
