"use client";
import { Spinner } from "@/utils";
import { useEffect, useState, useRef } from "react";
import { myAxios } from "@/services/apiServices";
import { useSelector } from "react-redux";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import { SubjectType } from "@/types/subject";
import SubjectCard from "./SubjectCard";
import NoData from "../utils/NoData";

const STORE_NAME = "subjects";

export const FavSubjects = ({}) => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const user = useSelector((state: any) => state.auth.user);

  const fetchSubjects = async () => {
    if (!user) {
      return;
    }
    try {
      try {
        const cachedSubjects = await loadDataFromIndexedDB(
          STORE_NAME,
          "subjects-fav"
        );
        if (cachedSubjects) {
          setSubjects(cachedSubjects);
        } else {
          setLoading(true);
        }
      } catch (error) {
        setLoading(true);
      }

      if (navigator.onLine) {
        const response = await myAxios.get(`/subject/get-fav`);
        setSubjects(response.data.data);

        await saveDataToIndexedDB(
          STORE_NAME,
          "subjects-fav",
          response.data.data
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div id="featured-subjects" className="mt-16">
      <div className="flex items-center justify-between mb-5 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Shortcut Subjects 📚
        </h2>
      </div>

      {loading && subjects.length === 0 && <Spinner />}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {!loading && subjects.length === 0 && (
          <NoData
            title="No Subjects Available"
            description="It looks like there aren't any subjects added yet."
          />
        )}
        {subjects.length > 0 &&
          subjects.map((subject) => (
            <SubjectCard subject={subject} key={subject.id} />
          ))}
      </div>
    </div>
  );
};
