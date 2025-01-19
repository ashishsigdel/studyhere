"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaChevronRight } from "react-icons/fa";

type Props = {
  subject: string;
  chapter: string;
};

export default function Breadcrumb({ subject, chapter }: Props) {
  const router = useRouter();

  return (
    <nav className="w-full py-3">
      <ol className="flex items-center gap-2 text-lg flex-wrap min-[320px]:flex-nowrap">
        <li className="flex items-center min-w-0">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
            transition-colors duration-200 shadow-sm dark:shadow-gray-900 text-gray-800 dark:text-gray-200
            truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
            title={subject || "Home"}
          >
            {subject || "Home"}
          </Link>
        </li>

        {subject && (
          <>
            <FaChevronRight
              className="text-gray-400 dark:text-gray-500 flex-shrink-0"
              size={20}
            />
            <li className="flex items-center min-w-0">
              <button
                onClick={() => router.back()}
                className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-colors duration-200 shadow-sm dark:shadow-gray-900 text-gray-800 dark:text-gray-200
                truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
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
                className="px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200
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
