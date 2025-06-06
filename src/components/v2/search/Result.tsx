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
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import { SubjectType } from "@/types/subject";
import { FaCross, FaTimes } from "react-icons/fa";

export default function Result() {
  const router = useRouter();
  const [refresh, setRefresh] = useState<boolean>(false);
  const search = useSearchParams().get("q") || "";
  const sortOrder = useSearchParams().get("order") || "desc";
  const sortBy = useSearchParams().get("sortby") || "";
  const page = useSearchParams().get("page") || "1";
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [subjects, setSubjects] = useState<SubjectType[] | []>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
  }>({
    currentPage: 1,
    totalPages: 1,
  });

  const [searchdata, setSearchdata] = useState({
    q: useSearchParams().get("q") || "",
    order: useSearchParams().get("order") || "desc",
    sortby: useSearchParams().get("sortby") || "",
    page: useSearchParams().get("page") || "1",
  });

  const handleSortClick = (sortOption: "views" | "createdAt" | "name") => {
    setSearchdata((prev) => {
      if (prev.sortby === sortOption) {
        return {
          ...prev,
          order: prev.order === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          ...prev,
          sortby: sortOption,
          order: "desc",
        };
      }
    });
  };

  // Debounce Effect
  useEffect(() => {
    const delay = setTimeout(() => {
      interface QueryParams {
        q?: string;
        order?: string;
        sortby?: string;
        page?: string;
      }
      const queryParams: QueryParams = {};

      if (searchdata.q.trim() !== "") queryParams.q = searchdata.q;
      if (searchdata.order.trim() !== "") queryParams.order = searchdata.order;
      if (searchdata.sortby.trim() !== "")
        queryParams.sortby = searchdata.sortby;
      if (searchdata.page !== "") queryParams.page = searchdata.page;

      if (Object.keys(queryParams).length > 0) {
        const queryString = new URLSearchParams(queryParams as any).toString();
        router.push(`/search?${queryString}`);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [
    searchdata.q,
    searchdata.order,
    searchdata.sortby,
    searchdata.page,
    router,
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);

        const response = await myAxios.get(
          `/subject?search=${search}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`
        );
        setSubjects(response.data.data.subjects);
        setPagination(response.data.data.pagination);
      } catch (error: any) {
        toast.error(
          "Error fetching subjects:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [search, page, sortBy, sortOrder, refresh]);

  const handlePageChange = (pageNumber: number) => {
    setSearchdata({
      ...searchdata,
      page: pageNumber.toString(),
    });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] xl:flex-row-reverse xl:gap-6 p-4 max-w-7xl mx-auto px-8 sm:px-10">
      {/* Mobile Filter Toggle */}
      <div className="xl:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-lg shadow-sm dark:border-gray-700"
        >
          <FiFilter className="text-gray-600 dark:text-gray-300" />
          <span className="font-medium">Filters</span>
        </button>
      </div>

      {/* Sidebar Filters */}
      <div
        className={`w-full relative xl:sticky xl:top-20 xl:w-60 bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-xl shadow-sm p-5 h-fit transition-all duration-300 mt-4 ${
          mobileFiltersOpen ? "block" : "hidden xl:block"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg flex items-center gap-2 dark:text-white">
            <FiFilter className="text-primary" />
            Filters
          </h3>
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="xl:hidden p-2 hover:bg-white-variant hover:dark:bg-dark-variant transition-all duration-300 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        {/* Sort Options */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 dark:text-gray-300">
            <FiClock className="text-gray-500" />
            Sort By
          </h4>
          <div className="space-y-2">
            <FilterButton
              active={searchdata.sortby === "views"}
              onClick={() => handleSortClick("views")}
              icon={
                searchdata.sortby === "views" ? (
                  searchdata.order === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  )
                ) : (
                  <FiFileText />
                )
              }
              label={`Views ${
                searchdata.sortby === "views"
                  ? `(${searchdata.order === "asc" ? "↑" : "↓"})`
                  : ""
              }`}
            />
            <FilterButton
              active={searchdata.sortby === "createdAt"}
              onClick={() => handleSortClick("createdAt")}
              icon={
                searchdata.sortby === "createdAt" ? (
                  searchdata.order === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  )
                ) : (
                  <FiClock />
                )
              }
              label={`Date Created ${
                searchdata.sortby === "createdAt"
                  ? `(${searchdata.order === "asc" ? "↑" : "↓"})`
                  : ""
              }`}
            />
            <FilterButton
              active={searchdata.sortby === "name"}
              onClick={() => handleSortClick("name")}
              icon={
                searchdata.sortby === "name" ? (
                  searchdata.order === "asc" ? (
                    <FiArrowUp />
                  ) : (
                    <FiArrowDown />
                  )
                ) : (
                  <FiBook />
                )
              }
              label={`Name ${
                searchdata.sortby === "name"
                  ? `(${searchdata.order === "asc" ? "A-Z" : "Z-A"})`
                  : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <AllSubjects
          subjects={subjects}
          loading={loading}
          pagination={pagination}
          handlePageChange={handlePageChange}
        />
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
        : "hover:bg-gray-100 dark:hover:bg-[#323232] border border-transparent"
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
