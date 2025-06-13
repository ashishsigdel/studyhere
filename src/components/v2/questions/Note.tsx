import { HtmlRenderer } from "@/components/utils";
import NoData from "@/components/utils/NoData";
import RichTEditor from "@/components/utils/RichTEditor";
import TabItem from "@/components/utils/TabIcon";
import { myAxios } from "@/services/apiServices";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";

type Props = {
  note: string;
  refresh: () => void;
  chapter: string | undefined;
};

export default function Note({ note, refresh, chapter }: Props) {
  const params = useParams<{ slug: string; chapterId: string }>();
  const [openForm, setOpenForm] = useState<null | "html">(null);
  const [content, setContent] = useState(note || "");
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState<"html" | "markdown">("html");
  const id = params.chapterId;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await myAxios.post(`/question/createnote/${id}`, {
        content,
      });
      refresh();
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to save note");
    } finally {
      setIsLoading(false);
      setOpenForm(null);
    }
  };

  if (openForm === "html") {
    return (
      <div className="w-full">
        <div className="flex justify-between w-full my-3">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 rounded-xl border border-black/10 p-1 dark:border-white/10 bg-white dark:bg-[#424242]">
              <TabItem
                label="HTML"
                icon={<></>}
                active={inputType === "html"}
                onClick={() => setInputType("html")}
              />
              <TabItem
                label="Markdown"
                icon={<></>}
                active={inputType === "markdown"}
                onClick={() => setInputType("markdown")}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleSave()}
              className="flex gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center w-fit"
            >
              <FaSave size={16} />
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setOpenForm(null)}
              className="flex gap-2 items-center cursor-pointer bg-red-200 dark:bg-red-900 px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
            >
              <FaTimes size={16} />
              Cancel
            </button>
          </div>
        </div>
        {inputType === "html" ? (
          <RichTEditor
            text={content}
            setText={(newContent: string) => setContent(newContent)}
            height="500px"
          />
        ) : (
          <textarea
            className="w-full min-h-[200px] bg-light-white dark:bg-dark-black p-3 border border-gray-300 dark:border-gray-700 rounded resize-y text-sm"
            placeholder="Write here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={30}
          />
        )}
      </div>
    );
  }

  if (!note) {
    return (
      <div className="mt-10 flex flex-col gap-4">
        <NoData
          title="No note added!"
          description="Add a note to this chapter to view it here."
        />
        <button
          onClick={() => setOpenForm("html")}
          className="flex gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center w-fit mx-auto"
        >
          <FaPlus size={16} />
          Add Note
        </button>
      </div>
    );
  }

  return (
    <div className="text-gray-600 dark:text-gray-300">
      <div className="flex justify-between items-center mb-3 py-3 border-b border-black/5 dark:border-white/5">
        <h3 className="text-xl font-medium text-white">Note: {chapter}</h3>
        <button
          onClick={() => setOpenForm("html")}
          className="flex gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center w-fit"
        >
          <FaEdit size={16} />
        </button>
      </div>
      <HtmlRenderer content={content} />
    </div>
  );
}
