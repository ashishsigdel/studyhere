import Chapter from "@/models/chapter";
import Question from "@/models/question";
import Subject from "@/models/subject";
import { Sequelize } from "sequelize-typescript";
import { applyAssociations } from "./association";

const sequelize: any = new Sequelize({
  host: "localhost",
  username: "root",
  password: "rocket5%",
  database: "exam",
  dialect: "mysql",
  dialectModule: require("mysql2"),
  logging: false,
  benchmark: true,
  models: [Subject, Chapter, Question],
});

applyAssociations();

export default async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    await sequelize.sync({ force: false, alter: false });
    console.log("All models synchronized.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { sequelize };
