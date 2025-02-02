"use client";

import { useEffect, useState } from "react";
import {
  saveDataToIndexedDB,
  deleteDataFromIndexedDB,
  loadDataFromIndexedDB,
} from "@/utils/indexdb";

const STORE_NAME = "pdfs";

export default function PdfIframeViewer() {
  const [fileURL, setFileURL] = useState<string | null>(null);

  // Save file to IndexedDB
  const saveFileToIndexedDB = async (file: File) => {
    await saveDataToIndexedDB(STORE_NAME, "2", file);
  };

  // Retrieve file from IndexedDB
  const loadFileFromIndexedDB = async () => {
    const file = await loadDataFromIndexedDB(STORE_NAME, "2");
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

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {fileURL && (
        <iframe
          src={fileURL}
          width="100%"
          height="600px"
          className="mt-4"
        ></iframe>
      )}
    </div>
  );
}
