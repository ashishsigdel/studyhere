import React from "react";
import { JoditForm } from "@/components/utils";
import Spinner from "@/utils/Spinner";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import { FaSpinner } from "react-icons/fa";

type Props = {
  editQuestion: any;
  setEditQuestion: any;
  setShowModal: any;
  handleSaveEdit: any;
  loadingEdit: boolean;
  fetchQuestions: Function;
};

export default function EditModal({
  editQuestion,
  setEditQuestion,
  setShowModal,
  handleSaveEdit,
  loadingEdit,
  fetchQuestions,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center px-3 z-[999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-gray-300 dark:border-gray-600 ">
        <div className="flex gap-2 items-center mb-4 justify-between">
          <h2 className="text-xl">Edit Question</h2>
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 hover:scale-105 text-white rounded-md"
          >
            <MdClose />
          </button>
        </div>

        <JoditForm
          text={editQuestion.question}
          setText={(newContent: string) =>
            setEditQuestion({ ...editQuestion, question: newContent })
          }
        />

        <>
          <input
            type="text"
            value={editQuestion.year || ""}
            onChange={(e) =>
              setEditQuestion({ ...editQuestion, year: e.target.value })
            }
            className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-2"
            placeholder="Year"
          />
          <input
            type="text"
            value={editQuestion.marks || ""}
            onChange={(e) =>
              setEditQuestion({ ...editQuestion, marks: e.target.value })
            }
            className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-2"
            placeholder="Marks"
          />
        </>

        <div className="flex justify-end gap-4 mt-5">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveEdit}
              disabled={loadingEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
            >
              {loadingEdit ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <></>
              )}{" "}
              Save
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
