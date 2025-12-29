// src/repositories/user.repository.ts
import { User, UserRole } from '../models/entity/user.model';
import { hash } from 'bcrypt';
import CartRepository from './cart.repository'; // Si querés crear cart automáticamente

export class UserRepository {
  async create(data: Partial<User>) {
    if (data.password) {
      data.password = await hash(data.password, 10); // hashea password
    }

    const user = await User.create(data as any);

    // Crear carrito automáticamente
    await CartRepository.getOrCreateCartForUser(user.user_id);

    return user;
  }

  async getAll() {
    return User.findAll();
  }

  async getById(id: number) {
    return User.findByPk(id);
  }

  async getByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async update(id: number, data: Partial<User>) {
    const user = await User.findByPk(id);
    if (!user) return null;

    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    return user.update(data);
  }

  async delete(id: number) {
    const user = await User.findByPk(id);
    if (!user) return false;

    await user.destroy();
    return true;
  }
}

export default new UserRepository();
