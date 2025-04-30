import { Question } from "@/components/questionpage";
import React from "react";

export default function page() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 container flex min-[900px]:flex-row flex-col-reverse gap-4 relative">
      <Question />
    </div>
  );
}
