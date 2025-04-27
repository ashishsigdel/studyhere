import PreviewQuestions from "@/components/question/PreviewQuestions";
import PreviewSidebar from "@/components/question/PreviewSidebar";
import React from "react";

export default function page() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 container flex min-[900px]:flex-row flex-col gap-4 relative mt-5">
      {/* Sidebar column */}
      <div className="w-full min-[900px]:w-1/5">
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <PreviewSidebar />
        </div>
      </div>
      {/* Main content */}
      <div className="w-full min-[900px]:w-4/5">
        <PreviewQuestions />
      </div>
    </div>
  );
}
