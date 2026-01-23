// src/repositories/cart.repository.ts
// import { Cart } from '../models/entity/cart.model';
// import { CartInput } from '../dtos/cart.dto';
// import { ItemCart } from '../models/entity/itemCart.model';

// export class CartRepository {
//   // Devuelve todos los carritos
//   async getAll(): Promise<Cart[]> {
//     return await Cart.findAll({
//       include: [{ model: ItemCart, as: 'items' }],
//     });
//   }

//   // Devuelve un carrito por su ID
//   async getById(cartId: number): Promise<Cart | null> {
//     return await Cart.findByPk(cartId, {
//       include: [{ model: ItemCart, as: 'items' }],
//     });
//   }

//   // Devuelve un carrito por el user_id
//   async getCartByUserId(userId: number): Promise<Cart | null> {
//     return await Cart.findOne({
//       where: { user_id: userId },
//       include: [{ model: ItemCart, as: 'items' }],
//     });
//   }

//   // Crea un carrito (si ya existe, devuelve el existente)
//   async getOrCreateCartForUser(userId: number): Promise<Cart> {
//     const existing = await this.getCartByUserId(userId);
//     if (existing) return existing;

//     return await Cart.create({ user_id: userId });
//   }

//   // Crea un carrito directamente
//   async create(data: CartInput): Promise<Cart> {
//     return await Cart.create(data);
//   }

//   // Elimina un carrito por ID
//   async delete(cartId: number): Promise<boolean> {
//     const cart = await Cart.findByPk(cartId);
//     if (!cart) return false;
//     await cart.destroy();
//     return true;
//   }

//   // Elimina un carrito por user_id
//   async deleteByUserId(userId: number): Promise<boolean> {
//     const cart = await Cart.findOne({ where: { user_id: userId } });
//     if (!cart) return false;
//     await cart.destroy();
//     return true;
//   }
// }

// export default new CartRepository();

// src/repositories/cart.repository.ts
import { Cart } from '../models/entity/cart.model';
import { CartInput } from '../dtos/cart.dto';
import { ItemCart } from '../models/entity/itemCart.model';
import { Transaction } from 'sequelize';

export class CartRepository {
  // Devuelve todos los carritos
  async getAll(transaction: Transaction | null = null): Promise<Cart[]> {
    return Cart.findAll({
      include: [{ model: ItemCart, as: 'items' }],
      transaction,
    });
  }

  // Devuelve un carrito por su ID
  async getById(cartId: number, transaction: Transaction | null = null): Promise<Cart | null> {
    return Cart.findByPk(cartId, {
      include: [{ model: ItemCart, as: 'items' }],
      transaction,
    });
  }

  // Devuelve un carrito por el user_id
  async getCartByUserId(userId: number, transaction: Transaction | null = null): Promise<Cart | null> {
    return Cart.findOne({
      where: { user_id: userId },
      include: [{ model: ItemCart, as: 'items' }],
      transaction,
    });
  }

  // Crea un carrito (si ya existe, devuelve el existente)
  async getOrCreateCartForUser(userId: number, transaction: Transaction | null = null): Promise<Cart> {
    const existing = await this.getCartByUserId(userId, transaction);
    if (existing) return existing;

    return Cart.create({ user_id: userId }, { transaction });
  }

  // Crea un carrito directamente
  async create(data: CartInput, transaction: Transaction | null = null): Promise<Cart> {
    return Cart.create(data, { transaction });
  }

  // Elimina un carrito por ID
  async delete(cartId: number, transaction: Transaction | null = null): Promise<boolean> {
    const cart = await Cart.findByPk(cartId, { transaction });
    if (!cart) return false;
    await cart.destroy({ transaction });
    return true;
  }

  // Elimina un carrito por user_id
  async deleteByUserId(userId: number, transaction: Transaction | null = null): Promise<boolean> {
    const cart = await Cart.findOne({ where: { user_id: userId }, transaction });
    if (!cart) return false;
    await cart.destroy({ transaction });
    return true;
  }
}

export default new CartRepository();
