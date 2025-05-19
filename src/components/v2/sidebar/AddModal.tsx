"use client";

import React, { useEffect, useState } from "react";
import Turnstile from "react-turnstile";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { FaInfoCircle, FaSpinner } from "react-icons/fa";
import { HoverButton } from "@/components/utils/Buttons";

const ReCAPTCHA_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_KEY || "0x4AAAAAABdTywgHj06fNkXz";

type Props = {
  formData: {
    name: string;
    faculties: string[];
    semester: string;
    isPrivate: boolean;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSaveSubject: () => void;
  loading: boolean;
  setShowForm: (value: boolean) => void;
};

const validFaculties = ["BCT", "BCE", "BEL", "BEI", "BEX", "BGE", "BME"];

export default function AddModal({
  formData,
  setFormData,
  handleSaveSubject,
  setShowForm,
  loading,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      const value = input.trim().toUpperCase();
      if (
        value &&
        validFaculties.includes(value) &&
        !formData.faculties.includes(value)
      ) {
        setFormData({ ...formData, faculties: [...formData.faculties, value] });
        setInput("");
      }
    }
  };

  const removeFaculty = (value: string) => {
    setFormData({
      ...formData,
      faculties: formData.faculties.filter((item) => item !== value),
    });
  };

  const handleSubmit = () => {
    if (!captchaToken) {
      toast.error("Please verify you are human.");
      return;
    }
    handleSaveSubject();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 overflow-y-scroll z-[9999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border border-gray-300 dark:border-gray-600 space-y-2">
        <h2 className="text-2xl mb-7 customfont-inter font-semibold">
          Add New Subject
        </h2>

        {/* Subject Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-1"
            placeholder="Enter Subject Name"
          />
        </div>

        {/* Faculties */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Faculties (e.g. BCT, BCE)
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] min-h-[48px]">
            {formData.faculties.map((faculty) => (
              <div
                key={faculty}
                className="flex items-center bg-gray-200 dark:bg-gray-600 text-sm rounded-full px-3 py-1"
              >
                {faculty}
                <button
                  onClick={() => removeFaculty(faculty)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-[120px] bg-transparent outline-none"
              placeholder="Type and press Enter..."
            />
          </div>
        </div>

        {/* Semester and Type */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Semester</label>
            <select
              value={formData.semester}
              onChange={(e) =>
                setFormData({ ...formData, semester: e.target.value })
              }
              className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-1"
            >
              <option value="">Select Semester</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* reCAPTCHA */}
        <Turnstile
          sitekey={ReCAPTCHA_KEY}
          onVerify={(token) => setCaptchaToken(token)}
          size="flexible"
          className="pt-3"
        />

        {/* Private Checkbox and Buttons */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.isPrivate}
              onChange={(e) =>
                setFormData({ ...formData, isPrivate: e.target.checked })
              }
              id="private"
              className="accent-blue-500 w-4 h-4"
            />
            <label htmlFor="private" className="cursor-pointer">
              Private
            </label>
            <HoverButton
              direction="top"
              hoverText="Visible only to you – helps organize personal notes."
              Icon={<FaInfoCircle />}
              onClick={() => {}}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !captchaToken}
              className="px-4 py-2 bg-blue-500 disabled:bg-blue-300 text-white rounded-md flex items-center"
            >
              {loading && <FaSpinner className="animate-spin mr-2" />}
              Add Subject
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
