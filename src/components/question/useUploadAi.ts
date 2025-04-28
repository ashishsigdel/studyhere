"use client";
import { resetPhotos, setPhotos } from "@/redux/features/aiUpload";
import { myAxios } from "@/services/apiServices";
import { SubjectType } from "@/types/subject";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface ResponseType {
  subject: string;
  year: string;
  exam_type: "string";
  questions: {
    question: string;
    marks: string;
    chapterId: string | number;
  }[];
}

interface ChaptersType {
  id: number;
  name: string;
}

export default function useUploadAi() {
  const [image, setImage] = useState<null | string>(null);
  const [file, setFile] = useState<null | File>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const imagePreview = useSelector((state: any) => state.aiupload.previewUrl);
  const imageFile = useSelector((state: any) => state.aiupload.picture);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [subject, setSubject] = useState<SubjectType | null>(null);
  const [chapters, setChapters] = useState<ChaptersType[] | []>([]);

  console.log(response);
  console.log(subject);
  console.log(chapters);

  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const handleContinue = () => {
    if (file && image) {
      dispatch(
        setPhotos({
          previewUrl: image,
          picture: file,
        })
      );
      router.push(`/add-question/${slug}`);
    } else {
      toast.error("Please select image first.");
    }
  };

  const handleFetchImage = async () => {
    if (imagePreview && imageFile) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await myAxios.post(
          `/ai/add-question?slug=${slug}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setResponse(response.data.data.qustions);
        setChapters(response.data.data.chapters);
        setSubject(response.data.data.subject);
      } catch (error) {
        toast.error("Unable to Perform.");
        // router.back();
      } finally {
        setLoading(false);
        // dispatch(resetPhotos());
      }
    } else {
      // dispatch(resetPhotos());
      toast.error("Unable to Perform.");
      // router.back();
    }
  };

  return {
    handleFileChange,
    handleFetchImage,
    image,
    setImage,
    handleContinue,
    imagePreview,
    loading,
    response,
    chapters,
    subject,
  };
}
