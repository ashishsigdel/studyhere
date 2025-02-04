import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/utils/Spinner";
import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import { JoditForm } from "../utils";
import Image from "next/image";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import Link from "next/link";

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
  const [answerStates, setAnswerStates] = useState<{ [key: number]: string }>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const [openEditors, setOpenEditors] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleAnswerEdit = async (id: number) => {
    // Clear any existing answer states first
    setAnswerStates((prev) => ({
      ...prev,
      [id]:
        answers[id]?.answer?.user?.id === userL?.id
          ? answers[id]?.answer?.answer
          : "",
    }));

    setOpenEditors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleCancel = (id: number) => {
    setOpenEditors((prev) => ({
      ...prev,
      [id]: false,
    }));

    // Clear the specific answer state
    setAnswerStates((prev) => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  };

  const saveAnswer = async (type: string, id: number) => {
    if (!answerStates[id]?.trim()) {
      toast.error("Answer cannot be empty!");
      return;
    }

    setSaving(true);
    try {
      if (type === "add") {
        await myAxios.post(`/answer/add/${id}`, { answer: answerStates[id] });
      } else {
        await myAxios.put(`/answer/update/${id}`, { answer: answerStates[id] });
      }
      toast.success("Answer saved successfully!");
      setOpenEditors((prev) => ({
        ...prev,
        [id]: false,
      }));
      setAnswerStates((prev) => {
        const newStates = { ...prev };
        delete newStates[id];
        return newStates;
      });
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
    return () => {
      setAnswerStates({});
      setOpenEditors({});
    };
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
          className="flex flex-col gap-1 mt-2 border-b border-gray-200 dark:border-gray-700 p-3"
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
                      setAnswerStates((prev) => ({
                        ...prev,
                        [question.id]: text,
                      }))
                    }
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
                        answers[question.id]?.answer?.answer ||
                        "No answer available.",
                    }}
                  />
                  {answers[question.id]?.answer?.answer &&
                    answers[question.id]?.answer?.user?.id !== userL?.id && (
                      <div className="flex items-center my-3 gap-3">
                        <Image
                          src={
                            answers[question.id]?.answer?.user?.profilePic
                              ? answers[question.id]?.answer?.user?.profilePic
                              : defaultPic
                          }
                          alt="profilePic"
                          width={40}
                          height={40}
                          className="w-8 h-8 rounded-full"
                        />
                        {answers[question.id]?.answer?.user?.fullName}
                      </div>
                    )}
                </div>
              )}
            </div>
            {answers[question.id]?.otherAnswersCount > 0 && (
              <div className="mt-5">
                <Link
                  href={`/question/${question.id}`}
                  className="mx-3 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md w-fit cursor-pointer"
                >
                  {answers[question.id]?.otherAnswersCount} more answer avaiable
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </InfiniteScroll>
  );
}
