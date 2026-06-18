import { NextFunction, Request, Response } from "express";
import status from "http-status";
import z from "zod";
import { envVars } from "../config/envVars";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
// import { deleteFileFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log full error details for debugging
  if (envVars.NODE_ENV === "development") {
    console.log("❌ Error from global error handler:");
    console.log(JSON.stringify(err, null, 2));
    
    // Special logging for Cloudinary 403 errors
    if (err.http_code === 403 || err.message?.includes("403")) {
      console.error("🚨 CLOUDINARY 403 ERROR - This means your API credentials are INVALID or RESTRICTED");
      console.error("   Please verify your credentials in .env file match your Cloudinary account");
    }
  }

//   if (req.file) {
//     await deleteFileFromCloudinary(req.file.path);
//   }

//   if (req.files && Array.isArray(req.files) && req.files.length > 0) {
//     const imageUrls = req.files.map((file) => file.path);
//     await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url)));
//   }

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal server error";
  let stack: string | undefined = undefined;

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : undefined,
    stack: envVars.NODE_ENV === "development" ? stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};