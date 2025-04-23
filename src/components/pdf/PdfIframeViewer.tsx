"use client";

import AddPdf from "./AddPdf";

interface Props {
  onClose: any;
  fileURL: string | null;
  handleFileChange: any;
}

export default function PdfIframeViewer({
  onClose,
  fileURL,
  handleFileChange,
}: Props) {
  if (!fileURL) {
    return (
      <div className="w-full h-screen">
        <AddPdf handleFileChange={handleFileChange} onClose={onClose} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {fileURL && (
        <iframe
          src={fileURL}
          className="flex-grow w-full h-[calc(100vh-200px)]"
        ></iframe>
      )}
    </div>
  );
}
