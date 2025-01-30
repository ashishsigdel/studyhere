import { Column, DataType, Model, Table } from "sequelize-typescript";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Table({
  tableName: "users",
  timestamps: true,
  paranoid: true,
})
class User extends Model {
  @Column({ autoIncrement: true, primaryKey: true, type: DataType.BIGINT })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  fullName!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: true,
  })
  profilePic!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER,
  })
  role!: UserRole;
}

export default User;
export { UserRole };
