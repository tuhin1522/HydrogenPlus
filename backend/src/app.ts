import express, { Application, Request, Response } from "express";
import cors from "cors";
import { indexRoutes } from "./app/routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1', indexRoutes);

// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;