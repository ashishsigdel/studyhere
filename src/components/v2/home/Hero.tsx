"use client";

import Image from "next/image";
import heroImageLight from "@/assets/pictures/hero-light.png";
import heroImageDark from "@/assets/pictures/hero-dark.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [greeting, setGreeting] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning! ☕️");
    else if (hour < 18) setGreeting("Good Afternoon! ☀️");
    else setGreeting("Good Evening! 🌙");
  }, []);

  if (user) {
    return null;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="ml-10 w-full relative overflow-hidden flex items-center mx-auto max-w-7xl py-6">
      <div className="mx-auto py-8 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="w-full md:w-1/2 z-10 text-center md:text-left">
          <h1 className="text-5xl sm:text-6xl md:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
            <span className="block text-xl sm:text-2xl md:text-3xl font-medium text-primary mb-2">
              {greeting}
            </span>
            Welcome to
            <br />
            <span className="text-primary">LearnHere...</span>
          </h1>

          <div className="block md:hidden w-full md:w-1/2 relative">
            <Image
              src={heroImageLight}
              alt="Learnhere Illustration"
              className="w-full h-auto object-cover rounded-xl block dark:hidden"
              priority
            />
            <Image
              src={heroImageDark}
              alt="Learnhere Illustration"
              className="w-full h-auto object-cover rounded-xl hidden dark:block"
              priority
            />
          </div>

          <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
            <p className="mb-4">
              Your one-stop platform for all your learning needs. Join us and
              start your journey today!
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
                  Add your own answers
                </span>{" "}
                and manage your study materials easily.
              </li>
            </ul>
          </div>

          <div className="flex flex-col lg:flex-row justify-center lg:justify-start gap-4">
            <button
              onClick={() => router.push("/search")}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200"
            >
              Start Exploring
            </button>
            <button
              onClick={() => router.push("/login?new=true")}
              className="bg-gray-50 hover:bg-gray-100 dark:bg-[#323232] hover:dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 px-6 py-3 rounded-lg font-semibold transition duration-200"
            >
              Sign Up for Free
            </button>
          </div>
        </div>

        {/* Right Visual (Hidden on small screens) */}
        <div className="hidden md:block w-full md:w-1/2 relative">
          <Image
            src={heroImageLight}
            alt="Learnhere Illustration"
            className="w-full h-auto object-cover rounded-xl block dark:hidden"
            priority
          />
          <Image
            src={heroImageDark}
            alt="Learnhere Illustration"
            className="w-full h-auto object-cover rounded-xl hidden dark:block"
            priority
          />
        </div>
      </div>
    </section>
  );
}
