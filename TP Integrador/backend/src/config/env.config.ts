// src/config/env.config.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Database
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string().default('5432'),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  // Admin
  ADMIN_USERNAME: z.string().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),

  // API KEY
  API_KEY: z.string(),
});

const env = envSchema.parse(process.env);

export default env;
