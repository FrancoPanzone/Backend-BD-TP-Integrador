/* import { CategoryInput } from '../dtos/category.dto';
import { Category } from '../models/entity/category.entity';
import MockCategory from '../models/implementations/mock/mockCategory';

export class CategoryService {
  async getAll(): Promise<Category[]> {
    return MockCategory.getAll();
  }

  async getById(id: number): Promise<Category> {
    const category = await MockCategory.getById(id);
    if (!category) {
      throw new Error(`La categoría con id ${id} no existe`);
    }
    return category;
  }

  async create(data: Omit<CategoryInput, 'category_id'>): Promise<Category> {
    return MockCategory.create(data);
  }

  async update(id: number, data: Partial<CategoryInput>): Promise<Category | undefined> {
    const updated = await MockCategory.update(id, data);
    if (!updated) throw new Error(`La categoría con id ${id} no existe`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await MockCategory.delete(id);
    if (!deleted) throw new Error(`La categoría con id ${id} no existe`);
  }
}

export default new CategoryService(); */

// src/services/category.service.ts
import { CategoryInput } from '../dtos/category.dto';
import CategoryRepository from '../repositories/category.repository';
import { Category } from '../models/entity/category.model';

export class CategoryService {
  private categoryRepo = CategoryRepository;

  async getAll(): Promise<Category[]> {
    return this.categoryRepo.getAll();
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categoryRepo.getById(id);
    if (!category) {
      throw new Error(`La categoría con id ${id} no existe`);
    }
    return category;
  }

  async create(data: Omit<CategoryInput, 'category_id'>): Promise<Category> {
    return this.categoryRepo.create(data);
  }

  async update(id: number, data: Partial<CategoryInput>): Promise<Category> {
    const updated = await this.categoryRepo.update(id, data);
    if (!updated) {
      throw new Error(`La categoría con id ${id} no existe`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.categoryRepo.delete(id);
    if (!deleted) {
      throw new Error(`La categoría con id ${id} no existe`);
    }
  }
}

export default new CategoryService();
