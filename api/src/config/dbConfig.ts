import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

import { applyAssociations } from "./association";
import Chapter from "../models/chapter";
import Question from "../models/question";
import Subject from "../models/subject";
import User from "../models/user";
import RefreshToken from "../models/refreshToken";
import Answer from "../models/answer";

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
  models: [Subject, Chapter, Question, User, RefreshToken, Answer],
});

applyAssociations();

export default sequelize;
