import React from "react";
import { JoditForm } from "@/components/utils";
import Spinner from "@/utils/Spinner";

type Props = {
  switchForm: any;
  modelFormChoose: "question" | "answer";
  newQuestion: any;
  setNewQuestion: any;
  setShowForm: any;
  handleSaveQuestion: any;
  loadingAdd: boolean;
};

export default function AddModal({
  modelFormChoose,
  newQuestion,
  setNewQuestion,
  setShowForm,
  handleSaveQuestion,
  loadingAdd,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 overflow-y-scroll z-[999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-gray-300 dark:border-gray-600">
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-xl">Add Question</h2>
        </div>

        {modelFormChoose === "question" && (
          <JoditForm
            text={newQuestion.question}
            setText={(newContent: string) =>
              setNewQuestion({ ...newQuestion, question: newContent })
            }
            placeholder="Enter new question"
          />
        )}

        {modelFormChoose === "answer" && (
          <JoditForm
            text={newQuestion.answer}
            setText={(newContent: string) =>
              setNewQuestion({ ...newQuestion, answer: newContent })
            }
            placeholder={"Enter answer"}
          />
        )}

        <input
          type="text"
          value={newQuestion.year}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, year: e.target.value })
          }
          className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-2"
          placeholder="Year"
        />
        <input
          type="text"
          value={newQuestion.marks}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, marks: e.target.value })
          }
          className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-2"
          placeholder="Marks"
        />
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveQuestion}
            disabled={loadingAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loadingAdd ? <Spinner /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
