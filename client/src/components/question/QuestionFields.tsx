import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/utils/Spinner";
import { FaEdit, FaPlus, FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import { JoditForm } from "../utils";
import Image from "next/image";
import defaultPic from "@/assets/pictures/defaultpic.jpg";

type Props = {
  questions: {
    id: number;
    question: string;
    answer?: string;
    year?: string;
    marks?: string;
  }[];
  fetchMoreQuestions: any;
  page: number;
  totalPages: number;
  loading: boolean;
  handleDoubleClick: Function;
  toggleAnswer: Function;
  openedAnswerIds: number[];
  loadingAnswer: boolean;
  answers: any;
};

export default function QuestionFields({
  questions,
  fetchMoreQuestions,
  page,
  totalPages,
  loading,
  handleDoubleClick,
  toggleAnswer,
  openedAnswerIds,
  loadingAnswer,
  answers,
}: Props) {
  const [userL, setUserL] = useState<any>({});
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);

  const [openEditor, setOpenEditor] = useState(false);
  const handleAnswerEdit = async (id: number) => {
    if (answers[id]?.user?.id === userL.id) {
      setAnswer(answers[id]?.answer);
    }
    setOpenEditor(true);
  };

  const saveAnswer = async (type: string, id: number) => {
    setSaving(true);
    try {
      if (type === "add") {
        await myAxios.post(`/answer/add/${id}`, {
          answer,
        });
        setOpenEditor(false);
        toast.success("Refresh page to see changes.");
      } else {
        await myAxios.put(`/answer/update/${id}`, {
          answer,
        });
        setOpenEditor(false);
        toast.success("Refresh page to see changes.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const userlogged = localStorage.getItem("user");
    if (userlogged) {
      setUserL(JSON.parse(userlogged));
    }
  }, []);
  return (
    <InfiniteScroll
      dataLength={questions.length}
      next={fetchMoreQuestions}
      hasMore={page < totalPages}
      loader={<Spinner color="#222" />}
    >
      {questions.length === 0 && !loading && (
        <p className="my-10">No questions available.</p>
      )}

      {questions.map((question, index) => (
        <div
          key={question.id}
          onDoubleClick={() => handleDoubleClick(question)}
          className="flex flex-col gap-1 mt-2 border-b border-gray-200 dark:border-gray-700 p-3 "
        >
          <div className="flex items-start gap-2">
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
          </div>

          <div className="w-full flex justify-end text-sm text-gray-600 dark:text-gray-300 gap-4">
            {question?.year && <span>[{question.year}]</span>}
            {question?.marks && <span>[{question.marks} marks]</span>}
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openedAnswerIds.includes(question.id)
                ? "max-h-fit opacity-100 overflow-y-scroll pb-10"
                : "max-h-0 opacity-0 pb-0"
            }`}
          >
            <div className="mt-2 p-3 ">
              <div className="flex justify-between gap-3 items-center">
                <strong>Answer:</strong>
                {openEditor ? (
                  <div
                    onClick={() =>
                      saveAnswer(
                        answers[question.id] &&
                          answers[question.id]?.user?.id === userL.id
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
                ) : answers[question.id] &&
                  answers[question.id].user.id === userL?.id ? (
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
              {openEditor ? (
                <div className="mt-3">
                  <JoditForm
                    text={answer}
                    setText={setAnswer}
                    placeholder={"Enter answer"}
                  />
                </div>
              ) : loadingAnswer ? (
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
                        answers[question.id]?.answer || "No answer available.",
                    }}
                  />
                  {answers[question.id]?.answer &&
                    answers[question.id]?.user.id !== userL.id && (
                      <div className="flex items-center my-3 gap-3">
                        <Image
                          src={
                            answers[question.id]?.user?.profilePic
                              ? answers[question.id]?.user?.profilePic
                              : defaultPic
                          }
                          alt="profilePic"
                          width={40}
                          height={40}
                          className="w-8 h-8 rounded-full"
                        />
                        {answers[question.id]?.user?.fullName}
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="mx-3 mt-5 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md w-fit cursor-pointer">
              See Other&apos;s Answer
            </div>
          </div>
        </div>
      ))}
    </InfiniteScroll>
  );
}

{
}
