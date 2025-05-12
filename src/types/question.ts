import { User } from "./user";

export type QuestionType = {
  id: number;
  question: string;
  year?: string;
  marks?: string;
};

export type AnswerType = {
  id: number;
  answer: string;
  TotalLikes: number;
  isLiked: boolean;
  createdAt: Date;
  user: {
    id: number;
    fullName: string;
    profilePic: string;
    role: string;
    deletedAt: Date;
  };
};
