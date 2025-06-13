export type SubjectType = {
  id: number;
  name: string;
  slug: string;
  semester: string;
  faculties: string;
  createdBy: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  visibility: "public" | "private" | "view-only";
};
