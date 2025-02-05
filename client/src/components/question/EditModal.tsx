import React from "react";
import { JoditForm } from "@/components/utils";
import Spinner from "@/utils/Spinner";
import { MdClose } from "react-icons/md";

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
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center px-3">
      <div className="bg-gray-300 dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <div className="flex gap-2 items-center mb-4 justify-between">
          <h2 className="text-xl">Edit Question</h2>
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 hover:scale-105 text-white rounded-md"
          >
            <MdClose />
          </button>
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
              className="prose dark:prose-invert max-w-none table-auto mb-2 text-xs"
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
              className="w-full p-2 border border-black/10 dark:border-white/20 rounded-md mb-2"
              placeholder="Year"
            />
            <input
              type="text"
              value={editQuestion.marks || ""}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, marks: e.target.value })
              }
              className="w-full p-2 border border-black/10 dark:border-white/20 rounded-md mb-2"
              placeholder="Marks"
            />
          </>
        )}
        <div className="flex justify-between gap-4 mt-5">
          <button
            onClick={handleSaveEdit}
            disabled={true}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            {loadingEdit ? <Spinner /> : "Delete"}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveEdit}
              disabled={loadingEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {loadingEdit ? <Spinner /> : "Save"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
