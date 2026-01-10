// src/services/product.service.ts
import ProductRepository from '../repositories/product.repository';
import { ProductInput } from '../dtos/product.dto';
import CategoryService from './category.service';
import { Product } from '../models/entity/product.model';
import { Transaction } from 'sequelize';

class ProductService {
  async getAll(transaction?: Transaction): Promise<Product[]> {
    return ProductRepository.getAll(transaction);
  }

  async getById(id: number, transaction?: Transaction): Promise<Product | null> {
    return ProductRepository.getById(id, transaction);
  }

  async create(data: ProductInput, transaction?: Transaction): Promise<Product> {
    const category = await CategoryService.getById(data.category_id, transaction);
    if (!category) throw new Error(`La categoría con id ${data.category_id} no existe`);

    const image = data.image || '/images/products/product-placeholder.webp';
    return ProductRepository.create({ ...data, image }, transaction);
  }

  async update(id: number, data: Partial<ProductInput>, transaction?: Transaction): Promise<Product | null> {
    if (data.category_id) {
      const category = await CategoryService.getById(data.category_id, transaction);
      if (!category) throw new Error(`La categoría con id ${data.category_id} no existe`);
    }

    return ProductRepository.update(id, data, transaction);
  }

  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    return ProductRepository.delete(id, transaction);
  }

  async decreaseStock(productId: number, quantity: number, transaction?: Transaction): Promise<Product> {
    const product = await this.getById(productId, transaction);
    if (!product) throw new Error('Producto no encontrado');
    if (product.stock < quantity) throw new Error('Stock insuficiente');

    const updated = await ProductRepository.update(productId, { stock: product.stock - quantity }, transaction);
    if (!updated) throw new Error('Error al actualizar el stock');
    return updated;
  }

  async increaseStock(productId: number, quantity: number, transaction?: Transaction): Promise<Product> {
    const product = await this.getById(productId, transaction);
    if (!product) throw new Error('Producto no encontrado');

    const updated = await ProductRepository.update(productId, { stock: product.stock + quantity }, transaction);
    if (!updated) throw new Error('Error al actualizar el stock');
    return updated;
  }
}

export default new ProductService();
