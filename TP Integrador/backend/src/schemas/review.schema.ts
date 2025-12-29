// schemas/review.schema.ts

import { z } from 'zod';

export const reviewSchema = z.object({
  user_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  qualification: z.number().int().min(1).max(5),
  comment: z.string().min(3),
  date: z.coerce.date().optional(),
});
