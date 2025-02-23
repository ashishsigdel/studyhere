"use client";
import React, { useEffect, useState } from "react";
import useQuestionPage from "./useQuestionPage";
import Image from "next/image";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import moment from "moment";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";

export default function Question() {
  const { question, answers, loading, setAnswers } = useQuestionPage();

  const onLike = async (id: number) => {
    try {
      const response = await myAxios.put(`/answer/like/${id}`, {});
      setAnswers((prevAnswers: any) =>
        prevAnswers.map((answer: any) =>
          answer.id === id
            ? {
                ...answer,
                totalLikes: response.data.data.totalLikes,
                isLiked: !answer.isLiked,
              }
            : answer
        )
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

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
      <div className="mt-2 p-3 ">
        {answers &&
          answers.length > 0 &&
          answers.map((answer: any, index) => (
            <div
              key={answer.id}
              className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal border-b border-gray-300 dark:border-gray-700 py-5"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: answer?.answer || "No answer available.",
                }}
              />
              {answer?.answer && (
                <div className="mt-10 flex items-center justify-between">
                  <div className="flex items-center my-3 gap-3">
                    <Image
                      src={
                        answer?.user?.profilePic
                          ? answer?.user?.profilePic
                          : defaultPic
                      }
                      alt="profilePic"
                      width={20}
                      height={20}
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold mr-1 text-xs truncate">
                        {answer?.user?.fullName || "Anonymous User"}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {moment(answer.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                    <button
                      type="button"
                      onClick={() => onLike(answer.id)}
                      className={`text-gray-400 hover:text-blue-500 ${
                        answer.isLiked && "!text-blue-500"
                      }`}
                    >
                      <FaThumbsUp className="text-sm" />
                    </button>
                    <p className="text-gray-400">
                      {answer.totalLikes}{" "}
                      {answer.totalLikes > 1 ? "likes" : "like"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
