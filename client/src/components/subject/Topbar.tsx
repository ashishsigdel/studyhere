"use client";
import { ChangeEvent, useEffect, useState } from "react";
import Theme from "@/utils/Theme";
import { FaPlus } from "react-icons/fa";
import Spinner from "@/utils/Spinner";

interface TopBarProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

const TopBar: React.FC<TopBarProps> = ({ showForm, setShowForm }) => {
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center w-full gap-3 py-2.5 text-3xl font-semibold">
        Home
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2.5 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          onClick={toggleForm}
          aria-label="Add new item"
        >
          <FaPlus size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
