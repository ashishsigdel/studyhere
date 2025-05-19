"use client";
import { myAxios } from "@/services/apiServices";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function useSubjects() {
  const [formData, setFormData] = useState({
    name: "",
    faculties: [],
    semester: "",
    isPrivate: false,
  });

  const user = useSelector((state: any) => state.auth.user);
  const [showForm, setShowForm] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const router = useRouter();

  const handleSaveSubject = async () => {
    if (!formData.name) {
      toast.error("Subject required!");
      return;
    }

    setLoadingAdd(true);
    try {
      if (navigator.onLine) {
        const response = await myAxios.post("/subject/create", formData);

        toast.success("Subject created");
        router.push(`/subject/${response.data.data.slug}`);
        setFormData({
          name: "",
          faculties: [],
          semester: "",
          isPrivate: false,
        });
        setShowForm(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingAdd(false);
    }
  };
  return {
    formData,
    setFormData,
    showForm,
    setShowForm,
    loadingAdd,
    handleSaveSubject,
    user,
  };
}
