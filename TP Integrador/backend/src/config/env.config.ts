// backend/src/config/env.config.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),

  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().default('5432'),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  API_KEY: z.string(),
}).refine(
  (data) => data.DATABASE_URL || (data.DB_NAME && data.DB_USER && data.DB_PASSWORD && data.DB_HOST),
  {
    message:
      'Si DATABASE_URL no está definido, DB_NAME, DB_USER, DB_PASSWORD y DB_HOST deben estar presentes',
  }
);

const env = envSchema.parse(process.env);

export default env;
