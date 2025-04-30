"use client";
import Image from "next/image";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import { MdVerified } from "react-icons/md";
import { RiSparklingFill } from "react-icons/ri";
import moment from "moment";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import Link from "next/link";
import { myAxios } from "@/services/apiServices";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  image: string;
  fullName: string;
  role: string;
  createdAt: string;
  totalLikes: number;
  isLiked: boolean;
  answerId: number;
  questionId?: number;
  nextButton?: boolean;
  otherAnswersCount?: number;
};

export default function UserFooter({
  image,
  fullName,
  role,
  createdAt,
  totalLikes,
  isLiked,
  answerId,
  questionId,
  nextButton,
  otherAnswersCount,
}: Props) {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(totalLikes);

  const toggleLike = async (id: number) => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => prev + (liked ? -1 : 1));

    try {
      await myAxios.put(`answer/like/${id}`);
    } catch (error: any) {
      setLiked((prev) => !prev);
      setLikesCount((prev) => prev + (liked ? 1 : -1));
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="relative">
      <div className="h-20 border-l border-b pl-5 border-black/25 dark:border-white/20 rounded-bl-2xl w-10 " />

      <div className="flex flex-col min-[580px]:flex-row items-start justify-between gap-4 ml-14 relative -top-5">
        {/* Author Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Avatar with subtle shadow */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full shadow-sm ring-1 ring-gray-200/10 dark:ring-gray-700/50" />
            <Image
              src={image ? image : defaultPic}
              alt="profilePic"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 object-cover relative"
            />
          </div>

          {/* Metadata */}
          <div className="flex flex-col min-w-0">
            <span className="bg-gradient-to-r from-primary to-primary/50 text-white text-[11px] px-2 py-1 rounded-full w-fit mb-1.5 transform transition-all hover:scale-[1.02] active:scale-95 cursor-default">
              Answered By
            </span>

            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-sm flex items-center gap-1.5 truncate">
                {fullName}
                {role === "admin" ? (
                  <MdVerified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                ) : role === "ai" ? (
                  <RiSparklingFill className="w-4 h-4 text-purple-400 flex-shrink-0 animate-pulse" />
                ) : null}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3">
              <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                {moment(createdAt).fromNow()}
              </span>

              {/* Like button with improved interaction */}
              <button
                onClick={() => toggleLike(answerId)}
                className={`flex items-center gap-1 ${
                  liked ? "text-blue-500 dark:text-blue-400" : "text-gray-500"
                } hover:text-blue-500 dark:hover:text-blue-400 transition-colors group`}
              >
                <div className="p-1 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  {liked ? (
                    <AiFillLike className="w-3.5 h-3.5 scale-110 transition-transform" />
                  ) : (
                    <AiOutlineLike className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <span className="text-xs font-medium">{likesCount} Likes</span>
              </button>
            </div>
          </div>
        </div>

        {nextButton && (
          <Link
            href={`/question/${questionId}`}
            className="px-4 py-2 text-xs font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md active:shadow-sm whitespace-nowrap flex-shrink-0"
          >
            {`View all answers (${otherAnswersCount})`}
          </Link>
        )}
      </div>
    </div>
  );
}
