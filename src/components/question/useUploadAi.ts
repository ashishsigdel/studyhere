"use client";
import { resetPhotos, setPhotos } from "@/redux/features/aiUpload";
import { myAxios } from "@/services/apiServices";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function useUploadAi() {
  const [image, setImage] = useState<null | string>(null);
  const [file, setFile] = useState<null | File>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const imagePreview = useSelector((state: any) => state.aiupload.previewUrl);
  const imageFile = useSelector((state: any) => state.aiupload.picture);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState({});

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
      router.push("/add-question");
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

        const response = await myAxios.post("/ai/validate-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setResponse(response.data.data);
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
    image,
    setImage,
    handleContinue,
    imagePreview,
    handleFetchImage,
    loading,
    response,
  };
}
