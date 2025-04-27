// useSearch.ts (updated)
import { myAxios } from "@/services/apiServices";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface Subject {
  id: number;
  name: string;
  createdAt: string;
  isPremium: boolean;
  category?: string;
}

interface Resource {
  id: number;
  name: string;
  createdAt: string;
  isPremium: boolean;
  type: string;
  category?: string;
}

export default function useSearch() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchSubjects = useCallback(async (term: string) => {
    try {
      setLoading(true);
      const response = await myAxios.get(`/subject?search=${term}`);
      setSubjects(
        response.data.data.map((subject: any) => ({
          ...subject,
          isPremium: subject.isPremium || false,
          createdAt: subject.createdAt || new Date().toISOString(),
        }))
      );
    } catch (error: any) {
      toast.error(
        "Error fetching subjects:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResources = useCallback(async (term: string) => {
    try {
      setLoading(true);
      const response = await myAxios.get(`/resource?search=${term}`);
      setResources(
        response.data.data.map((resource: any) => ({
          ...resource,
          isPremium: resource.isPremium || false,
          createdAt: resource.createdAt || new Date().toISOString(),
        }))
      );
    } catch (error: any) {
      toast.error(
        "Error fetching resources:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubjects(searchTerm);
      fetchResources(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, refresh, fetchSubjects, fetchResources]);

  return { subjects, resources, searchParams, loading };
}
