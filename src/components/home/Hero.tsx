"use client";

import Image from "next/image";
import heroImageLight from "@/assets/pictures/hero-light.png";
import heroImageDark from "@/assets/pictures/hero-dark.png";
import { useEffect, useState } from "react";

export default function Hero() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning! ☕️");
    else if (hour < 18) setGreeting("Good Afternoon! ☀️");
    else setGreeting("Good Evening! 🌙");
  }, []);

  return (
    <section className="min-h-[calc(100vh-64px)] w-full relative overflow-hidden flex items-center">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
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

          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto md:mx-0">
            Your one-stop platform for all your learning needs. Join us and
            start your journey today!
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200">
              Sign Up
            </button>
            <button className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
              Explore More
            </button>
          </div>
        </div>

        {/* Right Visual (Hidden on small screens) */}
        <div className="hidden md:block w-full md:w-1/2 relative">
          <Image
            src={heroImageLight}
            alt="StudyHere Illustration"
            className="w-full h-auto object-cover rounded-xl block dark:hidden"
            priority
          />
          <Image
            src={heroImageDark}
            alt="StudyHere Illustration"
            className="w-full h-auto object-cover rounded-xl hidden dark:block"
            priority
          />
        </div>
      </div>
    </section>
  );
}
