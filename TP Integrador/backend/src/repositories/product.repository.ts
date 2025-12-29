// src/repositories/product.repository.ts
import { Product } from '../models/entity/product.model';
import { ProductInput } from '../dtos/product.dto';

export class ProductRepository {
  async create(data: ProductInput) {
    return await Product.create(data);
  }

  async getAll() {
    return await Product.findAll();
  }

  async getById(id: number) {
    return await Product.findByPk(id);
  }

  async update(id: number, data: Partial<ProductInput>) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(data); // Sequelize acepta campos parciales
  }

  async delete(id: number) {
    const product = await Product.findByPk(id);
    if (!product) return false;
    await product.destroy();
    return true;
  }
}

export default new ProductRepository();
