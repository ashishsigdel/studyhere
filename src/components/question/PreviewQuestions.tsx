"use client";
import { useEffect, useState } from "react";
import useUploadAi from "./useUploadAi";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { myAxios } from "@/services/apiServices";
import toast from "react-hot-toast";

export default function PreviewQuestions() {
  const { handleFetchImage, loading, response, subject, chapters } =
    useUploadAi();
  const [stage, setStage] = useState<"uploaded" | "processing" | "extracting">(
    "uploaded"
  );
  const [selectedChapters, setSelectedChapters] = useState<
    Record<number, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    handleFetchImage();
  }, []);

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

  const handleChapterChange = (
    questionIndex: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const chapterId = Number(e.target.value);
    setSelectedChapters((prev) => ({
      ...prev,
      [questionIndex]: chapterId,
    }));
  };

  const preparePayload = () => {
    if (!response || !subject) return [];

    return response.questions.map((question, index) => ({
      question: question.question,
      subjectId: subject.id,
      chapterId: selectedChapters[index] || Number(question.chapterId),
      marks: question.marks ? question.marks : null,
      year: response.year
        ? response.year + response.exam_type && " " + response.exam_type
        : null,
    }));
  };

  const handleSaveQuestions = async () => {
    if (!subject) {
      toast.error("Subject information is missing");
      return;
    }

    const payload = preparePayload();

    // Validate all questions have chapter selected
    const hasMissingChapters = payload.some((q) => !q.chapterId);
    if (hasMissingChapters) {
      toast.error("Please select chapters for all questions");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await myAxios.post("/question/questions/bulk", {
        questions: payload,
      });
      toast.success("Questions saved successfully!");
      router.push(`/subject/${subject.slug}`);
    } catch (error) {
      toast.error("Failed to save questions");
      console.log("Error saving questions:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      {/* Loading skeleton - unchanged from your original */}
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

      {!loading && response && subject && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {subject.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {response.year} • {response.exam_type}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {response.questions && response.questions.length} questions
              </span>
              <div className="flex items-center gap-1 text-green-500">
                <FaCheckCircle />
                <span className="text-sm">Extracted</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {response.questions &&
              response.questions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="flex-1">
                      <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: question.question,
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Marks: {question.marks}</span>
                        <span>Year: {response.year}</span>
                      </div>
                    </div>

                    <div className="w-full md:w-48">
                      <label
                        htmlFor={`chapter-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Chapter
                      </label>
                      <select
                        id={`chapter-${index}`}
                        value={
                          selectedChapters[index] || question.chapterId || ""
                        }
                        onChange={(e) => handleChapterChange(index, e)}
                        className="w-full px-3 py-2 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-[#3c3c3c] text-sm transition-all"
                      >
                        <option value="">Select chapter</option>
                        {chapters &&
                          chapters.map((chapter) => (
                            <option key={chapter.id} value={chapter.id}>
                              {chapter.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveQuestions}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-32"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save All Questions"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
