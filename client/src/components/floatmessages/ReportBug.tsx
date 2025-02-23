"use client";

interface FormData {
  title: string;
  description: string;
  screenshot: File | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  screenshot?: string;
}

import { myAxios } from "@/services/apiServices";
import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { MdError } from "react-icons/md";

const BugReportForm = ({}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    screenshot: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateField = (
    name: keyof FormData,
    value: string | File | null
  ): boolean => {
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
      }));
      return false;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        screenshot: file,
      }));

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    validateField(name as keyof FormData, value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    let isValid = true;
    if (!validateField("title", formData.title)) isValid = false;
    if (!validateField("description", formData.description)) isValid = false;

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      if (formData.screenshot) {
        submitData.append("screenshot", formData.screenshot);
      }

      // Show immediate success toast
      toast.success("Message sending...");

      // Reset form data after showing the success toast
      setFormData({
        title: "",
        description: "",
        screenshot: null,
      });
      setPreviewUrl(null);

      // Handle API call in the background
      try {
        await myAxios.post("/contact/reportbug", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error: any) {
        toast.custom(
          (t: any) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white dark:bg-black shadow-lg rounded-lg pointer-events-auto flex border border-black/15 dark:border-white/15`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <MdError size={40} color="red" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">
                      Failed to send your bug report.
                    </p>
                    <Link
                      href={"/report"}
                      className="mt-1 text-sm text-blue-500 underline"
                    >
                      Try again!
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-black/15 dark:border-white/15">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity,
          }
        );
      }
    } catch (error: any) {
      toast.error("Error with submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-106px)] w-full flex items-center justify-center">
      <div className={`max-w-2xl mx-auto p-6 w-full`}>
        <h1 className="text-2xl font-bold mb-6">Report a Bug</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md mb-2"
              placeholder="Brief description of the issue"
            />
            {errors.title && (
              <div className="flex items-center text-red-500 text-sm">
                <IoAlertCircle className="w-4 h-4 mr-1" />
                {errors.title}
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-md mb-2"
              placeholder="Detailed description of the bug"
            />
            {errors.description && (
              <div className="flex items-center text-red-500 text-sm">
                <IoAlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Screenshot</label>
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4">
              <input
                type="file"
                id="screenshot"
                name="screenshot"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="screenshot"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload screenshot
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG up to 10MB
                </span>
              </label>
            </div>
            <div className="flex items-center text-gray-500 text-xs mt-2 italic">
              Note: larger file takes more time to upload.
            </div>

            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-md"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Bug Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BugReportForm;
