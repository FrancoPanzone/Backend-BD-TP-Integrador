// src/services/order.service.ts
import { Order, OrderStatus } from '../models/entity/order.model';
import { OrderInput } from '../dtos/order.dto';
import OrderRepository from '../repositories/order.repository';

import UserService from './user.service';
import CartService from './cart.service';
import ItemCartService from './itemCart.service';
import { Transaction } from 'sequelize';

class OrderService {
  private orderRepo = OrderRepository;

  private async validateUser(user_id: number, transaction?: Transaction) {
    const user = await UserService.getById(user_id, transaction);
    if (!user) throw new Error('Usuario no existe');
  }

  async getAll(transaction?: Transaction): Promise<Order[]> {
    return this.orderRepo.getAll(transaction ?? null);
  }

  async getById(id: number, transaction?: Transaction): Promise<Order> {
    const order = await this.orderRepo.getById(id, transaction ?? null);
    if (!order) throw new Error('Orden no encontrada');
    return order;
  }

  async getByUserId(user_id: number, transaction?: Transaction): Promise<Order[]> {
    return this.orderRepo.getByUserId(user_id, transaction ?? null);
  }

  async create(data: OrderInput, transaction?: Transaction): Promise<Order> {
    await this.validateUser(data.user_id, transaction);
    return this.orderRepo.create(data, transaction ?? null);
  }

  async checkout(user_id: number, transaction?: Transaction): Promise<Order> {
    await this.validateUser(user_id, transaction);

    const cart = await CartService.getCartByUserId(user_id, transaction);
    if (!cart) throw new Error('Carrito no encontrado');

    const cartItems = await ItemCartService.getByCartId(cart.cart_id, transaction);
    if (cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const order = await this.orderRepo.create(
      {
        user_id,
        items: cartItems.map((i) => ({
          productId: i.product_id,
          quantity: i.quantity,
        })),
      },
      transaction ?? null,
    );

    await ItemCartService.clearByCartId(cart.cart_id, transaction);
    return order;
  }

  // en este el vacio del carrito se llama en el order repo
  // async checkout(
  //   user_id: number,
  //   transaction: Transaction | null = null
  // ): Promise<Order> {
  //   const t = transaction ?? await sequelize.transaction();

  //   try {
  //     await this.validateUser(user_id, t);

  //     const cart = await CartService.getCartByUserId(user_id, t);
  //     if (!cart) {
  //       throw new Error(`El usuario ${user_id} no tiene carrito`);
  //     }

  //     const cartItems = await ItemCartService.getByCartId(cart.cart_id, t);
  //     if (!cartItems || cartItems.length === 0) {
  //       throw new Error('El carrito está vacío');
  //     }

  //     // Crear orden + vaciar carrito dentro del repo (rama A)
  //     const order = await this.orderRepo.create(
  //       {
  //         user_id,
  //         cart_id: cart.cart_id, // CLAVE
  //         items: cartItems.map(i => ({
  //           productId: i.product_id,
  //           quantity: i.quantity,
  //         })),
  //       },
  //       t
  //     );

  //     if (!transaction) {
  //       await t.commit();
  //     }

  //     return order;
  //   } catch (error) {
  //     if (!transaction) {
  //       await t.rollback();
  //     }
  //     throw error;
  //   }
  // }

  async updateStatus(id: number, status: OrderStatus, transaction?: Transaction): Promise<Order> {
    const order = await this.orderRepo.getById(id, transaction);
    if (!order) throw new Error('Orden no encontrada');

    if (order.status === 'cancel') {
      throw new Error('No se puede modificar una orden cancelada');
    }

    return this.orderRepo.updateStatus(order, status, transaction);
  }

  async delete(id: number, transaction?: Transaction): Promise<void> {
    const deleted = await this.orderRepo.delete(id, transaction ?? null);
    if (!deleted) throw new Error('Orden no encontrada');
  }
}

export default new OrderService();
