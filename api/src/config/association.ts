import Subject from "../models/subject";
import Chapter from "../models/chapter";
import Question from "../models/question";
import User from "../models/user";

export function applyAssociations() {
  // One-to-Many: Subject has many Chapters
  Subject.hasMany(Chapter, { as: "chapters", foreignKey: "subjectId" });

  // Many-to-One: Chapter belongs to Subject
  Chapter.belongsTo(Subject, { as: "subject", foreignKey: "subjectId" });
}
