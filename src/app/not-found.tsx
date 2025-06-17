import React from "react";
import Image from "next/image";
import MainLayout from "@/components/layout/MainLayout";
import notFoundImage from "@/assets/pictures/404.svg";
import notFoundImageDark from "@/assets/pictures/404_dark.svg";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-61px)] px-4 py-12 text-center">
        <Image
          src={notFoundImage}
          alt="404 - Not Found"
          height={250}
          width={525}
          className="w-full max-w-md mb-8 dark:hidden"
          priority
        />
        <Image
          src={notFoundImageDark}
          alt="404 - Not Found"
          height={250}
          width={525}
          className="w-full max-w-md mb-8 hidden dark:block"
          priority
        />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
      </div>
    </MainLayout>
  );
}
