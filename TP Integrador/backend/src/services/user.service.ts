// src/services/user.service.ts
import { Transaction } from 'sequelize';
import { User, UserRole } from '../models/entity/user.model';
import { UserInput, UserUpdate } from '../dtos/user.dto';
import UserRepository from '../repositories/user.repository';
import bcrypt from 'bcrypt';

class UserService {
  // Devuelve todos los usuarios (solo para admin)
  async getAll(transaction?: Transaction): Promise<User[]> {
    return UserRepository.getAll(transaction);
  }

  // Obtiene un usuario por su ID
  async getById(id: number, transaction?: Transaction): Promise<User | null> {
    return UserRepository.getById(id, transaction);
  }

  // Busca usuario por email
  async getByEmail(email: string, transaction?: Transaction): Promise<User | null> {
    return UserRepository.getByEmail(email, transaction);
  }

  // Busca usuario por nombre
  async getByName(name: string, transaction?: Transaction): Promise<User | null> {
    const users = await UserRepository.getAll(transaction);
    return users.find((u) => u.name.toLowerCase() === name.toLowerCase()) || null;
  }

  // Crea un nuevo usuario
  async create(data: UserInput, transaction?: Transaction): Promise<User> {
    const existing = await this.getByEmail(data.email, transaction);
    if (existing) throw new Error('El email ya está registrado');

    // Pasamos la transacción al repo
    return UserRepository.create({ ...data, role: data.role ?? UserRole.USER }, transaction);
  }

  // Actualiza un usuario
  async update(id: number, data: UserUpdate, transaction?: Transaction): Promise<User | null> {
    // No hasheamos aquí, lo hace el repo
    // if (data.password) {
    //   data.password = await bcrypt.hash(data.password, 10);
    // }
    return UserRepository.update(id, data as Partial<User>, transaction);
  }

  // Elimina un usuario
  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    return UserRepository.delete(id, transaction);
  }
}

export default new UserService();
