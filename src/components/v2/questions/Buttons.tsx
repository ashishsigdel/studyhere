"use client";
import { User } from "@/types/user";
import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { RiAiGenerate2 } from "react-icons/ri";
import { useEffect, useState } from "react";

type Props = {
  openEditors: { [key: number]: boolean };
  question: {
    id: number;
    question: string;
    answer?: string;
    year?: string;
    marks?: string;
  };
  saveAnswer: (type: string, id: number) => void;
  answers: any;
  userL: any;
  saving: boolean;
  handleCancel: (id: number) => void;
  generateAnswer: Function;
  generatingAnswer: boolean;
  handleAnswerAdd: Function;
  handleAnswerEdit: Function;
};

export default function Buttons({
  openEditors,
  question,
  saveAnswer,
  answers,
  saving,
  handleCancel,
  generateAnswer,
  generatingAnswer,
  handleAnswerEdit,
  handleAnswerAdd,
}: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
  }, []);
  const isAdmin = user?.role === "admin";
  const isAuthor = answers[question.id]?.answer?.user?.id === user?.id;

  return (
    <>
      {openEditors[question.id] ? (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              saveAnswer(
                answers[question.id]?.answer?.user?.id === user?.id
                  ? "update"
                  : "add",
                question.id
              )
            }
            className="flex gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
            disabled={saving}
          >
            <FaSave size={16} />
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => handleCancel(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-red-200 dark:bg-red-900 px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
          >
            <FaTimes size={16} />
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => generateAnswer(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
            disabled={generatingAnswer}
          >
            <RiAiGenerate2 size={16} />
            {generatingAnswer ? "Generating..." : "AI Generate"}
          </button>
          {!isAuthor && (
            <button
              onClick={() => handleAnswerAdd(question.id)}
              className="flex gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
            >
              <FaPlus size={16} />
              Add Answer
            </button>
          )}

          {(isAuthor || isAdmin) && (
            <button
              onClick={() => handleAnswerEdit(question.id)}
              className="flex gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
            >
              <FaEdit size={16} />
              Edit
            </button>
          )}
        </div>
      )}
    </>
  );
}
