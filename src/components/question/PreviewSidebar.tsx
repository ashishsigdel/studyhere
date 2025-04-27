"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function PreviewSidebar() {
  const [adLoaded, setAdLoaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const imagePreview = useSelector((state: any) => state.aiupload.previewUrl);

  useEffect(() => {
    setLoaded(true);
    setPreviewImage(imagePreview);
  }, []);

  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      const timeout = setTimeout(() => setAdLoaded(false), 3000);

      const observer = new MutationObserver(() => {
        setAdLoaded(true);
        clearTimeout(timeout);
      });

      const adElement = document.querySelector(".adsbygoogle");
      if (adElement) {
        observer.observe(adElement, { childList: true });
      }

      return () => {
        observer.disconnect();
        clearTimeout(timeout);
      };
    } catch (e) {
      console.error("AdSense error:", e);
      setAdLoaded(false);
    }
  }, []);

  if (!loaded) return null;

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
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9557309412103379"
        data-ad-slot="8236029305"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
