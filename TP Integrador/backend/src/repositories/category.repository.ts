// src/repositories/category.repository.ts
import { Category } from '../models/entity/category.model';
import { CategoryInput } from '../dtos/category.dto';
import { Transaction } from 'sequelize';

export class CategoryRepository {
  // Crear categoría
  async create(data: CategoryInput, transaction: Transaction | null = null) {
    return await Category.create(data, { transaction });
  }

  // Traer todas las categorías
  async getAll(transaction: Transaction | null = null) {
    return await Category.findAll({ transaction });
  }

  // Traer categoría por ID
  async getById(id: number, transaction: Transaction | null = null) {
    return await Category.findByPk(id, { transaction });
  }

  // Actualizar categoría
  async update(id: number, data: Partial<CategoryInput>, transaction: Transaction | null = null) {
    const category = await Category.findByPk(id, { transaction });
    if (!category) return null;
    return await category.update(data, { transaction });
  }

  // Eliminar categoría
  async delete(id: number, transaction: Transaction | null = null) {
    const category = await Category.findByPk(id, { transaction });
    if (!category) return false;
    await category.destroy({ transaction });
    return true;
  }
}

export default new CategoryRepository();
