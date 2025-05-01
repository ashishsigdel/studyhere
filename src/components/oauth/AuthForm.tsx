"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import OAuthButtons from "./OAuthButtons";
import EmailForm from "./EmailForm";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("new") === "true";
  const redirect = searchParams.get("redirect") || "/";
  const { theme } = useTheme();

  return (
    <div className="w-full min-h-[calc(100dvh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
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

          {/* <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <p className="px-3 text-sm text-gray-500 dark:text-gray-400">or</p>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div> */}

          {/* <EmailForm isRegister={isRegister} redirect={redirect} /> */}

          {/* <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
              <button
                onClick={() =>
                  router.push(isRegister ? "/login" : "/login?new=true")
                }
                className="ml-1 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isRegister ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
