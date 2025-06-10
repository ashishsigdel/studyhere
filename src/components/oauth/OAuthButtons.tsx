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
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/features/authSlice";
import axios from "axios";
import { baseUrl } from "@/services/apiServices";
import { setMessage } from "@/redux/features/popupMessageSlice";

interface OAuthButtonsProps {
  isRegister: boolean;
  redirect: string;
}

export default function OAuthButtons({
  isRegister,
  redirect,
}: OAuthButtonsProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const handleOAuthLogin = async (provider: any) => {
    try {
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await axios.post(
        `${baseUrl}/auth/user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      dispatch(setAuth(response.data.data.user));
      toast.success(
        isRegister ? "Account created successfully!" : "Logged in successfully!"
      );

      router.push(redirect);
    } catch (error: any) {
      console.log(error);

      dispatch(
        setMessage({
          message:
            error?.response?.data.message ||
            error.message ||
            "Something went wrong!",
          type: "error",
          showOn: "oauth",
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className="w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-[#323232] hover:dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors"
        onClick={() => handleOAuthLogin(new GoogleAuthProvider())}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="24px"
          height="24px"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <button
        type="button"
        className="w-full px-4 py-2.5 rounded-lg flex items-center justify-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-[#323232] hover:dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-colors"
        onClick={() => handleOAuthLogin(new GithubAuthProvider())}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24px"
          height="24px"
          fill={theme === "light" ? "#000000" : "#FFFFFF"}
        >
          <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z" />
        </svg>
        <span>Continue with GitHub</span>
      </button>
    </div>
  );
}
