import React from "react";
import { JoditForm } from "@/components/utils";
import Spinner from "@/utils/Spinner";

type Props = {
  chapter: string;
  setChapter: any;
  handleSaveChapter: any;
  loading: boolean;
  setShowForm: any;
};

export default function AddModal({
  chapter,
  setChapter,
  handleSaveChapter,
  setShowForm,
  loading,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3">
      <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-gray-300 dark:border-gray-600">
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-xl">Add New Chapter</h2>
        </div>

        <input
          type="text"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md mb-2"
          placeholder="Chapter Name"
        />

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
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? <Spinner /> : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
