// src/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().min(3, { message: 'El nombre es demasiado corto' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
});
