// schemas/orderDetail.schema.ts

import { z } from 'zod';

export const orderDetailSchema = z.object({
  order_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().min(1).positive(),
  unit_price: z.number().positive(),
});
