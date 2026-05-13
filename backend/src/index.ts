import express, { Express } from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import { PORT } from "./config/server.config.js";
import dbConnect from "./config/dbConnect.js";

const app: Express = express();

const start = async (): Promise<void> => {
  await dbConnect();

  // CORS FIRST
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://comfy-conkies-f0de1f.netlify.app",
        "https://e8sowkkwoswg40wo44g44s80.snapphoundtests.com",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRouter);

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
};

start();