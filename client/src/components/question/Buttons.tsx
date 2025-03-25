import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { RiAiGenerate2 } from "react-icons/ri";

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
  handleAnswerEdit: any;
};

export default function Buttons({
  openEditors,
  question,
  saveAnswer,
  answers,
  userL,
  saving,
  handleCancel,
  generateAnswer,
  generatingAnswer,
  handleAnswerEdit,
}: Props) {
  const isAuthor = answers[question.id]?.answer?.user?.id === userL?.id;
  const isAdmin = userL.role === "admin";

  return (
    <>
      {openEditors[question.id] ? (
        <div className="flex gap-2">
          <button
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
          </button>
          <button
            onClick={() => handleCancel(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-red-200 dark:bg-red-900 px-2 py-1.5 rounded-md text-sm"
          >
            <FaTimes className="" size={16} />
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => generateAnswer(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
          >
            <RiAiGenerate2 size={16} />
            {generatingAnswer ? "Generating..." : "Generate With AI"}
          </button>
          {!isAuthor && (
            <button
              onClick={() => handleAnswerEdit(question.id)}
              className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
            >
              <FaPlus size={16} />
              Add
            </button>
          )}

          {(isAuthor || isAdmin) && (
            <button
              onClick={() => handleAnswerEdit(question.id)}
              className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
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
