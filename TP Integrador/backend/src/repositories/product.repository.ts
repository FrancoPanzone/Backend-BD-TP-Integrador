// // src/repositories/product.repository.ts
// import { Product } from '../models/entity/product.model';
// import { ProductInput } from '../dtos/product.dto';

// export class ProductRepository {
//   async create(data: ProductInput) {
//     return await Product.create(data);
//   }

//   async getAll() {
//     return await Product.findAll();
//   }

//   async getById(id: number) {
//     return await Product.findByPk(id);
//   }

//   async update(id: number, data: Partial<ProductInput>) {
//     const product = await Product.findByPk(id);
//     if (!product) return null;
//     return await product.update(data); // Sequelize acepta campos parciales
//   }

//   async delete(id: number) {
//     const product = await Product.findByPk(id);
//     if (!product) return false;
//     await product.destroy();
//     return true;
//   }
// }

// export default new ProductRepository();

// src/repositories/product.repository.ts
import { Product } from '../models/entity/product.model';
import { ProductInput } from '../dtos/product.dto';
import { Transaction } from 'sequelize';

export class ProductRepository {
  async create(data: ProductInput, transaction: Transaction | null = null) {
    return Product.create(data, { transaction });
  }

  async getAll(transaction: Transaction | null = null) {
    return Product.findAll({ transaction });
  }

  async getById(id: number, transaction: Transaction | null = null) {
    return Product.findByPk(id, { transaction });
  }

  async update(id: number, data: Partial<ProductInput>, transaction: Transaction | null = null) {
    const product = await Product.findByPk(id, { transaction });
    if (!product) return null;
    return product.update(data, { transaction });
  }

  async delete(id: number, transaction: Transaction | null = null) {
    const product = await Product.findByPk(id, { transaction });
    if (!product) return false;
    await product.destroy({ transaction });
    return true;
  }
}

export default new ProductRepository();
