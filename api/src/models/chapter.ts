import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import Subject from "./subject";
import Question from "./question";
@Table({
  tableName: "Chapters",
  timestamps: true,
  paranoid: true,
})
class Chapter extends Model {
  @Column({ autoIncrement: true, primaryKey: true, type: DataType.BIGINT })
  id!: number;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: "Subjects", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  subjectId!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @HasMany(() => Question)
  questions!: Question[];
}
export default Chapter;
