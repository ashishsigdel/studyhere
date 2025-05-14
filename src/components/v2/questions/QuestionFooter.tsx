"use client";
import Image from "next/image";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import { MdVerified } from "react-icons/md";
import { RiSparklingFill } from "react-icons/ri";
import moment from "moment";
import { AiFillLike, AiOutlineEye, AiOutlineLike } from "react-icons/ai";
import { myAxios } from "@/services/apiServices";
import toast from "react-hot-toast";
import { useState } from "react";
import { HoverButton } from "@/components/utils/Buttons";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { formatNumbers } from "@/utils/formatNumber";

type Props = {
  user: {
    id: number;
    fullName: string;
    profilePic: string;
    role: string;
    deletedAt: Date;
  };
  createdAt: Date;
  totalLikes: number;
  totalViews: number;
  isLiked: boolean;
  answerId: number;
  questionId?: number;
  handleClickOpenSidebar?: Function;
  otherAnswersCount?: number;
};

export default function QuestionFooter({
  user,
  createdAt,
  totalLikes,
  totalViews,
  isLiked,
  answerId,
  questionId,
  handleClickOpenSidebar,
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
    <div>
      <div className="h-16 border-l border-b pl-5 border-10 rounded-bl-xl w-4 min-[400px]:w-8" />

      <div className="flex flex-row items-center justify-between gap-3  ml-6 min-[400px]:ml-10 -mt-4">
        {/* Author Info */}
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Image
            src={user.deletedAt ? defaultPic : user.profilePic || defaultPic}
            alt="Profile"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
          />

          <div className="mb-2">
            <span className="bg-primary text-white font-medium text-xs px-2 py-0.5 rounded-full inline-block mb-1">
              Answered By
            </span>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-xs sm:text-sm truncate">
                {user.fullName}
              </span>
              {user.role === "admin" && (
                <MdVerified className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              )}
              {user.role === "ai" && (
                <RiSparklingFill className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 animate-pulse" />
              )}
            </div>

            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {moment(createdAt).fromNow()}
            </span>
          </div>
        </div>
        <div className="flex justify-end flex-wrap ml-10 gap-0.5">
          <div className="flex gap-0.5">
            <button
              onClick={() => toggleLike(answerId)}
              className={`flex items-center gap-2 bg-[#e4e4e4] dark:bg-[#464646] px-3 py-2 rounded-l-lg hover:text-blue-500 transition-colors`}
            >
              {liked ? (
                <AiFillLike className="w-4.5 h-4.5" />
              ) : (
                <AiOutlineLike className="w-4.5 h-4.5" />
              )}

              <span className="text-sm">{formatNumbers(likesCount)}</span>
            </button>

            <div className="flex items-center gap-2 bg-white-light-variant dark:bg-dark-light-variant px-3 py-2 rounded-r-lg transition-colors">
              <AiOutlineEye className="w-4.5 h-4.5" />
              <span className="text-sm">{formatNumbers(totalViews)}</span>
            </div>
          </div>
          {handleClickOpenSidebar && (
            <div className="flex items-center gap-1 text-sm ml-3">
              <HoverButton
                onClick={() => handleClickOpenSidebar(questionId)}
                Icon={<LuSquareArrowOutUpRight />}
                direction="top"
                hoverText={`See All ${
                  otherAnswersCount && otherAnswersCount > 0
                    ? otherAnswersCount
                    : ""
                } Answers`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
