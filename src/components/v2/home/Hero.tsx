"use client";

import Image from "next/image";
import heroImageLight from "@/assets/pictures/hero-light.png";
import heroImageDark from "@/assets/pictures/hero-dark.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  return (
    <section className="w-full relative overflow-hidden flex items-center mx-auto max-w-7xl py-6">
      <div className="mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 z-10 text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
            <span className="block text-xl sm:text-2xl md:text-3xl font-medium text-primary mb-2">
              {greeting}
            </span>
            Welcome to
            <br />
            <span className="text-primary">StudyHere...</span>
          </h1>

          <div className="block md:hidden w-full md:w-1/2 relative">
            <Image
              src={heroImageLight}
              alt="Studyhere Illustration"
              className="w-full h-auto object-cover rounded-xl block dark:hidden"
              priority
            />
            <Image
              src={heroImageDark}
              alt="Studyhere Illustration"
              className="w-full h-auto object-cover rounded-xl hidden dark:block"
              priority
            />
          </div>

          <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
            <p className="mb-4">
              Platform for all your learning needs. Key Features!
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-start">
              <li>
                <span className="font-medium text-primary">
                  Question-wise learning
                </span>{" "}
                for focused practice.
              </li>
              <li>
                Each question categorized by{" "}
                <span className="font-medium text-primary">
                  individual chapters
                </span>
                .
              </li>
              <li>
                Coverage of{" "}
                <span className="font-medium text-primary">
                  all past questions
                </span>
                .
              </li>
              <li>
                <span className="font-medium text-primary">
                  Instant solutions
                </span>{" "}
                powered by AI.
              </li>
              <li>
                <span className="font-medium text-primary">
                  Add your answers
                </span>{" "}
                and manage your study materials.
              </li>
            </ul>
          </div>

          <div className="flex flex-col lg:flex-row justify-center lg:justify-start gap-4">
            <button
              onClick={() => router.push("/login?new=true")}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200"
            >
              Sign Up for Free
            </button>
          </div>
        </div>

        {/* Right Visual (Hidden on small screens) */}
        <div className="hidden md:block w-full md:w-1/2 relative">
          <Image
            src={heroImageLight}
            alt="studyhere Illustration"
            className="w-full h-auto object-cover rounded-xl block dark:hidden"
            priority
          />
          <Image
            src={heroImageDark}
            alt="studyhere Illustration"
            className="w-full h-auto object-cover rounded-xl hidden dark:block"
            priority
          />
        </div>
      </div>
    </section>
  );
}
