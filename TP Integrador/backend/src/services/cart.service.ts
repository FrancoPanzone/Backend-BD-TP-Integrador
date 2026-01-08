// import { CartInput } from '../dtos/cart.dto';
// import MockCartModel from '../models/implementations/mock/mockCart';
// import { Cart } from './../models/entity/cart.entity';

// class CartService {
//   async getAll(): Promise<Cart[]> {
//     return MockCartModel.getAll();
//   }
//   async getById(id: number): Promise<Cart | undefined> {
//     return MockCartModel.getById(id);
//   }
//   async getCartByUserId(userId: number): Promise<Cart | undefined> {
//     return MockCartModel.getCartByUserId(userId);
//   }
//   async create(cart: CartInput): Promise<Cart> {
//     return MockCartModel.create(cart);
//   }

//   async delete(id: number): Promise<void> {
//     const deleted = await MockCartModel.delete(id);
//     if (!deleted) {
//       throw new Error(`El carrito con id ${id} no existe`);
//     }
//   }
// }

// export default new CartService();

// src/services/cart.service.ts
// import { CartInput } from '../dtos/cart.dto';
// import CartRepository from '../repositories/cart.repository';
// import { Cart } from '../models/entity/cart.model';

// class CartService {
//   private cartRepo = CartRepository;

//   async getAll(): Promise<Cart[]> {
//     return await this.cartRepo.getAll();
//   }

//   async getById(id: number): Promise<Cart | undefined> {
//     const cart = await this.cartRepo.getById(id);
//     return cart ?? undefined;
//   }

//   async getCartByUserId(userId: number): Promise<Cart | undefined> {
//     const cart = await this.cartRepo.getCartByUserId(userId);
//     return cart ?? undefined;
//   }

//   async getOrCreateCartForUser(userId: number): Promise<Cart> {
//     return await this.cartRepo.getOrCreateCartForUser(userId);
//   }

//   async create(cart: CartInput): Promise<Cart> {
//     return await this.cartRepo.create(cart);
//   }

//   async delete(id: number): Promise<void> {
//     const deleted = await this.cartRepo.delete(id);
//     if (!deleted) {
//       throw new Error(`El carrito con id ${id} no existe`);
//     }
//   }

//   async deleteByUserId(userId: number): Promise<void> {
//     const deleted = await this.cartRepo.deleteByUserId(userId);
//     if (!deleted) {
//       throw new Error(`El carrito del usuario ${userId} no existe`);
//     }
//   }
// }

// export default new CartService();

// src/services/cart.service.ts
import { CartInput } from '../dtos/cart.dto';
import CartRepository from '../repositories/cart.repository';
import { Cart } from '../models/entity/cart.model';
import { Transaction } from 'sequelize';

class CartService {
  private cartRepo = CartRepository;

  async getAll(transaction?: Transaction): Promise<Cart[]> {
    return await this.cartRepo.getAll(transaction ?? null);
  }

  async getById(id: number, transaction?: Transaction): Promise<Cart | undefined> {
    const cart = await this.cartRepo.getById(id, transaction ?? null);
    return cart ?? undefined;
  }

  async getCartByUserId(userId: number, transaction?: Transaction): Promise<Cart | undefined> {
    const cart = await this.cartRepo.getCartByUserId(userId, transaction ?? null);
    return cart ?? undefined;
  }

  async getOrCreateCartForUser(userId: number, transaction?: Transaction): Promise<Cart> {
    return await this.cartRepo.getOrCreateCartForUser(userId, transaction ?? null);
  }

  async create(cart: CartInput, transaction?: Transaction): Promise<Cart> {
    return await this.cartRepo.create(cart, transaction ?? null);
  }

  async delete(id: number, transaction?: Transaction): Promise<void> {
    const deleted = await this.cartRepo.delete(id, transaction ?? null);
    if (!deleted) {
      throw new Error(`El carrito con id ${id} no existe`);
    }
  }

  async deleteByUserId(userId: number, transaction?: Transaction): Promise<void> {
    const deleted = await this.cartRepo.deleteByUserId(userId, transaction ?? null);
    if (!deleted) {
      throw new Error(`El carrito del usuario ${userId} no existe`);
    }
  }
}

export default new CartService();
