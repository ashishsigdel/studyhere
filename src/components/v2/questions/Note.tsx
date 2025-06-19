import { HtmlRenderer } from "@/components/utils";
import NoData from "@/components/utils/NoData";
import RichTEditor from "@/components/utils/RichTEditor";
import TabItem from "@/components/utils/TabIcon";
import { myAxios } from "@/services/apiServices";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { decode } from "he";

type Props = {
  note: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
  } | null;
  refresh: () => void;
  chapter: string | undefined;
  user: User | null;
  noteContent: string;
  setNoteContent: (content: string) => void;
};

export default function Note({
  note,
  refresh,
  chapter,
  user,
  noteContent,
  setNoteContent,
}: Props) {
  const params = useParams<{ slug: string; chapterId: string }>();
  const [openForm, setOpenForm] = useState<null | "html">(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState<"html" | "markdown" | "preview">(
    "markdown"
  );
  const [previousTab, setPreviousTab] = useState<"html" | "markdown">(
    "markdown"
  );
  const id = params.chapterId;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();

        if (openForm === "html") {
          if (inputType === "preview") {
            setInputType(previousTab);
          } else {
            setPreviousTab(inputType);
            setInputType("preview");
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openForm, inputType, previousTab]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await myAxios.post(`/question/createnote/${id}`, {
        content: noteContent,
      });
      refresh();
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to save note");
    } finally {
      setIsLoading(false);
      setOpenForm(null);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are supported.");
        continue;
      }

      const placeholder = "![Uploading image...]\n";
      const currentContent = decode(noteContent || "");
      const newContent = currentContent + "\n" + placeholder;
      setNoteContent(newContent);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await myAxios.post("/contact/for-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = response.data.data.url;

        if (!imageUrl) {
          throw new Error("Image URL not returned.");
        }

        const placeholder = `![image](${imageUrl})\n`;
        const currentContent = decode(noteContent || "");
        const newContent = currentContent + "\n" + placeholder;
        setNoteContent(newContent);
      } catch (error) {
        toast.error("Failed to upload image.");
        setNoteContent(
          decode(noteContent || "").replace("![Uploading image...]\n", "")
        );
      }
    }
  };

  if (openForm === "html") {
    return (
      <div className="w-full">
        <div className="flex justify-between w-full my-3">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 rounded-xl border border-black/10 p-1 dark:border-white/10 bg-white dark:bg-[#424242]">
              <TabItem
                label="Markdown"
                icon={<></>}
                active={inputType === "markdown"}
                onClick={() => setInputType("markdown")}
              />
              <TabItem
                label="Visual Editor"
                icon={<></>}
                active={inputType === "html"}
                onClick={() => setInputType("html")}
              />
              <TabItem
                label={
                  <>
                    Preview (
                    {window.navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl"}{" "}
                    + Enter)
                  </>
                }
                icon={<></>}
                active={inputType === "preview"}
                onClick={() => setInputType("preview")}
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
            text={noteContent || ""}
            setText={(newContent: string) => setNoteContent(newContent)}
            height={`${window.innerHeight - 142}px`}
          />
        ) : inputType === "markdown" ? (
          <textarea
            className="w-full min-h-[200px] bg-light-white dark:bg-dark-black p-3 border border-gray-300 dark:border-gray-700 rounded resize-y text-sm"
            placeholder="Write here..."
            value={decode(noteContent || "")}
            onChange={(e) => setNoteContent(e.target.value)}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            rows={30}
          />
        ) : (
          <HtmlRenderer content={decode(noteContent)} />
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
    <div className="">
      <div className="flex justify-between items-center mb-3 py-3 border-b border-black/5 dark:border-white/5 relative">
        <h3 className="text-xl font-medium text-black dark:text-white">
          Note: {chapter}
        </h3>
        {note?.createdBy === user?.id && (
          <button
            onClick={() => setOpenForm("html")}
            className="flex sticky top-0 gap-2 items-center cursor-pointer bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-md text-sm whitespace-nowrap flex-1 sm:flex-none justify-center w-fit"
          >
            <FaEdit size={16} />
          </button>
        )}
      </div>
      <HtmlRenderer content={decode(noteContent)} />
    </div>
  );
}
