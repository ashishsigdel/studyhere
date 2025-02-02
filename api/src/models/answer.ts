import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Question from "./question";
import User from "./user";

@Table({
  tableName: "Answers",
  timestamps: true,
  paranoid: true,
})
class Answer extends Model {
  @Column({ autoIncrement: true, primaryKey: true, type: DataType.BIGINT })
  id!: number;

  @ForeignKey(() => Question)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: "Questions", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  questionId!: number;

  @Column({
    type: DataType.TEXT,
  })
  answer!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: "users", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
export default Answer;
