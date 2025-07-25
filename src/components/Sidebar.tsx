// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { TableOfContentsPart } from "@/lib/chapters";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";

// --- Helper Icon Components ---
function MenuIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M5 5l14 14M19 5l-14 14" />
    </svg>
  );
}

// --- Reusable Navigation Links Component ---
function NavigationLinks({
  tableOfContents,
  onLinkClick,
}: {
  tableOfContents: TableOfContentsPart[];
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={clsx("text-base lg:text-sm")}>
      <ul role="list" className="space-y-9">
        {tableOfContents.map((section) => {
          const isActivePart = pathname.startsWith(`/${section.slug}`);
          return (
            <li key={section.title}>
              <Link href={`/${section.slug}`} onClick={onLinkClick}>
                <h3
                  className={clsx(
                    "font-display font-medium dark:text-white transition-colors",
                    isActivePart
                      ? "text-sky-500"
                      : "text-slate-900 hover:text-slate-700 dark:hover:text-slate-300",
                  )}
                >
                  {section.title}
                </h3>
              </Link>
              <ul
                role="list"
                className="mt-2 space-y-2 border-l-2 border-slate-100 ml-2 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
              >
                {section.chapters.map((link) => {
                  const href = `/${section.slug}/${link.slug}`;
                  return (
                    <li key={link.slug} className="relative">
                      <Link
                        href={href}
                        onClick={onLinkClick}
                        className={clsx(
                          "block w-full text-sm pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full",
                          pathname === href
                            ? "font-semibold text-sky-500 before:bg-sky-500"
                            : "text-slate-500 before:hidden before:bg-slate-300 pr-1 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300",
                        )}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// --- Main Sidebar Component ---
export default function Sidebar({
  tableOfContents,
}: {
  tableOfContents: TableOfContentsPart[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* --- Mobile Header --- */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center">
          <h4 className="text-lg font-bold text-gray-800 dark:text-white">
            Making Music
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gray-500 rounded-md hover:text-gray-700"
          aria-label="Open navigation"
        >
          <MenuIcon className="w-6 h-6 stroke-slate-500" />
        </button>
      </header>

      {/* --- Mobile Menu Dialog --- */}
      <Dialog
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        className="relative z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <DialogPanel className="fixed inset-y-0 left-0 w-full max-w-xs p-6 bg-white dark:bg-slate-900 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold">Navigation</h2>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 rounded-md hover:text-gray-700"
              aria-label="Close navigation"
            >
              <CloseIcon className="w-6 h-6 stroke-slate-500" />
            </button>
          </div>
          <NavigationLinks tableOfContents={tableOfContents} />
        </DialogPanel>
      </Dialog>

      {/* --- Desktop Sidebar --- */}
      <div className="hidden lg:relative lg:block lg:flex-none">
        <aside className="sticky top-0 -ml-0.5 h-screen w-64 overflow-y-auto overflow-x-hidden py-16 px-8 xl:w-72 xl:pr-16 bg-slate-50 dark:bg-black/80">
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Making Music
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                74 Creative Strategies
              </p>
            </div>
            <NavigationLinks tableOfContents={tableOfContents} />
          </div>
        </aside>
      </div>
    </>
  );
}
