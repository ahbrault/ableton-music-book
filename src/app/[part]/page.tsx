// app/[part]/page.tsx
import { getPartData, getPartPaths } from "@/lib/chapters";
import { notFound } from "next/navigation";

// Generate static pages for each part at build time
export function generateStaticParams() {
    return getPartPaths();
}

type PartPageProps = {
    params: Promise<{
        part: string;
    }>;
};

export default async function PartPage({ params }: PartPageProps) {
    const { part } = await params;
    const data = getPartData(part);

    if (!data) {
        notFound();
    }

    const { partTitle, chapters } = data;

    return (
        <main className="flex-1">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h4 className="text-xl font-bold text-sky-500">{partTitle}</h4>
                {chapters.map((chapter) => (
                    <article
                        key={chapter.slug}
                        id={chapter.slug}
                        className="chapter-section scroll-mt-16 mb-16 pb-16 border-b border-gray-200 last:border-b-0"
                    >
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: chapter.html }}
                        />
                    </article>
                ))}
            </div>
        </main>
    );
}
