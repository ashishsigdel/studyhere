import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./user";

@Table({
  tableName: "RefreshTokens",
  timestamps: true,
})
class RefreshToken extends Model {
  @Column({ autoIncrement: true, primaryKey: true, type: DataType.BIGINT })
  id!: number;

  @Column({ type: DataType.TEXT })
  token!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    references: { model: "users", key: "id" },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  userId!: number;

  @Column({
    type: DataType.DATE,
  })
  expiresAt!: Date;

  @BelongsTo(() => User)
  user!: User;
}

export default RefreshToken;
