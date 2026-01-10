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
