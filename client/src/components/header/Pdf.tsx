"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import PdfIframeViewer from "../pdf/PdfIframeViewer";
import {
  saveDataToIndexedDB,
  loadDataFromIndexedDB,
  deleteDataFromIndexedDB,
} from "@/utils/indexdb";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

const STORE_NAME = "pdfs";

export default function Pdf() {
  const [selectPdf, setSelectPdf] = useState(false);

  const [fileURL, setFileURL] = useState<string | null>(null);

  // Save file to IndexedDB
  const saveFileToIndexedDB = async (file: File) => {
    await saveDataToIndexedDB(STORE_NAME, "pdf", file);
  };

  // Retrieve file from IndexedDB
  const loadFileFromIndexedDB = async () => {
    const file = await loadDataFromIndexedDB(STORE_NAME, "pdf");
    if (file) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
    }
  };

  // Handle file selection
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      await saveFileToIndexedDB(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setFileURL(url);
    }
  };

  // Load the stored PDF on mount
  useEffect(() => {
    loadFileFromIndexedDB();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.key === "." &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")
      ) {
        setSelectPdf((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const deletePdf = async () => {
    await deleteDataFromIndexedDB(STORE_NAME, "pdf");
    toast.success("Please refresh page to add new pdf.");
  };
  return (
    <>
      {selectPdf && fileURL && (
        <button
          onClick={() => deletePdf()}
          className="p-2.5 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 relative"
        >
          {<FaFilePdf size={18} />}
          <FaPlus className="absolute -right-1 bottom-0 p-0.5 bg-black rounded-full" />
        </button>
      )}
      <button
        onClick={() => setSelectPdf(!selectPdf)}
        className="p-2.5 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
      >
        {<FaFilePdf size={20} />}
      </button>

      <div
        className={`fixed h-[calc(100dvh-64px)] w-full top-16 left-0 z-[9999] ${
          !selectPdf && "hidden"
        }`}
      >
        <PdfIframeViewer
          onClose={() => setSelectPdf(false)}
          fileURL={fileURL}
          handleFileChange={handleFileChange}
        />
      </div>
    </>
  );
}
