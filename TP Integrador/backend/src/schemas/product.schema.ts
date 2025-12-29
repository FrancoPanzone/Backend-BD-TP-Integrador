// src/schemas/product.schema.ts

import { z } from 'zod';

export const productInputSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  image: z.string().optional(), // ahora opcional, usara el placeholder
  category_id: z.number().int().positive('El category_id debe ser un número positivo'),
  stock: z.number().int().min(0, 'El stock debe ser entero y >= 0'),
  rating: z.number().min(0).max(5), // rating promedio, se puede validar entre 0 y 5
  brand: z.string().min(1, 'La marca es obligatoria'),
  description: z.string().min(1, 'La descripción es obligatoria'),
});

export const productUpdateSchema = productInputSchema.partial();
