import Image from "next/image";
import React from "react";
import { FaThumbsUp } from "react-icons/fa";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import moment from "moment";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import { MdVerified } from "react-icons/md";
import { RiSparklingFill } from "react-icons/ri";

type Props = {
  answer: any;
  setAnswers: any;
  showCount?: boolean;
};

export default function UserSection({
  answer,
  setAnswers,
  showCount = true,
}: Props) {
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
  return (
    <div className="mt-10 flex items-center justify-between">
      <div className="flex items-center my-3 gap-3">
        <Image
          src={answer?.user?.profilePic ? answer?.user?.profilePic : defaultPic}
          alt="profilePic"
          width={20}
          height={20}
          className="w-8 h-8 rounded-full bg-gray-200"
        />
        <div className="flex flex-col">
          <span className="font-bold text-xs flex items-center gap-2 truncate">
            {answer?.user?.fullName}

            {answer?.user?.role === "admin" ? (
              <div className="relative group">
                <MdVerified className="w-3.5 h-3.5 text-green-500 cursor-pointer" />
              </div>
            ) : answer?.user?.role === "ai" ? (
              <div className="relative group">
                <RiSparklingFill className="w-3.5 h-3.5 text-yellow-500 cursor-pointer" />
              </div>
            ) : null}
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
        {showCount && (
          <p className="text-gray-400 text-base">
            {answer.totalLikes} {answer.totalLikes > 1 ? "likes" : "like"}
          </p>
        )}
      </div>
    </div>
  );
}
