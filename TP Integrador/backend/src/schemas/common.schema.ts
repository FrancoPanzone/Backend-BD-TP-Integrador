// schemas/common.schema.ts
import { z } from 'zod';

// Para validar params con "id"
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number), // valida y convierte a number
});

// Otro ejemplo: para endpoints tipo /user/:userId
export const userIdParamSchema = z.object({
  userId: z.string().regex(/^\d+$/).transform(Number),
});

// Para query strings como /?limit=10&offset=20
export const paginationQuerySchema = z.object({
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
});
