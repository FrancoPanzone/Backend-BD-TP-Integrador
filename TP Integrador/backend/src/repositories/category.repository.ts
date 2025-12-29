import { Category } from '../models/entity/category.model';
import { CategoryInput } from '../dtos/category.dto';

export class CategoryRepository {
  async create(data: CategoryInput) {
    return await Category.create(data); // Inserta en PostgreSQL
  }

  async getAll() {
    return await Category.findAll();
  }

  async getById(id: number) {
    return await Category.findByPk(id);
  }

//   async update(id: number, data: CategoryInput) {
//     const category = await Category.findByPk(id);
//     if (!category) return null;
//     return await category.update(data);
//   }
async update(id: number, data: Partial<CategoryInput>) { // <-- Partial
    const category = await Category.findByPk(id);
    if (!category) return null;
    return category.update(data); // Sequelize acepta campos parciales
  }

  async delete(id: number) {
    const category = await Category.findByPk(id);
    if (!category) return false;
    await category.destroy();
    return true;
  }
}

export default new CategoryRepository();