import { z } from 'zod';

export const itemCartSchema = z.object({
  cart_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().min(1), // debe tener al menos 1 de cantidad
});
