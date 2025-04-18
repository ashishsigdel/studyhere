import Image from "next/image";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import { JoditForm } from "../utils";
import moment from "moment";
import Buttons from "./Buttons";
import { MdVerified } from "react-icons/md";

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
  handleOpenModel: Function;
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
  handleAnswerAdd: Function;
  handleAnswerEdit: Function;
  setAnswerStates: any;
  generateAnswer: Function;
  generatingAnswer: boolean;
};

export default function QuestionCard({
  question,
  handleDoubleClick,
  handleOpenModel,
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
  handleAnswerAdd,
  handleAnswerEdit,
  setAnswerStates,
  generateAnswer,
  generatingAnswer,
}: Props) {
  const cleanHTML = answers[question.id]?.answer?.answer?.replace(
    /<annotation[^>]*>.*?<\/annotation>/gs,
    ""
  );
  return (
    <div
      key={question.id}
      className="flex flex-col gap-1 mt-2 border-b border-gray-200 dark:border-gray-700 p-3 group"
    >
      <div className="flex items-start gap-2">
        <span
          onDoubleClick={() => handleDoubleClick(question)}
          className="font-medium text-gray-600 dark:text-gray-300"
        >
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
        <div className="relative inline-block">
          <div
            onClick={() => handleOpenModel(question)}
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
            ? "max-h-fit opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 pb-0"
        }`}
      >
        <div className="mt-2 p-3">
          <div className="flex justify-between gap-3 items-center">
            <strong>Answer:</strong>
            <Buttons
              openEditors={openEditors}
              question={question}
              saveAnswer={saveAnswer}
              answers={answers}
              userL={userL}
              saving={saving}
              handleCancel={handleCancel}
              generateAnswer={generateAnswer}
              generatingAnswer={generatingAnswer}
              handleAnswerAdd={handleAnswerAdd}
              handleAnswerEdit={handleAnswerEdit}
            />
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
            <div className="animate-pulse space-y-2 mt-10">
              <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-2/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-full"></div>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal mt-2.5">
              <div
                dangerouslySetInnerHTML={{
                  __html: cleanHTML || "No answer available.",
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
                      <span className="font-bold text-xs flex items-center gap-2 truncate">
                        {answers[question.id]?.answer?.user?.fullName}

                        {answers[question.id]?.answer?.user?.role ===
                          "admin" && (
                          <div className="relative group">
                            <MdVerified className="w-3.5 h-3.5 text-green-500 cursor-pointer" />
                          </div>
                        )}
                      </span>
                      <span className="text-gray-600 dark:text-gray-200 text-xs">
                        {moment(
                          answers[question.id]?.answer.createdAt
                        ).fromNow()}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/question/${question.id}`}
                    className="mx-3 px-3 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md w-fit cursor-pointer"
                  >
                    {`View all answer (${
                      answers[question.id]?.otherAnswersCount
                    })`}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
