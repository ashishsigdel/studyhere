"use client";
import React, { useEffect, useState } from "react";
import AddModal from "./AddModal";
import ChaptersList from "./ChaptersList";
import Syllabus from "./Syllabus";
import Resources from "./Resources";
import useChapters from "./useChapters";
import {
  IoBookmark,
  IoBookmarkOutline,
  IoClose,
  IoSettings,
} from "react-icons/io5";
import TabItem from "@/components/utils/TabIcon";
import { FaEye, FaGlobe, FaLock } from "react-icons/fa";
import PopupMessage from "@/components/utils/PopupMessage";

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
    type,
    setType,
    showSettings,
    setShowSettings,
    visibility,
    updateVisibility,
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
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Settings"
                onClick={() => setShowSettings(!showSettings)}
              >
                <IoSettings
                  size={20}
                  className="text-gray-400 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors duration-200"
                />
              </button>
              {showSettings && (
                <div className="absolute top-10 right-0 bg-white-light-variant dark:bg-dark-light-variant rounded-lg shadow-lg px-2 py-2 min-w-48 z-50">
                  <div className="flex items-center justify-between gap-2 pb-1 border-b border-black/5 dark:border-white/5">
                    <h3 className="text-sm font-medium">Settings</h3>
                    <button
                      className="p-1 rounded-full dark:hover:bg-white/5 hover:bg-black/5 transition-colors duration-200"
                      onClick={() => setShowSettings(false)}
                    >
                      <IoClose size={16} />
                    </button>
                  </div>

                  <div className="flex gap-1 w-full mt-2">
                    <TabItem
                      label="Public"
                      padding="1.5"
                      icon={<FaGlobe />}
                      active={visibility === "public"}
                      onClick={() => updateVisibility("public")}
                    />
                    <TabItem
                      label="View Only"
                      padding="1.5"
                      icon={<FaEye />}
                      active={visibility === "view-only"}
                      onClick={() => updateVisibility("view-only")}
                    />
                    <TabItem
                      label="Private"
                      padding="1.5"
                      icon={<FaLock />}
                      active={visibility === "private"}
                      onClick={() => updateVisibility("private")}
                    />
                  </div>
                  <div className="mt-2">
                    <PopupMessage messageShowOn="chapter-settings" size="sm" />
                  </div>
                </div>
              )}
            </div>
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
      {/* <Resources /> */}

      {/* Add Chapter Modal */}
      {showForm && (
        <AddModal
          handleSaveChapter={handleSaveChapter}
          loading={loadingAdd}
          setShowForm={setShowForm}
          chapter={chapter}
          setChapter={setChapter}
          type={type}
          setType={setType}
        />
      )}
    </div>
  );
}
