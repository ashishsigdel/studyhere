"use client";
import { HtmlRenderer } from "@/components/utils";
import NoData from "@/components/utils/NoData";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { AiFillFlag } from "react-icons/ai";
import { HiDotsVertical } from "react-icons/hi";

export default function FlagQuestions() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement }>({});

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeDropdown !== null) {
        const dropdownElement = dropdownRefs.current[activeDropdown];
        if (
          dropdownElement &&
          !dropdownElement.contains(event.target as Node)
        ) {
          setActiveDropdown(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (questionId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === questionId ? null : questionId);
  };

  const handleToggleFlag = async (questionId: number) => {
    try {
      // TODO: Implement the API call to toggle flag
      console.log("Toggling flag for question:", questionId);
      // After successful API call, you might want to refresh the questions list
    } catch (error) {
      console.error("Error toggling flag:", error);
    }
  };

  const questions: any[] = [
    // {
    //   id: 1,
    //   question: "What is Artificial intelligence?",
    //   subject: {
    //     id: 1,
    //     name: "Artificial Intelligence",
    //     slug: "artificial-intelligence",
    //   },
    //   chapter: {
    //     id: 1,
    //     name: "Introduction to AI",
    //   },
    //   totalAnswerAvailable: 5,
    // },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6 mx-auto max-w-7xl">
      <div className="rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <AiFillFlag className="text-primary" />
              Flagged Questions
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {questions && questions.length > 0 ? (
              questions.map((question, index) => (
                <div
                  key={index}
                  className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 rounded-lg -mx-4 px-4"
                >
                  <div className="flex items-start justify-between py-6">
                    <Link
                      href={`/subject/${question.subject.slug}/${question.chapter.id}`}
                      className="flex items-start gap-4 flex-1"
                    >
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <HtmlRenderer content={question.question} />
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {question.subject.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {question.chapter.name}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-primary">
                              {question.totalAnswerAvailable}
                            </span>
                            answers available
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="inline-block relative">
                      <div
                        onClick={(e) => toggleDropdown(question.id, e)}
                        className="p-1.5 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-full cursor-pointer transition-colors duration-200"
                      >
                        <HiDotsVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      {/* Dropdown Menu */}
                      {activeDropdown === question.id && (
                        <div
                          ref={(el: HTMLDivElement | null) => {
                            if (el) dropdownRefs.current[question.id] = el;
                          }}
                          className="absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden z-[9999]"
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={(e) => {
                              handleToggleFlag(question.id);
                              toggleDropdown(question.id, e);
                            }}
                          >
                            Unmark as Flag
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoData
                title="No flagged questions"
                description="You haven't flagged any questions yet."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
