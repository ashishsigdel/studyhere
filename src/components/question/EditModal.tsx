import React from "react";
import JoditForm from "@/components/JoditForm";
import Spinner from "@/utils/Spinner";

type Props = {
  switchForm: any;
  modelFormChoose: "question" | "answer";
  editQuestion: any;
  setEditQuestion: any;
  setShowModal: any;
  handleSaveEdit: any;
  loadingEdit: boolean;
};

export default function EditModal({
  switchForm,
  modelFormChoose,
  editQuestion,
  setEditQuestion,
  setShowModal,
  handleSaveEdit,
  loadingEdit,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3">
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-xl">Edit Question</h2>
          <span
            className="p-2 rounded-md cursor-pointer border"
            onClick={switchForm}
          >
            Write {modelFormChoose === "answer" ? "Question" : "Answer"}
          </span>
        </div>
        {modelFormChoose === "question" && (
          <JoditForm
            text={editQuestion.question}
            setText={(newContent: string) =>
              setEditQuestion({ ...editQuestion, question: newContent })
            }
          />
        )}

        {modelFormChoose === "answer" && (
          <>
            <div
              className="prose dark:prose-invert max-w-none table-auto mb-2"
              dangerouslySetInnerHTML={{
                __html: editQuestion.question,
              }}
            />
            <p className="mt-1 text-sm italic   ">Answer:</p>
            <JoditForm
              text={editQuestion.answer}
              setText={(newContent: string) =>
                setEditQuestion({ ...editQuestion, answer: newContent })
              }
            />
          </>
        )}

        {modelFormChoose === "question" && (
          <>
            <input
              type="text"
              value={editQuestion.year || ""}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, year: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Year"
            />
            <input
              type="text"
              value={editQuestion.marks || ""}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, marks: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Marks"
            />
          </>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={loadingEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loadingEdit ? <Spinner /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
