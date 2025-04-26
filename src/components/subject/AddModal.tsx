import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Spinner from "@/utils/Spinner";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
const ReCAPTCHA_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_KEY ||
  "6LfblSQrAAAAAKUsFiMn7ASp2j6S8CQaC7i7hl-O";

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  console.log(captchaToken);

  const { theme } = useTheme();

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const handleSubmit = () => {
    if (!captchaToken) {
      toast.success("Please verify you are human.");
      return;
    }
    handleSaveSubject();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3 overflow-y-scroll z-[999]">
      <div className="bg-white dark:bg-[#323232] p-6 rounded-lg shadow-lg w-full max-w-md mx-auto border border-gray-300 dark:border-gray-600">
        <div className="flex gap-2 items-center mb-4">
          <h2 className="text-xl">Add New Subject</h2>
        </div>

        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c] mb-2"
          placeholder="Subject Name"
        />

        <div className="flex justify-center my-4">
          <div className="rounded-md overflow-hidden">
            <ReCAPTCHA
              sitekey={ReCAPTCHA_KEY}
              onChange={onCaptchaChange}
              theme={theme === "dark" ? "dark" : "light"}
              size="normal"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <button
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !captchaToken}
            className="px-4 py-2 bg-blue-500 disabled:bg-blue-300 text-white rounded-md"
          >
            {loading ? <Spinner /> : "Add Subject"}
          </button>
        </div>
      </div>
    </div>
  );
}
