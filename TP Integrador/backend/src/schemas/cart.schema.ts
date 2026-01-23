import { z } from 'zod';

export const cartSchema = z.object({
  user_id: z.number().int().positive(),
});
