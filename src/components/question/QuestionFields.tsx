import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/utils/Spinner";

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
  openedAnswer: number | null;
};

export default function QuestionFields({
  questions,
  fetchMoreQuestions,
  page,
  totalPages,
  loading,
  handleDoubleClick,
  toggleAnswer,
  openedAnswer,
}: Props) {
  return (
    <InfiniteScroll
      dataLength={questions.length}
      next={fetchMoreQuestions}
      hasMore={page < totalPages}
      loader={<Spinner color="#222" />}
    >
      {questions.length === 0 && !loading && <p>No questions available.</p>}

      {questions.map((question, index) => (
        <div
          key={question.id}
          onDoubleClick={() => handleDoubleClick(question)}
          className="flex flex-col gap-1 mt-2 border-b p-3 hover:bg-gray-200/40 dark:hover:bg-slate-900/40 overflow-x-scroll"
        >
          <div className="flex items-start gap-2">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {index + 1}.
            </span>
            <div
              className="w-full cursor-pointer"
              onClick={() => toggleAnswer(question.id)}
            >
              <div
                className="prose dark:prose-invert max-w-none table-auto"
                dangerouslySetInnerHTML={{ __html: question.question }}
              />
            </div>
          </div>
          <div className="w-full flex justify-end text-sm text-gray-600 dark:text-gray-300 gap-4">
            {question?.year && <span>[{question.year}]</span>}
            {question?.marks && <span>[{question.marks} marks]</span>}
          </div>
          {openedAnswer === question.id && (
            <div className="mt-2 p-3">
              <strong>Answer:</strong>{" "}
              <div
                className="prose dark:prose-invert max-w-none table-auto"
                dangerouslySetInnerHTML={{
                  __html: question.answer || "No answer available.",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </InfiniteScroll>
  );
}
