"use client";
import { Spinner } from "@/utils";
import { useEffect, useState, useRef } from "react";
import { myAxios } from "@/services/apiServices";
import { useSelector } from "react-redux";
import TopBar from "./Topbar";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import { SubjectType } from "@/types/subject";
import SubjectCard from "./SubjectCard";

const STORE_NAME = "subjects";

interface TopBarProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export const FeaturedSubjects: React.FC<TopBarProps> = ({
  showForm,
  setShowForm,
}) => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);

  const user = useSelector((state: any) => state.auth.user);

  const fetchSubjects = async () => {
    try {
      try {
        const cachedSubjects = await loadDataFromIndexedDB(
          STORE_NAME,
          "subjects"
        );

        if (cachedSubjects !== undefined) {
          setSubjects(cachedSubjects);
        } else {
          setLoading(true);
        }
      } catch (error) {
        setLoading(true);
      }

      if (navigator.onLine) {
        const response = await myAxios.get(
          "/subject?sortOrder=desc&sortBy=views"
        );
        setSubjects(response.data.data.subjects);

        await saveDataToIndexedDB(
          STORE_NAME,
          "subjects",
          response.data.data.subjects
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div id="featured-subjects" className="mt-16">
      <div className="flex items-center justify-between mb-5 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Featured Subjects 📚
        </h2>

        {user && <TopBar showForm={showForm} setShowForm={setShowForm} />}
      </div>

      {loading && subjects && subjects.length === 0 && <Spinner />}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {!loading && subjects && subjects.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No subjects available
          </div>
        )}
        {subjects &&
          subjects.length > 0 &&
          subjects.map((subject) => (
            <SubjectCard subject={subject} key={subject.id} />
          ))}
      </div>
    </div>
  );
};
