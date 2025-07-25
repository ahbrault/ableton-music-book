// // app/page.tsx
// import { getAllChapters, getTableOfContents } from "@/lib/chapters";
// import Sidebar from "@/components/Sidebar";

// type HomePageProps = {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// // This is a React Server Component, so we can fetch data directly.
// export default async function HomePage({ searchParams }: HomePageProps) {
//   const params = await searchParams;
//   const allChapters = getAllChapters();
//   const tableOfContents = getTableOfContents(allChapters);

//   // The search param could be an array, so we handle that case.
//   const partParam = params?.part;
//   const activePartSlug = Array.isArray(partParam) ? partParam[0] : partParam;

//   // Determine the current part to display.
//   // Default to the first part if no param is provided or if the param is invalid.
//   const currentPartSlug =
//     activePartSlug || tableOfContents[0]?.slug || "";

//   // A helper function to create a URL-friendly slug
//   const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

//   // Filter chapters to show only those from the current part.
//   const chaptersToShow = allChapters.filter(
//     (chapter) => slugify(chapter.part) === currentPartSlug
//   );

//   return (
//     <div className="flex min-h-screen bg-white">
//       <Sidebar
//         tableOfContents={tableOfContents}
//         activePartSlug={currentPartSlug}
//       />

//       <main className="flex-1 relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
//         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {chaptersToShow.map((chapter) => (
//             <article
//               key={chapter.slug}
//               id={chapter.slug}
//               className="chapter-section scroll-mt-16 mb-16 pb-16 border-b border-gray-200 last:border-b-0"
//             >
//               <div
//                 className="prose prose-lg max-w-none"
//                 dangerouslySetInnerHTML={{ __html: chapter.html }}
//               />
//             </article>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

// app/page.tsx
import { redirect } from "next/navigation";
import { getChapterPaths } from "@/lib/chapters";

export default function RootPage() {
  // Get the path to the very first chapter
  const firstChapterPath = getChapterPaths()[0];

  if (firstChapterPath) {
    redirect(`/${firstChapterPath.part}/${firstChapterPath.slug}`);
  }

  return <div>Loading...</div>;
}
