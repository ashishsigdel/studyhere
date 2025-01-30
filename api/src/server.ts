import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello world" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}!!!`);
});
