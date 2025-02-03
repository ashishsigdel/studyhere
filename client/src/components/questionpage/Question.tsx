"use client";
import React, { useEffect, useState } from "react";
import useQuestionPage from "./useQuestionPage";
import Image from "next/image";
import defaultPic from "@/assets/pictures/defaultpic.jpg";

export default function Question() {
  const { question, answers, loading } = useQuestionPage();
  const [userL, setUserL] = useState<any>({});

  useEffect(() => {
    const userlogged = localStorage.getItem("user");
    if (userlogged) {
      setUserL(JSON.parse(userlogged));
    }
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }
  return (
    <div>
      <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal text-xl font-semibold">
        <div dangerouslySetInnerHTML={{ __html: question?.question }} />
        <div className="w-full flex justify-end text-sm text-gray-600 dark:text-gray-300 gap-4">
          {question?.year && <span>[{question.year}]</span>}
          {question?.marks && <span>[{question.marks} marks]</span>}
        </div>
      </div>
      <div className="my-5">
        <div className="mt-2 p-3 ">
          {answers &&
            answers.length > 0 &&
            answers.map((answer: any) => (
              <div
                key={answer.id}
                className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal border-y border-gray-300 dark:border-gray-700 py-5"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: answer?.answer || "No answer available.",
                  }}
                />
                {answer?.answer && (
                  <div className="flex items-center my-3 mt-10 gap-3">
                    <Image
                      src={
                        answer?.user?.profilePic
                          ? answer?.user?.profilePic
                          : defaultPic
                      }
                      alt="profilePic"
                      width={40}
                      height={40}
                      className="w-8 h-8 rounded-full"
                    />
                    {answer?.user?.fullName}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
