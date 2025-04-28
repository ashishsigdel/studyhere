"use client";
import { AllSubjects } from "./AllSubjects";
import {
  FiBook,
  FiFileText,
  FiFilter,
  FiClock,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import useSearch from "./useSearch";

export default function Result() {
  const {
    setMobileFiltersOpen,
    mobileFiltersOpen,
    filters,
    handleSortChange,
    searchTerm,
    handleSearchChange,
  } = useSearch();

  return (
    <div className="flex flex-col min-[900px]:flex-row gap-6 p-4 max-w-7xl mx-auto">
      {/* Mobile Filter Toggle */}
      <div className="min-[900px]:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <FiFilter className="text-gray-600 dark:text-gray-300" />
          <span className="font-medium">Filters</span>
        </button>
      </div>

      {/* Sidebar Filters */}
      <div
        className={`w-full min-[900px]:w-72 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-5 h-fit sticky border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
          mobileFiltersOpen ? "block" : "hidden min-[900px]:block"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 dark:text-white">
            <FiFilter className="text-primary" />
            Filters
          </h3>
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="min-[900px]:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        {/* Search Input - Updated to use handleSearchChange */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 dark:text-gray-300">
            <FiFileText className="text-gray-500" />
            Search
          </h4>
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-5"></div>

        {/* Sort Options */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 dark:text-gray-300">
            <FiClock className="text-gray-500" />
            Sort By
          </h4>
          <div className="space-y-2">
            <FilterButton
              active={filters.sortBy === "views"}
              onClick={() => handleSortChange("views")}
              icon={
                filters.sortBy === "views" ? (
                  filters.sortOrder === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  )
                ) : (
                  <FiFileText />
                )
              }
              label={`Views ${
                filters.sortBy === "views"
                  ? `(${filters.sortOrder === "asc" ? "↑" : "↓"})`
                  : ""
              }`}
            />
            <FilterButton
              active={filters.sortBy === "createdAt"}
              onClick={() => handleSortChange("createdAt")}
              icon={
                filters.sortBy === "createdAt" ? (
                  filters.sortOrder === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  )
                ) : (
                  <FiClock />
                )
              }
              label={`Date Created ${
                filters.sortBy === "createdAt"
                  ? `(${filters.sortOrder === "asc" ? "↑" : "↓"})`
                  : ""
              }`}
            />
            <FilterButton
              active={filters.sortBy === "name"}
              onClick={() => handleSortChange("name")}
              icon={
                filters.sortBy === "name" ? (
                  filters.sortOrder === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  )
                ) : (
                  <FiBook />
                )
              }
              label={`Name ${
                filters.sortBy === "name"
                  ? `(${filters.sortOrder === "asc" ? "A-Z" : "Z-A"})`
                  : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <AllSubjects />
      </div>
    </div>
  );
}

// Reusable Filter Button Component
const FilterButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
      active
        ? "bg-primary/10 text-primary dark:bg-primary/20 border border-primary/20"
        : "hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
    }`}
  >
    <span
      className={`${
        active ? "text-primary" : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {icon}
    </span>
    <span>{label}</span>
  </button>
);
