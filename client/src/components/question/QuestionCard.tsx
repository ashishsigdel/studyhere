import Image from "next/image";
import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import defaultPic from "@/assets/pictures/defaultpic.jpg";
import { JoditForm } from "../utils";
import moment from "moment";
import Buttons from "./Buttons";

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
  generateAnswer: Function;
  generatingAnswer: boolean;
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
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
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

                  <Link
                    href={`/question/${question.id}`}
                    className="mx-3 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md w-fit cursor-pointer"
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
