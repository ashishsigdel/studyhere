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
  return (
    <>
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
      ) : userL.role === "admin" ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => generateAnswer(question.id)}
            className="mx-3 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md w-fit cursor-pointer flex items-center gap-2"
          >
            <RiAiGenerate2 />
            {generatingAnswer ? "Generating..." : "Generate With AI"}
          </button>
          <div
            onClick={() => handleAnswerEdit(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
          >
            <FaEdit className="" size={16} />
            Edit
          </div>
          <div
            onClick={() => handleAnswerEdit(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
          >
            <FaPlus className="" size={16} />
            Add
          </div>
        </div>
      ) : answers[question.id]?.answer?.user?.id === userL?.id ? (
        <div className="flex items-center">
          <button
            onClick={() => generateAnswer(question.id)}
            className="mx-3 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md w-fit cursor-pointer flex items-center gap-2"
          >
            <RiAiGenerate2 />
            {generatingAnswer ? "Generating..." : "Generate With AI"}
          </button>
          <div
            onClick={() => handleAnswerEdit(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
          >
            <FaEdit className="" size={16} />
            Edit
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <button
            onClick={() => generateAnswer(question.id)}
            className="mx-3 px-3 py-2 text-sm bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md w-fit cursor-pointer flex items-center gap-2"
          >
            <RiAiGenerate2 />
            {generatingAnswer ? "Generating..." : "Generate With AI"}
          </button>
          <div
            onClick={() => handleAnswerEdit(question.id)}
            className="flex gap-2 items-center cursor-pointer bg-gray-300 dark:bg-gray-800 px-2 py-1.5 rounded-md text-sm"
          >
            <FaPlus className="" size={16} />
            Add
          </div>
        </div>
      )}
    </>
  );
}
