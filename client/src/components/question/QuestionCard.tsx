import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaEdit, FaPlus, FaSave, FaThumbsUp, FaTimes } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import { JoditForm } from "../utils";
import moment from "moment";

type Props = {
  question: {
    id: number;
    question: string;
    answer?: string;
    year?: string;
    marks?: string;
  };
  index: number;
  handleDoubleClick: Function;
  toggleAnswer: Function;
  openedAnswerIds: number[];
  openEditors: { [key: number]: boolean };
  answers: any;
  loadingAnswer: boolean;
  userL: any;
  answerStates: { [key: number]: string };
  saveAnswer: (type: string, id: number) => void;
  saving: boolean;
  handleCancel: (id: number) => void;
  handleAnswerEdit: any;
  setAnswerStates: any;
};

export default function QuestionCard({
  question,
  handleDoubleClick,
  index,
  toggleAnswer,
  openedAnswerIds,
  openEditors,
  answers,
  loadingAnswer,
  userL,
  answerStates,
  saveAnswer,
  saving,
  handleCancel,
  handleAnswerEdit,
  setAnswerStates,
}: Props) {
  return (
    <div
      key={question.id}
      // onDoubleClick={() => handleDoubleClick(question)}
      className="flex flex-col gap-1 mt-2 border-b border-gray-200 dark:border-gray-700 p-3 group"
    >
      <div className="flex items-start gap-2 group">
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {index + 1}.
        </span>
        <div
          className="w-full cursor-pointer"
          onClick={() => toggleAnswer(question.id)}
        >
          <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal">
            <div dangerouslySetInnerHTML={{ __html: question.question }} />
          </div>
        </div>
        <div className="relative inline-block lg:hidden group-hover:inline-block">
          <div
            onClick={() => handleDoubleClick(question)}
            className="p-1 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-full cursor-pointer "
          >
            <HiDotsVertical />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end text-sm text-gray-600 dark:text-gray-300 gap-4">
        {question?.year && <span>[{question.year}]</span>}
        {question?.marks && <span>[{question.marks} marks]</span>}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          openedAnswerIds.includes(question.id)
            ? "max-h-fit opacity-100 overflow-y-scroll"
            : "max-h-0 opacity-0 pb-0"
        }`}
      >
        <div className="mt-2 p-3">
          <div className="flex justify-between gap-3 items-center">
            <strong>Answer:</strong>
            {openEditors[question.id] ? (
              <div className="flex gap-2">
                <div
                  onClick={() =>
                    saveAnswer(
                      answers[question.id]?.answer?.user?.id === userL?.id
                        ? "update"
                        : "add",
                      question.id
                    )
                  }
                  className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
                >
                  <FaSave className="" size={16} />
                  {saving ? "Saving" : "Save"}
                </div>
                <div
                  onClick={() => handleCancel(question.id)}
                  className="flex gap-2 items-center cursor-pointer bg-red-200 dark:bg-red-900 px-2 py-1.5 rounded-md text-sm"
                >
                  <FaTimes className="" size={16} />
                  Cancel
                </div>
              </div>
            ) : answers[question.id]?.answer?.user?.id === userL?.id ? (
              <div
                onClick={() => handleAnswerEdit(question.id)}
                className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
              >
                <FaEdit className="" size={16} />
                Edit
              </div>
            ) : (
              <div
                onClick={() => handleAnswerEdit(question.id)}
                className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
              >
                <FaPlus className="" size={16} />
                Add
              </div>
            )}
          </div>
          {openEditors[question.id] ? (
            <div className="mt-3">
              <JoditForm
                text={answerStates[question.id] || ""}
                setText={(text: string) =>
                  setAnswerStates((prev: any) => ({
                    ...prev,
                    [question.id]: text,
                  }))
                }
                placeholder={"Enter answer"}
              />
            </div>
          ) : loadingAnswer && !answers[question.id] ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    answers[question.id]?.answer?.answer ||
                    "No answer available.",
                }}
              />
              {answers[question.id]?.answer?.answer && (
                <div className="mt-10 flex items-center justify-between">
                  <div className="flex items-center my-3 gap-3">
                    <Image
                      src={
                        answers[question.id]?.answer?.user?.profilePic
                          ? answers[question.id]?.answer?.user?.profilePic
                          : defaultPic
                      }
                      alt="profilePic"
                      width={20}
                      height={20}
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold mr-1 text-xs truncate">
                        {answers[question.id]?.answer?.user?.fullName}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {moment(
                          answers[question.id]?.answer.createdAt
                        ).fromNow()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      href={`/question/${question.id}`}
                      className="mx-3 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md w-fit cursor-pointer"
                    >
                      {answers[question.id]?.otherAnswersCount == 0
                        ? "View all answer"
                        : `${
                            answers[question.id]?.otherAnswersCount
                          } more answer
                      avaiable`}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
