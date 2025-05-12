"use client";
import { myAxios } from "@/services/apiServices";
import { useState } from "react";

export default function useAnswers() {
  const [question, setQuestion] = useState<any>({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnswers = async (id: number) => {
    setLoading(true);
    try {
      const response = await myAxios.get(`/answer/get-all/${id}`);
      setQuestion(response.data.data.question);
      setAnswers(response.data.data.answers);
    } catch (error: any) {
      console.log(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return {
    question,
    loading,
    allAnswers: answers,
    setAnswers,
    fetchAnswers,
  };
}
