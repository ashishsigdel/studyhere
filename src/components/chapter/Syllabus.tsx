import { myAxios } from "@/services/apiServices";
import { Spinner } from "@/utils";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaBookOpen,
  FaCloudUploadAlt,
  FaPlus,
  FaTimes,
  FaWifi,
} from "react-icons/fa";
import { HtmlRenderer } from "../utils";

type Props = {};
type SyllabusType = {
  id: number;
  syllabus: string;
  fullMarks: string;
  passMarks: string;
};

export default function Syllabus({}: Props) {
  const [file, setFile] = useState<null | File>(null);
  const [image, setImage] = useState<null | string>(null);
  const [steps, setSteps] = useState<"1" | "2">("1");
  const [loading, setLoading] = useState(false);
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [syllabus, setSyllabus] = useState<SyllabusType | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const response = await myAxios.get(`/syllabus/${slug}`);
      setSyllabus(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSyllabus();
  }, []);

  const handleContinue = async () => {
    if (file && image) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await myAxios.post(
          `/ai/add-syllabus?slug=${slug}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        fetchSyllabus();
      } catch (error) {
        toast.error("Unable to Perform.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Unable to Perform.");
    }
  };
  return (
    <div id="syllabus" className="">
      <div className="flex flex-col py-6 border-b border-black/20 dark:border-white/20">
        <div className="flex flex-col justify-between w-full">
          <div className="w-full justify-between flex items-center mb-4">
            <h2 className="text-2xl font-semibold">Syllabus</h2>
          </div>
        </div>
        {loading ? (
          <div className="w-full flex justify-center">
            <Spinner />
          </div>
        ) : syllabus ? (
          <>
            <HtmlRenderer content={syllabus?.syllabus} />
          </>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            {steps == "1" ? (
              <>
                <FaBookOpen size={24} className="mx-auto mb-2" />
                <p>No Syllabus available.</p>
                <button
                  onClick={() => setSteps("2")}
                  className="bg-[#c0ffb2] hover:bg-[#8dff76] text-[#073400] text-sm px-4 py-2 rounded-md transition mt-3 w-fit"
                >
                  Upload
                </button>
              </>
            ) : (
              <>
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4">
                  <input
                    type="file"
                    id="screenshot"
                    name="screenshot"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Question paper preview"
                        className="max-h-60 mx-auto rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="screenshot"
                      className="flex flex-col items-center justify-center cursor-pointer my-3"
                    >
                      <FaCloudUploadAlt className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload screenshot
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 10MB
                      </span>
                    </label>
                  )}
                </div>
                <button
                  onClick={handleContinue}
                  className="bg-[#c0ffb2] hover:bg-[#8dff76] text-[#073400] text-sm px-4 py-2 rounded-md transition mt-3 w-fit"
                >
                  Add Syllabus
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
