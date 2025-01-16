import Chapter from "@/models/chapter";
import Question from "@/models/question";
import Subject from "@/models/subject";
import { Sequelize } from "sequelize-typescript";
import { applyAssociations } from "./association";

const sequelize: any = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logging: false,
  benchmark: true,
  models: [Subject, Chapter, Question],
});

applyAssociations();

export default async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ force: false, alter: true });
    console.log("All models synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { sequelize };
