"use client";

import Theme from "@/utils/Theme";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa";

type Props = {
  subject: string;
  showForm: boolean;
  setShowForm: any;
};

export default function Breadcrumb({ subject, showForm, setShowForm }: Props) {
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <nav className="w-full py-4 justify-between flex items-center">
      <ol className="flex items-center gap-2 text-lg flex-wrap min-[320px]:flex-nowrap">
        <li className="flex items-center min-w-0">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600  text-gray-700 dark:text-gray-200
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
            <li className="min-w-0">
              <span
                className="px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200
                truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
                title="Questions"
              >
                Chapters
              </span>
            </li>
          </>
        )}
      </ol>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2.5 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          onClick={toggleForm}
          aria-label="Add new item"
        >
          <FaPlus size={20} />
        </button>
      </div>
    </nav>
  );
}
