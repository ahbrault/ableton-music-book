// components/Sidebar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { TableOfContentsPart } from "@/lib/chapters";
import clsx from "clsx";
import Link from "next/link";

type SidebarProps = {
  tableOfContents: TableOfContentsPart[];
  activePartSlug: string;
};

export default function Sidebar({ tableOfContents, activePartSlug }: SidebarProps) {
  // State to track the chapter currently visible in the viewport
  const [activeChapterSlug, setActiveChapterSlug] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // This effect sets up an IntersectionObserver to watch which chapter is on screen.
  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        // Find the first entry that is intersecting (visible)
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry) {
          setActiveChapterSlug(intersectingEntry.target.id);
        }
      },
      // Options: rootMargin adjusts the "trigger area". -40% from top and bottom
      // means the chapter is highlighted when it's more centered on the screen.
      { rootMargin: "-40% 0px -40% 0px" }
    );

    // Observe all chapter sections on the page
    const elements = document.querySelectorAll(".chapter-section");
    elements.forEach((elem) => observer.current?.observe(elem));

    // Cleanup function to disconnect the observer when the component unmounts
    return () => observer.current?.disconnect();
  }, [activePartSlug]); // Rerun this effect when the active part changes

  return (
    <div className="hidden lg:relative lg:block lg:flex-none">
      <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
      <aside className="sticky top-0 -ml-0.5 h-screen w-64 overflow-y-auto overflow-x-hidden py-16 px-8 xl:w-72 xl:pr-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Making Music</h1>
            <p className="text-sm text-gray-500 mt-1">74 Creative Strategies</p>
          </div>

          <nav className="text-base lg:text-sm">
            <ul role="list" className="space-y-9">
              {tableOfContents.map((part) => (
                <li key={part.slug}>
                  {/* Part titles are now Links to change the page's content */}
                  <Link href={`/?part=${part.slug}`}>
                    <h3 className={clsx(
                      "font-display font-medium dark:text-white transition-colors",
                      part.slug === activePartSlug ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                    )}>
                      {part.title}
                    </h3>
                  </Link>

                  {/* Only display chapters for the currently active part */}
                  {part.slug === activePartSlug && (
                    <ul
                      role="list"
                      className="mt-2 space-y-2 border-l-2 border-slate-100 ml-2 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
                    >
                      {part.chapters.map((chapter) => (
                        <li key={chapter.slug} className="relative">
                          {/* Chapter links are now simple anchors for scrolling */}
                          <a
                            href={`#${chapter.slug}`}
                            className={clsx(
                              "block w-full text-sm pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                              chapter.slug === activeChapterSlug
                                ? "font-semibold text-sky-500 before:bg-sky-500"
                                : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                            )}
                          >
                            {chapter.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
