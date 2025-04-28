import { myAxios } from "@/services/apiServices";
import { SubjectType } from "@/types/subject";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";

export default function useSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const initialSortOrder = searchParams.get("sortOrder") || "desc";
  const initialSortBy = searchParams.get("sortBy") || "createdAt";
  const initialPage = searchParams.get("page") || "1";
  const initialSearch = searchParams.get("search") || "";

  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
  }>({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    sortOrder: initialSortOrder as "asc" | "desc",
    sortBy: initialSortBy as "views" | "createdAt" | "updatedAt" | "name",
    page: parseInt(initialPage),
    search: initialSearch,
  });

  // For debouncing
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search term with debouncing
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: term,
        page: 1, // Reset to first page when search changes
      }));
    }, 700);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.sortOrder !== "desc")
      params.set("sortOrder", filters.sortOrder);
    if (filters.sortBy !== "createdAt") params.set("sortBy", filters.sortBy);
    if (filters.page !== 1) params.set("page", filters.page.toString());
    if (filters.search) params.set("search", filters.search);

    // Compare with current URL to prevent unnecessary navigation
    const currentParams = new URLSearchParams(window.location.search);
    if (params.toString() !== currentParams.toString()) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [filters, pathname, router]);

  useEffect(() => {
    const newFilters = {
      sortOrder: (searchParams.get("sortOrder") || "desc") as "asc" | "desc",
      sortBy: (searchParams.get("sortBy") || "createdAt") as
        | "views"
        | "createdAt"
        | "updatedAt"
        | "name",
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || "",
    };

    // Only update filters if they're different from current state
    setFilters((prev) => {
      if (
        prev.sortOrder === newFilters.sortOrder &&
        prev.sortBy === newFilters.sortBy &&
        prev.page === newFilters.page &&
        prev.search === newFilters.search
      ) {
        return prev;
      }
      return newFilters;
    });

    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSortChange = (sortBy: typeof filters.sortBy) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy
          ? prev.sortOrder === "asc"
            ? "desc"
            : "asc"
          : "desc",
    }));
  };

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);

      // Build query string with all filter parameters
      const queryParams = new URLSearchParams();
      queryParams.set("sortOrder", filters.sortOrder);
      queryParams.set("sortBy", filters.sortBy);
      queryParams.set("page", filters.page.toString());
      if (filters.search) queryParams.set("search", filters.search);

      const response = await myAxios.get(`/subject?${queryParams.toString()}`);
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
  }, [filters]);

  // Fetch subjects when filters change
  useEffect(() => {
    fetchSubjects();
  }, [filters]);

  return {
    subjects,
    searchParams,
    loading,
    pagination,
    fetchSubjects,
    handleSortChange,
    setMobileFiltersOpen,
    mobileFiltersOpen,
    filters,
    setFilters,
    searchTerm,
    handleSearchChange, // New handler for debounced search
  };
}
