import { z } from 'zod';

export const CategorySchema = z.object({
  //category_id: z.number().int().positive(),
  name: z.string().min(2),
  description: z.string().min(3),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(3).optional(),
});
