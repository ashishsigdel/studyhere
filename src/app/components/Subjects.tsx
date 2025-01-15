"use client";
import { myAxios } from "@/utils/apiHanlde";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Subjects() {
  const [subjects, setSubjects] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const fetchSubjects = async () => {
    try {
      const response = await myAxios.get("/subject");
      setSubjects(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="flex flex-col">
      {subjects.length === 0 && <>Loading...</>}
      {subjects &&
        subjects.length > 0 &&
        subjects.map((subject, index) => (
          <div
            key={subject.id}
            className="flex gap-2 items-center mt-1 border-b p-3"
          >
            <span>{index + 1}. </span>
            <Link href={`/${subject.id}`} className="">
              {subject.name}
            </Link>
          </div>
        ))}
    </div>
  );
}
