// components/Sidebar.tsx
"use client";

import { TableOfContentsPart } from "@/lib/chapters";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  tableOfContents: TableOfContentsPart[];
};

export default function Sidebar({ tableOfContents }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:relative lg:block lg:flex-none">
      <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
      <div className="absolute top-16 right-0 bottom-0 hidden h-12 w-px bg-linear-to-t from-slate-800 dark:block" />
      <div className="absolute top-28 right-0 bottom-0 hidden w-px bg-slate-800 dark:block" />
      <aside className="sticky top-0 bottom-0 -ml-0.5 h-screen w-64 overflow-x-hidden overflow-y-auto py-8 px-8 xl:w-72 xl:pr-16">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Making Music</h1>
            <p className="text-sm text-gray-500 mt-1">74 Creative Strategies</p>
          </div>

          <nav className={clsx("text-base lg:text-sm")}>
            <ul role="list" className="space-y-9">
              {tableOfContents.map((section) => (
                <li key={section.title}>
                  <h3 className="font-display font-medium text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                  <ul
                    role="list"
                    className="mt-2 space-y-2 border-l-2 border-slate-100 ml-2 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
                  >
                    {section.chapters.map((link) => (
                      <li key={link.slug} className="relative">
                        <Link
                          href={`#${link.slug}`}
                          className={clsx(
                            "block w-full text-sm pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                            pathname.includes(link.slug)
                              ? "font-semibold text-sky-500 before:bg-sky-500"
                              : "text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300",
                          )}
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>

          <nav>
            {tableOfContents.map((part) => (
              <div key={part.title} className="mb-6">
                <h6 className="font-display font-medium text-slate-900 dark:text-white">
                  {part.title}
                </h6>
                <ul className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800">
                  {part.chapters.map((chapter) => (
                    <li className="relative" key={chapter.slug}>
                      <a
                        href={`#${chapter.slug}`}
                        // className="block w-full pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full font-semibold text-sky-500 before:bg-sky-500"
                        className="block w-full pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                      >
                        {chapter.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
