import z from "zod";

import status from "http-status";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod validation error!";
    const errorSources : TErrorSources[] = [];

    err.issues.forEach((issue) => {
      errorSources.push({
        path: issue.path.join(" "),
        message: issue.message,
      });
    });

    return {
        success: false,
        message,
        errorSources,
        statusCode,
    }
};