"use client";
import { User } from "@/types/user";
import { loadDataFromIndexedDB } from "@/utils/indexdb";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function RecentChapter() {
  const [recentChapters, setRecentChapters] = useState<
    { name: string; url: string; subject: string }[]
  >([]);
  const [user, setUser] = useState<User | null>(null);

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
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <>
      {recentChapters.length > 0 && (
        <div className="flex flex-col mt-10 md:mt-16">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-5 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
                Recently Viewed Chapters 📚
              </h2>
            </div>
            <div className="mt-2  grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentChapters.map((chapter, index) => (
                <Link
                  href={chapter.url}
                  key={index}
                  className="p-4 rounded-lg shadow-md border border-black/10 dark:border-white/30 transform transition duration-300 hover:scale-105"
                >
                  <h3 className="text-lg font-semibold">{chapter.name}</h3>
                  <p className="text-gray-500">{chapter.subject}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
