import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import cors from "cors";

import sequelize from "./config/dbConfig";
import APIRoute from "./routes";
import ApiError from "./utils/apiError";
import { isAllowedOrigin } from "./utils/allowedOrigins";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API for studyhere." });
});

app.use("/api", APIRoute);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    new ApiError({
      status: 404,
      message: "URL Not Found",
      errors: [
        {
          message: `Cannot ${req.method} ${req.originalUrl}`,
        },
      ],
    })
  );
});

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message || "Internal Server Error!",
    errors: err.errors || null,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}!!!`);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: false, alter: false });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.log("An error occurred while starting the server:", error);
    process.exit(1);
  }
})();
