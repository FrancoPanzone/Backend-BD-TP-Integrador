// src/services/category.service.ts
import { CategoryInput } from '../dtos/category.dto';
import CategoryRepository from '../repositories/category.repository';
import { Category } from '../models/entity/category.model';
import { Transaction } from 'sequelize';

export class CategoryService {
  private categoryRepo = CategoryRepository;

  // Obtener todas las categorías, opcionalmente en una transacción
  async getAll(transaction?: Transaction): Promise<Category[]> {
    return this.categoryRepo.getAll(transaction);
  }

  // Obtener categoría por ID con transacción opcional
  async getById(id: number, transaction?: Transaction): Promise<Category> {
    const category = await this.categoryRepo.getById(id, transaction);
    if (!category) throw new Error(`La categoría con id ${id} no existe`);
    return category;
  }

  // Crear categoría con transacción opcional
  async create(
    data: Omit<CategoryInput, 'category_id'>,
    transaction?: Transaction,
  ): Promise<Category> {
    return this.categoryRepo.create(data, transaction);
  }

  // Actualizar categoría con transacción opcional
  async update(
    id: number,
    data: Partial<CategoryInput>,
    transaction?: Transaction,
  ): Promise<Category> {
    const updated = await this.categoryRepo.update(id, data, transaction);
    if (!updated) throw new Error(`La categoría con id ${id} no existe`);
    return updated;
  }

  // Eliminar categoría con transacción opcional
  async delete(id: number, transaction?: Transaction): Promise<void> {
    const deleted = await this.categoryRepo.delete(id, transaction);
    if (!deleted) throw new Error(`La categoría con id ${id} no existe`);
  }
}

export default new CategoryService();
