// import { ItemCartInput } from '../dtos/itemCart.dto';
// import { ItemCart } from '../models/entity/itemCart.entity';
// import MockItemCart from '../models/implementations/mock/mockItemCart';
// import ProductService from './product.service';

// class ItemCartService {
//   async getAll(): Promise<ItemCart[]> {
//     return MockItemCart.getAll();
//   }

//   async getByItemId(itemId: number): Promise<ItemCart | undefined> {
//     return MockItemCart.getByItemId(itemId);
//   }

//   async getByCartId(cartId: number): Promise<ItemCart[]> {
//     return MockItemCart.getByCartId(cartId);
//   }

//   async getByProductId(productId: number): Promise<ItemCart[]> {
//     return MockItemCart.getByProductId(productId);
//   }

//   async create(itemC: ItemCartInput): Promise<ItemCart> {
//     const product = await ProductService.getById(itemC.product_id);
//     if (!product) throw new Error(`Producto con id ${itemC.product_id} no existe`);

//     return MockItemCart.create(itemC);
//   }

//   async delete(itemId: number): Promise<void> {
//     const deleted = await MockItemCart.delete(itemId);
//     if (!deleted) throw new Error(`Item carrito con id ${itemId} no existe`);
//   }

//   async clearByCartId(cartId: number): Promise<void> {
//     await MockItemCart.clearByCartId(cartId);
//   }
// }

// export default new ItemCartService();

// src/services/itemCart.service.ts
import { ItemCartInput } from '../dtos/itemCart.dto';
import ItemCartRepository from '../repositories/itemCart.repository';
import { ItemCart } from '../models/entity/itemCart.model';

import { Product } from '../models/entity/product.model'

class ItemCartService {
  private itemRepo = ItemCartRepository;

  async getAll(): Promise<ItemCart[]> {
    return await this.itemRepo.getAll();
  }

  async getByItemId(itemId: number): Promise<ItemCart | undefined> {
    const item = await this.itemRepo.getByItemId(itemId);
    return item ?? undefined;
  }

  async getByCartId(cartId: number): Promise<ItemCart[]> {
    return await this.itemRepo.getByCartId(cartId);
  }

  async getByProductId(productId: number): Promise<ItemCart[]> {
    return await this.itemRepo.getByProductId(productId);
  }

  // async create(data: ItemCartInput): Promise<ItemCart> {
  //   return await this.itemRepo.create(data);
  // }

  // usa el create del modelo directamente
  // async create(data: ItemCartInput): Promise<ItemCart> {
  //   const product = await Product.findByPk(data.product_id);
  //   if (!product) {
  //     throw new Error(`Producto con id ${data.product_id} no existe`);
  //   }

  //   return await ItemCart.create({
  //     cart_id: data.cart_id,
  //     product_id: data.product_id,
  //     quantity: data.quantity,
  //     unit_price: product.price, // toma el precio real del producto
  //   });
  // }

  // para que use el create del repo
  async create(data: ItemCartInput): Promise<ItemCart> {
    const product = await Product.findByPk(data.product_id);
    if (!product) throw new Error(`Producto con id ${data.product_id} no existe`);

    return this.itemRepo.create({
      ...data,
      unit_price: product.price,
    });
  }


  async delete(itemId: number): Promise<void> {
    const deleted = await this.itemRepo.delete(itemId);
    if (!deleted) throw new Error(`ItemCart con id ${itemId} no existe`);
  }

  async clearByCartId(cartId: number): Promise<void> {
    await this.itemRepo.clearByCartId(cartId);
  }
}

export default new ItemCartService();
