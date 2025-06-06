"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import OAuthButtons from "./OAuthButtons";
import Image from "next/image";
import Link from "next/link";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("new") === "true";
  const redirect = searchParams.get("redirect") || "/";

  return (
    <div className="w-full min-h-[calc(100dvh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mt-5 mb-10 gap-2">
              <Image
                src={"/icon-512.png"}
                alt="LearnHere Logo"
                width={100}
                height={100}
                className="rounded-full w-10 h-10"
              />
              <h3 className="text-3xl customfont-typoround text-gray-700 dark:text-gray-200">
                <span className="text-primary">Learn</span>Here
              </h3>
            </div>
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white px-4">
                {isRegister ? "Create your Account" : "Welcome Back"}
              </h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {isRegister
                ? "Join us today and get started"
                : "Sign in to continue"}
            </p>
          </div>
          <OAuthButtons isRegister={isRegister} redirect={redirect} />
          <p className="my-2 text-center text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{" "}
            <Link
              href="/privacy"
              className="underline text-primary hover:text-primary-dark"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
