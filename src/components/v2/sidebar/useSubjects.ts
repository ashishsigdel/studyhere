"use client";
import { myAxios } from "@/services/apiServices";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useSubjects() {
  const [formData, setFormData] = useState({
    name: "",
    faculties: [],
    semester: "",
    isPrivate: false,
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
  }, []);

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
