import { z } from 'zod';

export const userInputSchema = z.object({
  name: z.string().min(2),
  email: z.email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6),
  address: z.string().min(5),
  role: z.enum(['ADMIN', 'USER']).optional(), // opcional: por defecto USER
});

export const userUpdateSchema = userInputSchema.partial(); // todos opcionales

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID debe ser un número válido'),
});
