import React from "react";
import Spinner from "@/utils/Spinner";
import { FaSpinner } from "react-icons/fa";
import TabItem from "@/components/utils/TabIcon";
import PopupMessage from "@/components/utils/PopupMessage";

type Props = {
  chapter: string;
  setChapter: any;
  handleSaveChapter: any;
  loading: boolean;
  setShowForm: any;
  type: "q&a" | "note";
  setType: any;
};

export default function AddModal({
  chapter,
  setChapter,
  handleSaveChapter,
  setShowForm,
  loading,
  type,
  setType,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 overflow-y-scroll z-[999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto border border-gray-300 dark:border-gray-600">
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-xl">Add New Chapter</h2>
        </div>

        <label htmlFor="chapter" className="text-sm font-medium mb-2">
          Chapter Name
        </label>
        <input
          type="text"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-2"
          placeholder="Chapter Name"
        />

        <label htmlFor="type" className="text-sm font-medium mb-2">
          Type
        </label>
        <div className="flex gap-1 w-full">
          <TabItem
            label="Question & Answer"
            padding="2"
            icon={<></>}
            active={type === "q&a"}
            onClick={() => setType("q&a")}
          />
          <TabItem
            label="Notes"
            padding="2"
            icon={<></>}
            active={type === "note"}
            onClick={() => setType("note")}
          />
        </div>
        <div className="my-3">
          <PopupMessage messageShowOn={"chapter-add-modal"} />
        </div>
        <div className="flex justify-end gap-4 mt-5">
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChapter}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : <></>} Add
          </button>
        </div>
      </div>
    </div>
  );
}
