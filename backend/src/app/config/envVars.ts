import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errorHelpers/appError";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  APP_URL: string;
  JWT_SECRET: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_SECURE: string;
  EMAIL_USER: string;
  EMAIL_PASS: string;
  EMAIL_FROM: string;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES: string;
  REFRESH_TOKEN_EXPIRES: string;

  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_PHONE: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "APP_URL",
    "JWT_SECRET",
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_SECURE",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_FROM",

    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES",
    "REFRESH_TOKEN_EXPIRES",

    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_PHONE",
  ];

  requiredVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `Environment vaiable ${variable} is required but not set in .env file!`,
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    APP_URL: process.env.APP_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    EMAIL_HOST: process.env.EMAIL_HOST as string,
    EMAIL_PORT: process.env.EMAIL_PORT as string,
    EMAIL_SECURE: process.env.EMAIL_SECURE as string,
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES as string,
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES as string,

    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
  };
};

export const envVars = loadEnvVariables();
