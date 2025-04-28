"use client";
import { myAxios } from "@/services/apiServices";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function useSubjects() {
  const [subject, setSubject] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const [showForm, setShowForm] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const router = useRouter();

  const handleSaveSubject = async () => {
    if (!subject) {
      toast.error("Subject required!");
      return;
    }

    setLoadingAdd(true);
    try {
      if (navigator.onLine) {
        const response = await myAxios.post("/subject/create", {
          name: subject,
        });

        toast.success("Subject created");
        router.push(`/subject/${response.data.data.slug}`);
        setSubject("");
        setShowForm(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingAdd(false);
    }
  };
  return {
    subject,
    setSubject,
    showForm,
    setShowForm,
    loadingAdd,
    handleSaveSubject,
    user,
  };
}
