import React from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export default function AddPdf({ handleFileChange, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 overflow-y-scroll z-[999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-xl mx-auto border border-gray-300 dark:border-gray-600">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <IoClose size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
          Upload PDF
        </h2>

        {/* File Input */}
        <div className="mt-14 flex flex-col items-center">
          <label className="py-2 px-3 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600">
            <p className="text-[16px] font-semibold">Select Pdf</p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
