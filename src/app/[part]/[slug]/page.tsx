// app/[part]/[slug]/page.tsx
import { getChapterPaths, getChapterData } from "@/lib/chapters";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

type ChapterPageProps = {
  params: Promise<{
    part: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { part, slug } = await params;
  const data = getChapterData(part, slug);

  if (!data) {
    return {
      title: "Chapter Not Found",
    };
  }

  return {
    title: `${data.chapter.title} | Making Music`,
    description: `Chapter from the part "${data.chapter.part}" of the book Making Music.`,
  };
}

// This function generates all the static pages at build time.
export function generateStaticParams() {
  return getChapterPaths();
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { part, slug } = await params;
  const data = getChapterData(part, slug);

  // If chapter data isn't found, show a 404 page.
  if (!data) {
    notFound();
  }

  const { chapter, prev, next } = data;

  return (
    <main className="flex-1">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h4 className="text-xl font-bold text-sky-500">{chapter.part}</h4>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: chapter.html }}
        />

        {/* Previous/Next Navigation */}
        <div className="mt-12 flex justify-between border-t border-gray-200 pt-8">
          {prev ? (
            <Link
              href={`/${prev.part}/${prev.slug}`}
              className="flex items-center text-gray-500 hover:text-blue-600"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              Previous
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/${next.part}/${next.slug}`}
              className="flex items-center text-gray-500 hover:text-blue-600"
            >
              Next
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>
    </main>
  );
}
