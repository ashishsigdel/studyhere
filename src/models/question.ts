import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Chapter from "./chapter";
@Table({
  tableName: "Questions",
  timestamps: true,
  paranoid: true,
})
class Question extends Model {
  @Column({ autoIncrement: true, primaryKey: true, type: DataType.BIGINT })
  id!: number;

  @ForeignKey(() => Chapter)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: "Chapters", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  chapterId!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  question!: string;

  @Column({
    type: DataType.TEXT,
  })
  answer!: string;

  @Column({
    type: DataType.STRING(100),
  })
  year!: string;

  @Column({
    type: DataType.STRING(10),
  })
  marks!: string;
}
export default Question;
