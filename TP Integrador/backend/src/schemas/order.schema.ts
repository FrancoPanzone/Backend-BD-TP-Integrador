// src/schemas/order.schema.ts
import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const orderInputSchema = z.object({
  user_id: z.number().int().positive(),
  total: z.number().min(0),
  order_date: z.coerce.date(), // acepta string y lo convierte a Date
  items: z.array(orderItemSchema).nonempty(), // obligatorio al menos un item
});

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'cancel']),
});
