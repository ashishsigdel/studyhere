"use client";
import { Spinner } from "@/utils";
import { useEffect, useState, useRef } from "react";
import { myAxios } from "@/services/apiServices";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import { SubjectType } from "@/types/subject";
import SubjectCard from "./SubjectCard";
import { MdOutlineLocalFireDepartment } from "react-icons/md";
import NoData from "@/components/utils/NoData";

const STORE_NAME = "subjects";

export const FeaturedSubjects: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);

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
    <div className="flex flex-col mt-10 border-b border-10 pb-10">
      <div className="flex items-center justify-between mb-5 md:mb-12">
        <h2 className="text-xl md:text-3xl font-semibold flex items-center gap-3">
          <MdOutlineLocalFireDepartment />
          Featured Subjects
        </h2>
      </div>

      {loading && subjects && subjects.length === 0 && <Spinner />}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        {!loading && subjects && subjects.length === 0 && (
          <NoData
            title="No Subjects Available!"
            description="Something went wrong while fetching subjects."
          />
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
