import React, { useState } from "react";
import { JoditForm } from "@/components/utils";
import Spinner from "@/utils/Spinner";
import TabItem from "./TabIcon";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import useUploadAi from "./useUploadAi";

type Props = {
  newQuestion: any;
  setNewQuestion: any;
  setShowForm: any;
  handleSaveQuestion: any;
  loadingAdd: boolean;
};

export default function AddModal({
  newQuestion,
  setNewQuestion,
  setShowForm,
  handleSaveQuestion,
  loadingAdd,
}: Props) {
  const [modeManual, setModeManual] = useState<boolean>(true);
  const { handleFileChange, image, setImage, handleContinue } = useUploadAi();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 overflow-y-scroll z-[999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-gray-300 dark:border-gray-600">
        <div className="flex gap-2 items-center mb-4 justify-between">
          <h2 className="text-xl">
            Add <span className="hidden min-[400px]:inline">Question</span>
          </h2>
          <div className="flex gap-1 rounded-xl border border-black/10 p-1 dark:border-white/10 bg-white dark:bg-gray-800/50">
            <TabItem
              label="Manual"
              icon={<></>}
              active={modeManual === true}
              onClick={() => setModeManual(true)}
            />
            <TabItem
              label="Using AI"
              icon={<></>}
              active={modeManual === false}
              onClick={() => setModeManual(false)}
            />
          </div>
        </div>

        {modeManual ? (
          <>
            <JoditForm
              text={newQuestion.question}
              setText={(newContent: string) =>
                setNewQuestion({ ...newQuestion, question: newContent })
              }
              placeholder="Enter new question"
            />

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
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload a Question Paper Image and Let AI Handle the Rest!
              </label>
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4 my-5">
                <input
                  type="file"
                  id="screenshot"
                  name="screenshot"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Question paper preview"
                      className="max-h-60 mx-auto rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="screenshot"
                    className="flex flex-col items-center justify-center cursor-pointer my-3"
                  >
                    <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to upload screenshot
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 10MB
                    </span>
                  </label>
                )}
              </div>
              <div className="flex items-center text-gray-500 text-xs mt-2 italic">
                Info: You can review everything before saving.
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          {modeManual ? (
            <button
              onClick={handleSaveQuestion}
              disabled={loadingAdd || !modeManual}
              className="px-4 py-2 bg-blue-500 disabled:opacity-70 text-white rounded-md"
            >
              {loadingAdd ? <Spinner /> : "Add"}
            </button>
          ) : (
            <button
              onClick={handleContinue}
              disabled={loadingAdd || modeManual}
              className="px-4 py-2 bg-blue-500 disabled:opacity-70 text-white rounded-md"
            >
              {loadingAdd ? <Spinner /> : "Use Image"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
