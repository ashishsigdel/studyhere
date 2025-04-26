import Sidebar from "@/components/ads/Sidebar";
import { AllSubjects } from "@/components/subject/AllSubjects";
import React from "react";

export default function page() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 container flex flex-col-reverse min-[900px]:flex-row gap-4">
      <div className="w-full min-[900px]:w-4/5">
        <AllSubjects />
      </div>
      <div className="w-full min-[900px]:w-1/5 mt-8 min-[900px]:mt-16">
        <Sidebar />
      </div>
    </div>
  );
}
