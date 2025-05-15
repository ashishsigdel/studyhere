import React, { useEffect, useState } from "react";
import Turnstile, { useTurnstile } from "react-turnstile";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
const ReCAPTCHA_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_KEY || "0x4AAAAAABdTywgHj06fNkXz";

type Props = {
  subject: string;
  setSubject: any;
  handleSaveSubject: any;
  loading: boolean;
  setShowForm: any;
};

export default function AddModal({
  subject,
  setSubject,
  handleSaveSubject,
  setShowForm,
  loading,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!captchaToken) {
      toast.error("Please verify you are human.");
      return;
    }
    handleSaveSubject();
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 overflow-y-scroll z-[9999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border border-gray-300 dark:border-gray-600">
        <div className="flex gap-2 items-center mb-7">
          <h2 className="text-2xl">Add New Subject</h2>
        </div>

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-2"
          placeholder="Subject Name"
        />

        <div className="rounded-md overflow-hidden mt-7">
          <Turnstile
            sitekey={ReCAPTCHA_KEY}
            onVerify={(token) => setCaptchaToken(token)}
          />
        </div>

        <div className="flex justify-start gap-4 mt-5">
          <button
            onClick={handleSubmit}
            disabled={loading || !captchaToken}
            className="px-4 py-2 bg-blue-500 disabled:bg-blue-300 text-white rounded-md flex items-center"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
            Add Subject
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
