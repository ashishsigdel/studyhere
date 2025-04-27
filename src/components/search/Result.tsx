// Result.tsx
"use client";
import React, { useState } from "react";
import { AllSubjects } from "./AllSubjects";
import { AllResources } from "./AllResources";
import {
  FiBook,
  FiFileText,
  FiFilter,
  FiClock,
  FiArrowUp,
  FiArrowDown,
  FiStar,
  FiDollarSign,
  FiLayers,
  FiCheck,
} from "react-icons/fi";
import { FaBook, FaFileAlt } from "react-icons/fa";

export default function Result() {
  const [activeTab, setActiveTab] = useState<"subjects" | "resources">(
    "subjects"
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
        className={`w-full min-[900px]:w-72 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm p-5 h-fit sticky  border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
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

        {/* Type Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 dark:text-gray-300">
            <FiLayers className="text-gray-500" />
            Content Type
          </h4>
          <div className="space-y-2">
            <FilterButton
              active={activeTab === "subjects"}
              onClick={() => setActiveTab("subjects")}
              icon={<FaBook className="w-4 h-4" />}
              label="Subjects"
            />
            <FilterButton
              active={activeTab === "resources"}
              onClick={() => setActiveTab("resources")}
              icon={<FaFileAlt className="w-4 h-4" />}
              label="Resources"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-5"></div>

        {/* Sort Order */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 dark:text-gray-300">
            <FiClock className="text-gray-500" />
            Sort By
          </h4>
          <div className="space-y-2">
            <FilterButton
              active={sortOrder === "newest"}
              onClick={() => setSortOrder("newest")}
              icon={<FiArrowDown className="w-4 h-4" />}
              label="Newest First"
            />
            <FilterButton
              active={sortOrder === "oldest"}
              onClick={() => setSortOrder("oldest")}
              icon={<FiArrowUp className="w-4 h-4" />}
              label="Oldest First"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-5"></div>

        {/* Content Type Filter */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 dark:text-gray-300">
            <FiDollarSign className="text-gray-500" />
            Access Type
          </h4>
          <div className="space-y-2">
            <FilterButton
              active={filters.type === "all"}
              onClick={() => setFilters({ ...filters, type: "all" })}
              icon={<FiCheck className="w-4 h-4" />}
              label="All Content"
            />
            <FilterButton
              active={filters.type === "free"}
              onClick={() => setFilters({ ...filters, type: "free" })}
              icon={<FiStar className="w-4 h-4" />}
              label="Free Only"
            />
            <FilterButton
              active={filters.type === "premium"}
              onClick={() => setFilters({ ...filters, type: "premium" })}
              icon={<FiDollarSign className="w-4 h-4" />}
              label="Premium Only"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-5"></div>

        {/* Category Filter */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 dark:text-gray-300">
            <FiBook className="text-gray-500" />
            Category
          </h4>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
          >
            <option value="all">All Categories</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="language">Language</option>
            <option value="technology">Technology</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "subjects" ? (
          <AllSubjects sortOrder={sortOrder} filters={filters} />
        ) : (
          <AllResources sortOrder={sortOrder} filters={filters} />
        )}
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
