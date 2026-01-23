// src/dtos/user.dto.ts
import { UserRole } from '../models/entity/user.model';

// DTO para creación de usuario
export type UserInput = {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: UserRole; // opcional, por defecto USER
};

// DTO para updates parciales
export type UserUpdate = Partial<Omit<UserInput, 'role'>> & { role?: UserRole };
