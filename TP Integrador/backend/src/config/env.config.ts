// // src/config/env.config.ts
// import { z } from 'zod';
// import dotenv from 'dotenv';

// dotenv.config();

// // const envSchema = z.object({
// //   // Database
// //   DB_NAME: z.string(),
// //   DB_USER: z.string(),
// //   DB_PASSWORD: z.string(),
// //   DB_HOST: z.string(),
// //   DB_PORT: z.string().default('5432'),

// //   // JWT
// //   JWT_SECRET: z.string(),
// //   JWT_EXPIRES_IN: z.string(),

// //   // Admin
// //   ADMIN_USERNAME: z.string().optional(),
// //   ADMIN_PASSWORD_HASH: z.string().optional(),

// //   // API KEY
// //   API_KEY: z.string(),
// // });


// // Neon NO necesita DB_HOST, DB_USER, etc.
// const envSchema = z.object({
//   DATABASE_URL: z.string().optional(),

//   DB_NAME: z.string().optional(),
//   DB_USER: z.string().optional(),
//   DB_PASSWORD: z.string().optional(),
//   DB_HOST: z.string().optional(),
//   DB_PORT: z.string().default('5432'),

//   JWT_SECRET: z.string(),
//   JWT_EXPIRES_IN: z.string(),
//   API_KEY: z.string(),
// });


// const env = envSchema.parse(process.env);

// export default env;

// backend/src/config/env.config.ts
import { z } from 'zod';
// TODO: quitar el dotenv de aca y usarlo solo en el config.js
//import dotenv from 'dotenv';

//dotenv.config();

// Si NODE_ENV no está definido, se toma development → intenta cargar .env.development.
// Como no existe .env.development pero sí hay un .env en la raíz, dotenv por defecto busca .env si el path que pasaste no existe.
//Por eso tus variables se resolvían aunque dotenv.config(); estuviera comentado.

// Carga el .env según NODE_ENV (para los test de integracion)
//dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// para ejecutar un test hay que usar NODE_ENV=test npx jest dentro de la carpeta backend

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
