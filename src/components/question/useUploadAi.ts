import React, { ChangeEvent, useState } from "react";

export default function useUploadAi() {
  const [image, setImage] = useState<null | string>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);

      setImage(url);
    }
  };
  return { handleFileChange, image, setImage };
}
