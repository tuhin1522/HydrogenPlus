import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

// Routes
// app.use("/api/v1/users", userRoutes);

export default app;