"use client";
import React, { useEffect, useState } from "react";
import { FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import PdfIframeViewer from "../pdf/PdfIframeViewer";
import {
  saveDataToIndexedDB,
  loadDataFromIndexedDB,
  deleteDataFromIndexedDB,
} from "@/utils/indexdb";

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
      const activeElement = document.activeElement;

      // Check if the active element is an input, textarea, or Jodit editor
      const isTyping =
        ["INPUT", "TEXTAREA"].includes(activeElement?.tagName || "") ||
        activeElement?.closest(".jodit-container"); // Detect Jodit editor

      if (event.key === "x" && !isTyping) {
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
    setFileURL(null);
  };
  return (
    <>
      {selectPdf && fileURL && (
        <button
          onClick={() => deletePdf()}
          className="p-1.5 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hidden lg:inline-block relative text-sm md:text-base"
        >
          Add New PDF
        </button>
      )}
      <button
        onClick={() => setSelectPdf(!selectPdf)}
        className="p-1.5 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hidden lg:inline-block"
      >
        {<FaFilePdf size={20} />}
      </button>

      <div
        className={`fixed h-[calc(100dvh-64px)] w-full top-16 left-0 z-[999] ${
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
