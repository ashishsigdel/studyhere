import { Column, DataType, Model, Table } from "sequelize-typescript";
@Table({
  tableName: "Subjects",
  timestamps: true,
  paranoid: true,
})
class Subject extends Model {
  @Column({ autoIncrement: true, primaryKey: true, type: DataType.BIGINT })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;
}
export default Subject;
