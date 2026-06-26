import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@/generated/prisma";
import status from "http-status";
import AppError from "../errorHelpers/appError";
import { envVars } from "../config/envVars";

export const checkAuth =
  (...authRoles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No token provided."
        );
      }

      const token = authHeader.split(" ")[1];

      let decoded;
      try {
        decoded = jwt.verify(token, envVars.JWT_SECRET) as {
          userId: string;
          email: string;
          role: UserRole;
        };
      } catch (error) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid or expired token."
        );
      }

      if (authRoles.length > 0 && !authRoles.includes(decoded.role)) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource."
        );
      }

      req.user = decoded;
      next();
    } catch (error: any) {
      next(error);
    }
  };