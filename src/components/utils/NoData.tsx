import Image from "next/image";
import Picture from "@/assets/pictures/noNotes.svg";
import React from "react";

type Props = {
  title?: string;
  description?: string;
  button?: React.ReactNode;
};

export default function NoData({
  title = "No Data Found",
  description = "There is no data you are looking for.",
  button = <></>,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full col-span-full mb-4">
      <div className="relative w-64 h-64 mx-auto mb-3">
        <Image
          src={Picture}
          alt={title}
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="text-center max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
      </div>
      {button}
    </div>
  );
}
