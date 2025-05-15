"use client";
import React, { useEffect, useState } from "react";
import AddModal from "./AddModal";
import ChaptersList from "./ChaptersList";
import Syllabus from "./Syllabus";
import Resources from "./Resources";
import useChapters from "./useChapters";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";

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
    toggleSaved,
    isFavorite,
    handleImport,
  } = useChapters();

  useEffect(() => {
    if (subject) {
      document.title = `${subject.name} - Chapters`;
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
    <div className="flex flex-col overflow-hidden max-w-7xl mx-auto w-full px-8 sm:px-10">
      {/* Header Section */}
      <div className="flex flex-col justify-between w-full border-b border-gray-200 dark:border-gray-700">
        <div className="w-full py-6 justify-between flex items-center">
          <h2 className="text-3xl font-bold capitalize line-clamp-1 customfont-inter">
            {subject?.name}
          </h2>

          <div className="flex items-center gap-1">
            <span className="hidden md:inline-block text-gray-500 dark:text-gray-400 font-medium">
              {isFavorite ? "Pinned" : "Pin Subject"}
            </span>
            <button
              onClick={() => toggleSaved()}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Add to Shortcut"
            >
              {isFavorite ? (
                <IoBookmark size={20} className="text-primary" />
              ) : (
                <IoBookmarkOutline
                  size={20}
                  className="text-gray-400 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <ChaptersList
        chapters={chapters}
        loading={loading}
        subject={subject}
        toggleForm={toggleForm}
        fetchChapters={fetchChapters}
        handleImport={handleImport}
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
