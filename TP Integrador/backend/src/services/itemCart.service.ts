// src/services/itemCart.service.ts
import { ItemCartInput } from '../dtos/itemCart.dto';
import ItemCartRepository from '../repositories/itemCart.repository';
import { ItemCart } from '../models/entity/itemCart.model';
import { Product } from '../models/entity/product.model';
import { Transaction } from 'sequelize';

import { Cart } from '../models/entity/cart.model';

import CartService from './cart.service';

class ItemCartService {
  private itemRepo = ItemCartRepository;

  // async create(data: ItemCartInput, transaction: Transaction | null = null): Promise<ItemCart> {
  //   const product = await Product.findByPk(data.product_id, { transaction });
  //   if (!product) throw new Error(`Producto con id ${data.product_id} no existe`);

  //   return this.itemRepo.create(
  //     {
  //       ...data,
  //       unit_price: product.price,
  //     },
  //     transaction,
  //   );
  // }

  async create(data: ItemCartInput, transaction: Transaction | null = null): Promise<ItemCart> {
    const cart = await CartService.getById(data.cart_id, transaction || undefined);
    if (!cart) {
      throw new Error(`Carrito con id ${data.cart_id} no existe`);
    }

    const product = await Product.findByPk(data.product_id, { transaction });
    if (!product) {
      throw new Error(`Producto con id ${data.product_id} no existe`);
    }

    return this.itemRepo.create(
      {
        ...data,
        unit_price: product.price,
      },
      transaction,
    );
  }

  async delete(itemId: number, transaction: Transaction | null = null): Promise<void> {
    const deleted = await this.itemRepo.delete(itemId, transaction);
    if (!deleted) throw new Error(`ItemCart con id ${itemId} no existe`);
  }

  async clearByCartId(cartId: number, transaction: Transaction | null = null): Promise<void> {
    await this.itemRepo.clearByCartId(cartId, transaction);
  }

  async getByItemId(
    itemId: number,
    transaction: Transaction | null = null,
  ): Promise<ItemCart | undefined> {
    const item = await this.itemRepo.getByItemId(itemId, transaction);
    return item ?? undefined;
  }

  async getByCartId(cartId: number, transaction: Transaction | null = null): Promise<ItemCart[]> {
    return await this.itemRepo.getByCartId(cartId, transaction);
  }

  async getByProductId(
    productId: number,
    transaction: Transaction | null = null,
  ): Promise<ItemCart[]> {
    return await this.itemRepo.getByProductId(productId, transaction);
  }

  async getAll(transaction: Transaction | null = null): Promise<ItemCart[]> {
    return await this.itemRepo.getAll(transaction);
  }
}

export default new ItemCartService();
