"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { FaBullhorn, FaCloudUploadAlt } from "react-icons/fa";
import { IoAlertCircle } from "react-icons/io5";
import { MdError } from "react-icons/md";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";

interface FormData {
  fullName: string;
  email: string;
  description: string;
  screenshot: File | null;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  description?: string;
  screenshot?: string;
}

const FloatingBugReport = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
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
    if (!validateField("description", formData.description)) isValid = false;
    if (!validateField("screenshot", formData.screenshot)) isValid = false;

    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("description", formData.description);
      if (formData.screenshot) {
        submitData.append("screenshot", formData.screenshot);
      }

      toast.success("Message sending...");

      setFormData({
        fullName: "",
        email: "",
        description: "",
        screenshot: null,
      });
      setPreviewUrl(null);
      setIsFormOpen(false);

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
                  <button
                    onClick={() => {
                      setIsFormOpen(true);
                      toast.dismiss(t.id);
                    }}
                    className="mt-1 text-sm text-blue-500 underline"
                  >
                    Try again!
                  </button>
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-3 sm:bottom-6 right-6 z-[9999]">
      {isFormOpen ? (
        <div className="bg-white dark:bg-[#2c2c2c] rounded-3xl shadow-xl border border-black/15 dark:border-white/15 w-[323px] overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg">Report a Bug</h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
            >
              &times;
            </button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-1"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-1"
                  placeholder="your@email.com"
                />
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
                  rows={3}
                  className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-1"
                  placeholder="Detailed description of the bug"
                />
                {errors.description && (
                  <div className="flex items-center text-red-500 text-xs">
                    <IoAlertCircle className="w-4 h-4 mr-1" />
                    {errors.description}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Screenshot
                </label>
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
                {errors.screenshot && (
                  <div className="flex items-center text-red-500 text-xs">
                    <IoAlertCircle className="w-4 h-4 mr-1" />
                    {errors.screenshot}
                  </div>
                )}

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
      ) : (
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gray-100 dark:bg-[#323232] border border-black/15 dark:border-white/15 text-gray-600 dark:text-gray-200 rounded-full p-3 sm:py-2 sm:px-4 text-sm shadow-lg flex items-center gap-2 justify-center transition-all duration-200"
          aria-label="Report a bug"
        >
          <FaBullhorn size={17} />
          <span className="hidden sm:inline-block">Report a Bug </span>
        </button>
      )}
    </div>
  );
};

export default FloatingBugReport;
