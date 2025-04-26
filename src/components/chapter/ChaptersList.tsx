import { Spinner } from "@/utils";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { MouseEventHandler } from "react";
import { FaBookOpen, FaPlus, FaWifi } from "react-icons/fa";

type Props = {
  toggleForm: MouseEventHandler<HTMLButtonElement>;
  chapters: { id: number; name: string }[];
  subject: string;
  loading: boolean;
};

export default function ChaptersList({
  toggleForm,
  chapters,
  subject,
  loading,
}: Props) {
  const pathname = usePathname();

  const handleChapterClick = async (
    subjectName: string,
    chapterName: string,
    chapterId: number
  ) => {
    const STORE_NAME = "recentChapters";
    const chapterUrl = `${pathname}/${chapterId}`;

    let recentChapters = await loadDataFromIndexedDB(
      STORE_NAME,
      "recentChapters"
    );

    if (!recentChapters) {
      recentChapters = [];
    }
    recentChapters = recentChapters.filter((ch: any) => ch.url !== chapterUrl);
    recentChapters.unshift({
      name: chapterName,
      url: chapterUrl,
      subject: subjectName,
    });

    if (recentChapters.length > 4) {
      recentChapters = recentChapters.slice(0, 4);
    }

    await saveDataToIndexedDB(STORE_NAME, "recentChapters", recentChapters);
  };
  return (
    <div
      id="chapters"
      className="min-h-[100vh] border-b border-black/20 dark:border-white/20 py-6 "
    >
      <div className="flex flex-col ">
        <div className="flex flex-col justify-between w-full">
          <div className="w-full justify-between flex items-center mb-4">
            <h2 className="text-2xl font-semibold ">Chapters</h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="p-2 rounded-lg cursor-pointer bg-transparent hover:bg-primary hover:text-white  transition-all active:scale-95 text-primary border border-primary flex items-center gap-2"
                onClick={toggleForm}
                aria-label="Add new item"
              >
                <FaPlus size={18} />
                <span className="hidden sm:inline">Add Chapter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-1 mt-2 border-r border-dashed border-black/10 dark:border-white/10">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex gap-3 items-center p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800/30 transition-colors group"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full border border-primary group-hover:bg-primary group-hover:text-white font-medium">
                {index + 1}
              </div>
              <Link
                href={`${pathname}/${chapter.id}`}
                onClick={() =>
                  handleChapterClick(subject, chapter.name, chapter.id)
                }
                className="text-base font-medium flex-grow capitalize"
              >
                {chapter.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Empty States */}
      {loading && (
        <div className="p-8 flex justify-center">
          <Spinner />
        </div>
      )}
      {!navigator.onLine && chapters.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaWifi size={24} className="mx-auto mb-2" />
          <p>
            You are offline. Please connect to the internet to view chapters.
          </p>
        </div>
      )}
      {navigator.onLine && !loading && chapters.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaBookOpen size={24} className="mx-auto mb-2" />
          <p>No chapters available. Add a new chapter to get started.</p>
        </div>
      )}
    </div>
  );
}
