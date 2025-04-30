"use client";

import { useEffect, useState } from "react";
import useChapters from "../chapter/useChapters";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import SearchBar from "./SearchBar";

export default function QuestionSidebar() {
  const [adLoaded, setAdLoaded] = useState(false);
  const { chapters, fetchChapters, id } = useChapters();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      const timeout = setTimeout(() => setAdLoaded(false), 3000);

      const observer = new MutationObserver(() => {
        setAdLoaded(true);
        clearTimeout(timeout);
      });

      const adElement = document.querySelector(".adsbygoogle");
      if (adElement) {
        observer.observe(adElement, { childList: true });
      }

      return () => {
        observer.disconnect();
        clearTimeout(timeout);
      };
    } catch (e) {
      console.log("AdSense error:", e);
      setAdLoaded(false);
    }
  }, []);

  useEffect(() => {
    if (id) fetchChapters();
  }, [id]);

  const handleChapterClick = (chapterId: number) => {
    const segments = pathname.split("/");
    let id = chapterId.toString();
    segments[segments.length - 1] = id;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  if (!loaded) return null;

  return (
    <div className="min-[900px]:min-h-[250px]">
      <SearchBar />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9557309412103379"
        data-ad-slot="8236029305"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      {/* Navigation Links */}
      <div className="py-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 font-medium w-full hover:bg-gray-100 dark:hover:bg-gray-800 py-2 rounded-md"
        >
          {collapsed ? (
            <FaChevronRight className="h-4 w-4" />
          ) : (
            <FaChevronDown className="h-4 w-4" />
          )}
          <span>Chapters</span>
        </button>

        {!collapsed && (
          <nav className="space-y-2">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter.id)}
                className={`w-full flex items-start gap-2 text-sm p-2 rounded-md transition-colors ${
                  pathname.split("/").pop() === chapter.id.toString()
                    ? "font-semibold text-black dark:text-white bg-white dark:bg-gray-700"
                    : "font-normal text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="min-w-[20px]">{index + 1}.</span>
                <span className="capitalize text-left line-clamp-1">
                  {chapter.name}
                </span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
