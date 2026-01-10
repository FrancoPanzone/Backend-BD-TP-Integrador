// para que use transacciones para los test de integracion, usamos schema public con transacciones
// src/repositories/user.repository.ts
import { User } from '../models/entity/user.model';
import { hash } from 'bcrypt';
import CartRepository from './cart.repository';
import { Transaction } from 'sequelize';
import bcrypt from 'bcrypt';

export class UserRepository {
  async create(data: Partial<User>, transaction: Transaction | null = null) {
    if (data.password) {
      data.password = await hash(data.password, 10);
    }

    const user = await User.create(data as any, { transaction });

    // Crear carrito automáticamente, también pasando transaction
    await CartRepository.getOrCreateCartForUser(user.user_id, transaction);

    return user;
  }

  async getAll(transaction: Transaction | null = null) {
    return User.findAll({ transaction });
  }

  async getById(id: number, transaction: Transaction | null = null) {
    return User.findByPk(id, { transaction });
  }

  async getByEmail(email: string, transaction: Transaction | null = null) {
    return User.findOne({ where: { email }, transaction });
  }

  // async update(id: number, data: Partial<User>, transaction: Transaction | null = null) {
  //   const user = await User.findByPk(id, { transaction });
  //   if (!user) return null;

  //   // Solo el repo hace hash si hay password
  //   if (data.password) {
  //     data.password = await hash(data.password, 10);
  //   }

  //   return user.update(data, { transaction });
  // }

  // async update(id: number, data: Partial<User>, transaction: Transaction | null = null) {
  //   const user = await User.findByPk(id, { transaction });
  //   if (!user) return null;

  //   // Solo hashea si la contraseña es nueva y distinta
  //   if (data.password && !(await bcrypt.compare(data.password, user.password))) {
  //     data.password = await hash(data.password, 10);
  //   }

  //   return user.update(data, { transaction });
  // }

  async update(id: number, data: Partial<User>, transaction: Transaction | null = null) {
    const user = await User.findByPk(id, { transaction });
    if (!user) return null;

    // Si viene contraseña en el update
    if (data.password) {
      data.password = data.password.trim(); // elimina espacios al inicio y fin
      const isSame = await bcrypt.compare(data.password, user.password);
      if (!isSame) {
        // Si es diferente, hashear antes de guardar
        data.password = await hash(data.password, 10);
      } else {
        delete data.password; // elimina el campo para no re-hashear
      }
    }
    // Actualizar usuario en la base de datos
    return user.update(data, { transaction });
  }


  async delete(id: number, transaction: Transaction | null = null) {
    const user = await User.findByPk(id, { transaction });
    if (!user) return false;

    await user.destroy({ transaction });
    return true;
  }
}

export default new UserRepository();

