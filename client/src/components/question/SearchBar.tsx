"use client";
import { ChangeEvent, useEffect, useState } from "react";
import Theme from "@/utils/Theme";
import { FaPlus } from "react-icons/fa";
import Spinner from "@/utils/Spinner";

interface SearchBarProps {
  search: string;
  loading: boolean;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  setSearch: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  loading,
  setShowForm,
  showForm,
  setSearch,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center w-full gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
        <input
          type="text"
          className="w-full bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
          placeholder="Search Question or Year..."
          value={search}
          onChange={handleSearchChange}
        />
        {loading && (
          <div className="flex-shrink-0">
            <Spinner color="#222" />
          </div>
        )}
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

export default SearchBar;
