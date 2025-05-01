import { HiDotsVertical } from "react-icons/hi";
import { JoditForm } from "../utils";
import Buttons from "./Buttons";
import UserFooter from "./UserFooter";
import NoData from "../utils/NoData";

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
      className="flex flex-col gap-1 mt-2 border-b border-black/10 dark:border-white/10 p-3 group"
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
        {question?.marks && question.marks.startsWith("[") ? (
          <span>{question.marks} marks</span>
        ) : (
          <span>[{question.marks} marks]</span>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          openedAnswerIds.includes(question.id)
            ? "max-h-fit opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 pb-0"
        }`}
      >
        <div className="mt-2">
          <div className="flex justify-between gap-3 items-center">
            <strong>Answer:</strong>

            {(openEditors[question.id] || cleanHTML) && (
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
            )}
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
                className="border-l pl-5 md:pl-8 border-black/25 dark:border-white/20"
                dangerouslySetInnerHTML={{
                  __html: cleanHTML,
                }}
              />
              {!cleanHTML && (
                <NoData
                  title="No Answers Yet"
                  description="Be the first to share your thoughts, or try generating an answer with AI."
                  button={
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
                  }
                />
              )}

              {answers[question.id]?.answer?.answer && (
                <UserFooter
                  user={answers[question.id]?.answer?.user}
                  createdAt={answers[question.id]?.answer.createdAt}
                  totalLikes={answers[question.id]?.answer.TotalLikes}
                  isLiked={answers[question.id]?.answer.isLiked}
                  answerId={answers[question.id]?.answer.id}
                  questionId={question.id}
                  nextButton
                  otherAnswersCount={answers[question.id]?.otherAnswersCount}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
