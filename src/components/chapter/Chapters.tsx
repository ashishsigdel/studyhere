"use client";
import { myAxios } from "@/services/apiServices";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddModal from "./AddModal";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import { FaStar } from "react-icons/fa";
import ChaptersList from "./ChaptersList";
import Syllabus from "./Syllabus";
import Resources from "./Resources";
import useChapters from "./useChapters";

export default function Chapters() {
  const {
    fetchChapters,
    handleSaveChapter,
    subject,
    id,
    setShowForm,
    showForm,
    chapters,
    loading,
    loadingAdd,
    chapter,
    setChapter,
  } = useChapters();

  useEffect(() => {
    if (subject) {
      document.title = `${subject} - Chapters`;
    } else {
      document.title = "Chapters";
    }
  }, [subject]);

  useEffect(() => {
    if (id) fetchChapters();
  }, [id]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col justify-between w-full border-b border-gray-200 dark:border-gray-700">
        <div className="w-full py-6 justify-between flex items-center">
          <div>
            <h2 className="text-3xl font-bold capitalize line-clamp-1">
              {subject}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-gray-600 dark:text-gray-300 font-medium">
              Add to Favourite
            </span>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FaStar
                size={20}
                className="text-yellow-400 hover:text-yellow-500"
              />
            </button>
          </div>
        </div>
      </div>

      <ChaptersList
        chapters={chapters}
        loading={loading}
        subject={subject}
        toggleForm={toggleForm}
      />
      <Syllabus />
      <Resources />

      {/* Add Chapter Modal */}
      {showForm && (
        <AddModal
          handleSaveChapter={handleSaveChapter}
          loading={loadingAdd}
          setShowForm={setShowForm}
          chapter={chapter}
          setChapter={setChapter}
        />
      )}
    </div>
  );
}
