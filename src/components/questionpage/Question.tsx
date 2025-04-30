"use client";
import React, { useEffect, useState } from "react";
import useQuestionPage from "./useQuestionPage";
import UserFooter from "../question/UserFooter";

export default function Question() {
  const { question, answers, loading, setAnswers } = useQuestionPage();

  if (loading) {
    return (
      <div className="animate-pulse space-y-2 mt-10 container">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }
  return (
    <div>
      <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal text-xl font-semibold px-2 pt-5 pb-2 border-b border-gray-300 dark:border-gray-700">
        <div dangerouslySetInnerHTML={{ __html: question?.question }} />
        <div className="w-full flex justify-end text-sm text-gray-600 dark:text-gray-300 gap-4">
          {question?.year && <span>[{question.year}]</span>}
          {question?.marks && <span>[{question.marks} marks]</span>}
        </div>
      </div>
      <div className="mt-2 p-3 space-y-6">
        {answers &&
          answers.length > 0 &&
          answers.map((answer: any, index) => (
            <div key={answer.id} className="relative">
              {/* Answer separator - only show between answers */}
              {index > 0 && (
                <div className="flex items-center mb-10">
                  <div className="flex-grow border-t border-dashed border-gray-300 dark:border-gray-700"></div>
                  <div className="px-4 text-xs text-gray-500 dark:text-gray-400">
                    Answer {index + 1}
                  </div>
                  <div className="flex-grow border-t border-dashed border-gray-300 dark:border-gray-700"></div>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal mt-2.5">
                <div
                  className="border-l pl-5 md:pl-8 border-black/25 dark:border-white/20"
                  dangerouslySetInnerHTML={{
                    __html: answer?.answer || "No answer available.",
                  }}
                />
                {answer?.answer && (
                  <UserFooter
                    user={answer.user}
                    createdAt={answer.createdAt}
                    totalLikes={answer.TotalLikes}
                    isLiked={answer.isLiked}
                    answerId={answer.id}
                    nextButton={false}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
