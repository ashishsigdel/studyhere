import React from "react";
import { MdClose } from "react-icons/md";

type Props = {
  allChapters: {
    id: number;
    name: string;
  }[];
  handleToggleChapter: (id: number, cancel?: boolean) => void;
};

export default function ChapterModal({
  allChapters,
  handleToggleChapter,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-gray-300 dark:border-gray-600 ">
        <div className="flex gap-2 items-center mb-4 justify-between">
          <h2 className="text-xl">Select Chapter</h2>
          <button
            onClick={() => handleToggleChapter(0, true)}
            className="px-4 py-2 hover:scale-105 text-white rounded-md"
          >
            <MdClose />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {allChapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => {
                handleToggleChapter(chapter.id);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 group transition-colors duration-150 rounded-md"
            >
              <span className="text-gray-500 dark:text-gray-400 text-sm ">
                {index + 1}.
              </span>

              <div className="flex-1 flex items-center justify-between overflow-hidden">
                <div className="truncate">
                  <span className="text-md font-medium text-gray-700 dark:text-gray-200 capitalize">
                    {chapter.name}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
