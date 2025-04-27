"use client";
import { useEffect, useState } from "react";
import useUploadAi from "./useUploadAi";

export default function PreviewQuestions() {
  const { handleFetchImage, loading, imagePreview, response } = useUploadAi();
  const [stage, setStage] = useState<"uploaded" | "processing" | "extracting">(
    "uploaded"
  );

  useEffect(() => {
    let uploadedTimeout: NodeJS.Timeout;
    let processingTimeout: NodeJS.Timeout;

    uploadedTimeout = setTimeout(() => {
      setStage("processing");
      processingTimeout = setTimeout(() => {
        setStage("extracting");
      }, 3000);
    }, 1500);

    return () => {
      clearTimeout(uploadedTimeout);
      clearTimeout(processingTimeout);
    };
  }, []);
  return (
    <div className="p-4">
      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {stage === "uploaded" && "Uploaded!"}
              {stage === "processing" && "Processing..."}
              {stage === "extracting" && "Extracting data..."}
            </div>
          </div>
          {/* Header skeleton */}
          <div className="h-8 bg-gray-300 dark:bg-gray-500 rounded-full w-1/3"></div>

          {/* Content block skeletons */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded-full w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded-full w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded-full w-4/6"></div>
              </div>
            ))}
          </div>

          {/* Animated progress bar */}
          <div className="relative pt-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-2 bg-gray-300 dark:bg-gray-500 rounded-full w-24"></div>
              </div>
              <div className="text-right">
                <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded-full w-8 inline-block"></div>
              </div>
            </div>
            <div className="overflow-hidden h-2 mt-2 text-xs flex rounded-full bg-gray-300 dark:bg-gray-500">
              <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 animate-loading-stripes"></div>
            </div>
          </div>
        </div>
      )}

      {/* Actual content when not loading */}
      {!loading && response && (
        <div className="prose dark:prose-invert">Response</div>
      )}
    </div>
  );
}
