"use client";
import { User } from "@/types/user";
import { loadDataFromIndexedDB } from "@/utils/indexdb";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineRise } from "react-icons/ai";

export default function RecentChapter() {
  const [recentChapters, setRecentChapters] = useState<
    { name: string; url: string; subject: string }[]
  >([]);

  const fetchSubjects = async () => {
    try {
      const STORE_NAME = "recentChapters";

      let recentChapters = await loadDataFromIndexedDB(
        STORE_NAME,
        "recentChapters"
      );

      if (!recentChapters) {
        recentChapters = [];
      }
      setRecentChapters(recentChapters);
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <>
      {recentChapters.length > 0 && (
        <div className="flex flex-col mt-10 border-b border-10 pb-10">
          <div className="flex items-center justify-between mb-5 md:mb-12">
            <h2 className="text-xl md:text-3xl font-semibold flex items-center gap-3">
              <AiOutlineRise />
              Jump Back In
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentChapters.map((chapter, index) => (
              <Link
                href={chapter.url}
                key={index}
                className="p-4 rounded-lg shadow-md border border-5 transform transition duration-300 group flex items-center justify-between hover:-translate-y-0.5 bg-white dark:bg-[#424242] "
              >
                <div className="">
                  <h3 className="text-lg font-semibold capitalize line-clamp-1">
                    {chapter.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 capitalize line-clamp-1">
                    {chapter.subject}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs text-portfolio-primary">
                  <span>Resume</span>
                  <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
