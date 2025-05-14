import { SubjectType } from "@/types/subject";
import { Spinner } from "@/utils";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { MouseEventHandler, useState, useRef, useEffect } from "react";
import {
  FaBookOpen,
  FaPlus,
  FaWifi,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { myAxios } from "@/services/apiServices";
import { useSelector } from "react-redux";

type Props = {
  toggleForm: MouseEventHandler<HTMLButtonElement>;
  chapters: { id: number; name: string }[];
  subject: SubjectType | null;
  loading: boolean;
  fetchChapters: Function;
  handleImport: any;
};

export default function ChaptersList({
  toggleForm,
  chapters,
  subject,
  loading,
  fetchChapters,
  handleImport,
}: Props) {
  const pathname = usePathname();
  const user = useSelector((state: any) => state.auth.user);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const editInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null) {
        const dropdownElement = dropdownRefs.current[activeDropdown];
        if (
          dropdownElement &&
          !dropdownElement.contains(event.target as Node)
        ) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingChapter !== null && editInputRef.current) {
      editInputRef.current.focus();
      setEditedName(chapters.find((c) => c.id === editingChapter)?.name || "");
    }
  }, [editingChapter, chapters]);

  const handleChapterClick = async (
    subjectName: string,
    chapterName: string,
    chapterId: number
  ) => {
    const STORE_NAME = "recentChapters";
    const chapterUrl = `${pathname}/${chapterId}`;

    let recentChapters = await loadDataFromIndexedDB(
      STORE_NAME,
      "recentChapters"
    );

    if (!recentChapters) {
      recentChapters = [];
    }
    recentChapters = recentChapters.filter((ch: any) => ch.url !== chapterUrl);
    recentChapters.unshift({
      name: chapterName,
      url: chapterUrl,
      subject: subjectName,
    });

    if (recentChapters.length > 4) {
      recentChapters = recentChapters.slice(0, 4);
    }

    await saveDataToIndexedDB(STORE_NAME, "recentChapters", recentChapters);
  };

  const toggleDropdown = (chapterId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === chapterId ? null : chapterId);
  };

  const startEditing = (chapterId: number) => {
    setEditingChapter(chapterId);
    setActiveDropdown(null);
  };

  const cancelEditing = () => {
    setEditingChapter(null);
    setEditedName("");
  };

  const showDeleteModal = (chapterId: number) => {
    setDeleteModal(chapterId);
    setActiveDropdown(null);
  };

  const editChapter = async (chapterId: number) => {
    try {
      await myAxios.put(`/chapter/update/${chapterId}`, {
        name: editedName,
      });

      fetchChapters();
      cancelEditing();
    } catch (error: any) {
      console.log(error.response.data.message || "Something went wrong!");
    }
  };
  const deleteChapter = async (chapterId: number) => {
    try {
      await myAxios.delete(`/chapter/update/${chapterId}`);

      fetchChapters();
      cancelEditing();
    } catch (error: any) {
      console.log(error.response.data.message || "Something went wrong!");
    }
  };

  return (
    <div
      id="chapters"
      className="border-b border-black/20 dark:border-white/20 py-6 "
    >
      {deleteModal !== null && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 p-6 rounded-lg shadow-xl mx-2 md:mx-0 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Chapter</h3>
            <p className="mb-6">
              Are you sure you want to delete this chapter? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteChapter(deleteModal);
                  setDeleteModal(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex flex-col justify-between w-full">
          <div className="w-full justify-between flex items-center mb-4">
            <h2 className="text-2xl font-semibold">Chapters</h2>
            {user && (
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleForm}
                  className="px-2 py-2 sm:py-1 border rounded-md border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  aria-label="Add new item"
                >
                  <FaPlus size={16} />
                  <span className="hidden sm:inline">Add Chapter</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-1 mt-2">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex gap-3 items-center p-3 rounded-lg hover:bg-white dark:hover:bg-[#2f2f2f] transition-colors group relative border-b border-black/10 dark:border-white/10"
            >
              <div className="flex items-center justify-center h-7 w-7 rounded-full border border-primary group-hover:bg-primary group-hover:text-white font-medium">
                {index + 1}
              </div>

              {editingChapter === chapter.id ? (
                <div className="flex-grow flex items-center gap-2">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-grow px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent"
                  />
                  <button
                    onClick={() => editChapter(chapter.id)}
                    className="p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                subject && (
                  <>
                    <Link
                      href={`${pathname}/${chapter.id}`}
                      onClick={() =>
                        handleChapterClick(
                          subject.name,
                          chapter.name,
                          chapter.id
                        )
                      }
                      className="text-base font-medium flex-grow capitalize"
                    >
                      {chapter.name}
                    </Link>

                    {user && (
                      <button
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        onClick={(e) => toggleDropdown(chapter.id, e)}
                        aria-label="Chapter actions"
                      >
                        <BsThreeDots className="text-gray-500 dark:text-gray-400" />
                      </button>
                    )}

                    {/* Dropdown Menu */}
                    {activeDropdown === chapter.id && (
                      <div
                        ref={(el: any) =>
                          (dropdownRefs.current[chapter.id] = el)
                        }
                        className="absolute right-0 top-10 z-10 w-40 bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-md shadow-lg "
                      >
                        <button
                          className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(chapter.id);
                          }}
                        >
                          <FaEdit className="text-blue-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            showDeleteModal(chapter.id);
                          }}
                        >
                          <FaTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Empty States */}
      {loading && (
        <div className="p-8 flex justify-center">
          <Spinner />
        </div>
      )}
      {!navigator.onLine && chapters.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaWifi size={24} className="mx-auto mb-2" />
          <p>
            You are offline. Please connect to the internet to view chapters.
          </p>
        </div>
      )}
      {navigator.onLine && !loading && chapters.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaBookOpen size={24} className="mx-auto mb-2" />
          <p>No chapters available. Add a new chapter to get started.</p>
          <button
            onClick={handleImport}
            className="bg-[#c0ffb2] hover:bg-[#8dff76] text-[#073400] text-sm px-4 py-2 rounded-md transition mt-3 w-fit"
          >
            Import from Syllabus
          </button>
        </div>
      )}
    </div>
  );
}
