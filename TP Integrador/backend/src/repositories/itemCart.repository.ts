// src/repositories/itemCart.repository.ts
// import { ItemCart } from '../models/entity/itemCart.model';
// import { ItemCartInput } from '../dtos/itemCart.dto';

// export interface ItemCartCreateData extends ItemCartInput {
//   unit_price: number;
// }

// export class ItemCartRepository {
//   async getAll(): Promise<ItemCart[]> {
//     return await ItemCart.findAll();
//   }

//   async getByItemId(itemId: number): Promise<ItemCart | null> {
//     return await ItemCart.findByPk(itemId);
//   }

//   async getByCartId(cartId: number): Promise<ItemCart[]> {
//     return await ItemCart.findAll({ where: { cart_id: cartId } });
//   }

//   async getByProductId(productId: number): Promise<ItemCart[]> {
//     return await ItemCart.findAll({ where: { product_id: productId } });
//   }

//   // async create(data: ItemCartInput): Promise<ItemCart> {
//   //   return await ItemCart.create(data);
//   // }

//   async create(data: ItemCartCreateData): Promise<ItemCart> {
//     return ItemCart.create(data);
//   }

//   async delete(itemId: number): Promise<boolean> {
//     const item = await ItemCart.findByPk(itemId);
//     if (!item) return false;
//     await item.destroy();
//     return true;
//   }

//   async clearByCartId(cartId: number): Promise<void> {
//     await ItemCart.destroy({ where: { cart_id: cartId } });
//   }
// }

// export default new ItemCartRepository();

// src/repositories/itemCart.repository.ts
import { ItemCart } from '../models/entity/itemCart.model';
import { ItemCartInput } from '../dtos/itemCart.dto';
import { Transaction } from 'sequelize';

export interface ItemCartCreateData extends ItemCartInput {
  unit_price: number;
}

export class ItemCartRepository {
  async getAll(transaction: Transaction | null = null): Promise<ItemCart[]> {
    return await ItemCart.findAll({ transaction });
  }

  async getByItemId(itemId: number, transaction: Transaction | null = null): Promise<ItemCart | null> {
    return await ItemCart.findByPk(itemId, { transaction });
  }

  async getByCartId(cartId: number, transaction: Transaction | null = null): Promise<ItemCart[]> {
    return await ItemCart.findAll({ where: { cart_id: cartId }, transaction });
  }

  async getByProductId(productId: number, transaction: Transaction | null = null): Promise<ItemCart[]> {
    return await ItemCart.findAll({ where: { product_id: productId }, transaction });
  }

  async create(data: ItemCartCreateData, transaction: Transaction | null = null): Promise<ItemCart> {
    return await ItemCart.create(data, { transaction });
  }

  async delete(itemId: number, transaction: Transaction | null = null): Promise<boolean> {
    const item = await ItemCart.findByPk(itemId, { transaction });
    if (!item) return false;
    await item.destroy({ transaction });
    return true;
  }

  async clearByCartId(cartId: number, transaction: Transaction | null = null): Promise<void> {
    await ItemCart.destroy({ where: { cart_id: cartId }, transaction });
  }
}

export default new ItemCartRepository();
