// // src/services/product.service.ts

// import MockProductModel from '../models/implementations/mock/mockProduct';
// import { Product } from '../models/entity/product.entity';
// import { ProductUpdate, ProductInput } from '../dtos/product.dto';
// import CategoryService from './category.service';

// class ProductService {
//   async getAll(): Promise<Product[]> {
//     return MockProductModel.getAll();
//   }

//   async getById(id: number): Promise<Product | undefined> {
//     return MockProductModel.getById(id);
//   }

//   // verifica que la categoria existe
//   /* async create(data: ProductInput): Promise<Product> {
//     const category = await CategoryService.getById(data.category_id);
//     if (!category) {
//       throw new Error(`La categoría con id ${data.category_id} no existe`);
//     }

//     return MockProductModel.create(data);
//   } */

//   // verifica que la categoria existe y si no hay imagen usa placeholder
//   async create(data: ProductInput): Promise<Product> {
//     const category = await CategoryService.getById(data.category_id);
//     if (!category) {
//       throw new Error(`La categoría con id ${data.category_id} no existe`);
//     }

//     // Si no hay imagen, usar el placeholder
//     const image = data.image || '/images/products/product-placeholder.webp';

//     return MockProductModel.create({ ...data, image });
//   }

//   // verifica que la categoria existe
//   async update(id: number, data: ProductUpdate): Promise<Product | undefined> {
//     if (data.category_id) {
//       const category = await CategoryService.getById(data.category_id);
//       if (!category) {
//         throw new Error(`La categoría con id ${data.category_id} no existe`);
//       }
//     }
//     return MockProductModel.update(id, data);
//   }

//   async delete(id: number): Promise<boolean> {
//     return MockProductModel.delete(id);
//   }

//   // Manejo del stock (lo usariamos en ordenes)
//   async decreaseStock(productId: number, quantity: number): Promise<Product | undefined> {
//     const product = await this.getById(productId);
//     if (!product) throw new Error('Producto no encontrado');
//     if (product.stock < quantity) throw new Error('Stock insuficiente');

//     return MockProductModel.update(productId, { stock: product.stock - quantity });
//   }

//   async increaseStock(productId: number, quantity: number): Promise<Product | undefined> {
//     const product = await this.getById(productId);
//     if (!product) throw new Error('Producto no encontrado');

//     return MockProductModel.update(productId, { stock: product.stock + quantity });
//   }
// }

// export default new ProductService();


// src/services/product.service.ts
import ProductRepository from '../repositories/product.repository';
import { ProductInput, ProductUpdate } from '../dtos/product.dto';
import CategoryService from './category.service';
import { Product } from '../models/entity/product.model';

class ProductService {
  async getAll(): Promise<Product[]> {
    return ProductRepository.getAll();
  }

  async getById(id: number): Promise<Product | null> {
    return ProductRepository.getById(id);
  }

  // verifica que la categoria existe
  async create(data: ProductInput): Promise<Product> {
    const category = await CategoryService.getById(data.category_id);
    if (!category) {
      throw new Error(`La categoría con id ${data.category_id} no existe`);
    }

    const image = data.image || '/images/products/product-placeholder.webp';

    return ProductRepository.create({ ...data, image });
  }

  // verifica que la categoria existe
  async update(id: number, data: Partial<ProductInput>): Promise<Product | null> {
    if (data.category_id) {
      const category = await CategoryService.getById(data.category_id);
      if (!category) {
        throw new Error(`La categoría con id ${data.category_id} no existe`);
      }
    }

    return ProductRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    return ProductRepository.delete(id);
  }

  // Manejo del stock (lo usariamos en ordenes)
  async decreaseStock(productId: number, quantity: number): Promise<Product> {
    const product = await this.getById(productId);
    if (!product) throw new Error('Producto no encontrado');
    if (product.stock < quantity) throw new Error('Stock insuficiente');

    const updated = await ProductRepository.update(productId, { stock: product.stock - quantity });
    if (!updated) throw new Error('Error al actualizar el stock');
    return updated;
  }

  async increaseStock(productId: number, quantity: number): Promise<Product> {
    const product = await this.getById(productId);
    if (!product) throw new Error('Producto no encontrado');

    const updated = await ProductRepository.update(productId, { stock: product.stock + quantity });
    if (!updated) throw new Error('Error al actualizar el stock');
    return updated;
  }
}

export default new ProductService();
