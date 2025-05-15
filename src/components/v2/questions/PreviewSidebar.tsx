"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PreviewSidebar() {
  const [previewImage, setPreviewImage] = useState("");
  const imagePreview = useSelector((state: any) => state.aiupload.previewUrl);

  useEffect(() => {
    setPreviewImage(imagePreview);
  }, []);

  return (
    <div className="min-[900px]:min-h-[250px]">
      {imagePreview && (
        <Image
          alt="image-uploading"
          src={imagePreview}
          width={300}
          height={500}
          className="w-full max-w-md mx-auto h-fit rounded-md"
        />
      )}
    </div>
  );
}
