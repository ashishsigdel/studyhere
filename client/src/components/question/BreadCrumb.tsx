"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

type Props = {
  subject: string;
  chapter: string;
};

export default function Breadcrumb({ subject, chapter }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 1) {
      const newPath = "/" + pathSegments.slice(0, -1).join("/");
      router.push(newPath);
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="w-full">
      <ol className="flex items-center gap-2 text-sm md:text-base flex-wrap min-[320px]:flex-nowrap">
        <li className="hidden sm:flex items-center min-w-0">
          <Link
            href="/"
            className="px-2.5 py-2 rounded-lg bg-gray-200 dark:bg-[#3f4145] text-black dark:text-white
border border-black/10 dark:border-white/10 shadow-md shadow-black/10 dark:shadow-white.10            truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
            title={subject || "Home"}
          >
            {subject || "Home"}
          </Link>
        </li>

        {subject && (
          <>
            <FaChevronRight
              className="text-gray-400 dark:text-gray-500 flex-shrink-0 hidden sm:flex"
              size={20}
            />
            <li className="flex items-center min-w-0">
              <button
                onClick={handleBack}
                className="px-2.5 py-2 rounded-lg bg-gray-200 dark:bg-[#3f4145] text-black dark:text-white
border border-black/10 dark:border-white/10 shadow-md shadow-black/10 dark:shadow-white.10            truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
                title={chapter}
              >
                {chapter}
              </button>
            </li>
          </>
        )}

        {chapter && (
          <>
            <FaChevronRight
              className="text-gray-400 dark:text-gray-500 flex-shrink-0"
              size={20}
            />
            <li className="min-w-0">
              <span
                className="py-2 rounded-lg text-gray-800 dark:text-gray-200
                truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
                title="Questions"
              >
                Questions
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
