"use client";
import { myAxios } from "@/services/apiServices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useQuestionPage() {
  const [question, setQuestion] = useState<any>({});
  const [answers, setAnswers] = useState([]);
  const params = useParams<{ questionId: string }>();
  const [loading, setLoading] = useState(false);
  const id = params.questionId;

  useEffect(() => {
    const fetchAnswers = async () => {
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
    fetchAnswers();
  }, []);
  return {
    question,
    loading,
    answers,
    setAnswers,
  };
}
