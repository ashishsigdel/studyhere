"use client";
import React from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { app } from "@/config/firebase";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

export default function OAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const redirectUrl = decodeURIComponent(redirect);
  const { theme } = useTheme();

  const handleOAuthLogin = async (provider: any) => {
    try {
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await myAxios.post(
        "/auth/user",
        {
          fullName: result.user.displayName,
          email: result.user.email,
          profilePic: result.user.photoURL,
        },
        {
          headers: {
            "X-OAuth": `${idToken}`,
          },
        }
      );

      const user = JSON.stringify(response.data.data.user);
      localStorage.setItem("user", user);
      localStorage.setItem("accessToken", response.data.data.accessToken);
      window.dispatchEvent(new Event("user-update"));
      toast.success("Logged in successfully!");
      router.push(redirectUrl);
    } catch (error: any) {
      console.log(error);

      toast.error(error?.response?.data.message || "Something went wrong!");
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-64px)] flex flex-col items-center justify-center gap-4">
      <p className="font-semibold text-xl">Sign In</p>
      <button
        type="button"
        className="px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
        aria-label="Continue with google"
        onClick={() => handleOAuthLogin(new GoogleAuthProvider())}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="24px"
          height="24px"
        >
          <path
            fill="#fbc02d"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#e53935"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4caf50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1565c0"
            d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        <span>Continue With Google</span>
      </button>

      <p className="">or,</p>
      <button
        type="button"
        className="px-4 py-2.5 rounded-lg flex items-center gap-4 cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
        aria-label="Continue with github"
        onClick={() => handleOAuthLogin(new GithubAuthProvider())}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 72 72"
          width="24px"
          height="24px"
          fill={theme === "light" ? "black" : "white"}
        >
          <path d="M 36 12 C 22.745 12 12 22.745 12 36 C 12 49.255 22.745 60 36 60 C 49.255 60 60 49.255 60 36 C 60 22.745 49.255 12 36 12 z M 36 20 C 44.837 20 52 27.163 52 36 C 52 43.284178 47.128298 49.420174 40.46875 51.355469 C 40.198559 51.103128 39.941627 50.74363 39.953125 50.285156 C 39.980125 49.233156 39.953125 46.778953 39.953125 45.876953 C 39.953125 44.328953 38.972656 43.230469 38.972656 43.230469 C 38.972656 43.230469 46.654297 43.316141 46.654297 35.119141 C 46.654297 31.957141 45.003906 30.310547 45.003906 30.310547 C 45.003906 30.310547 45.872125 26.933953 44.703125 25.501953 C 43.393125 25.359953 41.046922 26.753297 40.044922 27.404297 C 40.044922 27.404297 38.457406 26.753906 35.816406 26.753906 C 33.175406 26.753906 31.587891 27.404297 31.587891 27.404297 C 30.586891 26.753297 28.239687 25.360953 26.929688 25.501953 C 25.760688 26.933953 26.628906 30.310547 26.628906 30.310547 C 26.628906 30.310547 24.974609 31.956141 24.974609 35.119141 C 24.974609 43.316141 32.65625 43.230469 32.65625 43.230469 C 32.65625 43.230469 31.782197 44.226723 31.693359 45.652344 C 31.180078 45.833418 30.48023 46.048828 29.8125 46.048828 C 28.2025 46.048828 26.978297 44.483766 26.529297 43.759766 C 26.086297 43.045766 25.178031 42.447266 24.332031 42.447266 C 23.775031 42.447266 23.503906 42.726922 23.503906 43.044922 C 23.503906 43.362922 24.285781 43.585781 24.800781 44.175781 C 25.887781 45.420781 25.866281 48.21875 29.738281 48.21875 C 30.196553 48.21875 31.021102 48.11542 31.677734 48.025391 C 31.674106 48.90409 31.663893 49.74536 31.677734 50.285156 C 31.688158 50.700354 31.476914 51.032045 31.236328 51.279297 C 24.726159 49.25177 20 43.177886 20 36 C 20 27.163 27.163 20 36 20 z" />
        </svg>
        <span>Continue With GitHub</span>
      </button>
    </div>
  );
}
