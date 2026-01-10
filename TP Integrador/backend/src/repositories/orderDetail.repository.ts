// src/repositories/orderDetail.repository.ts
import { OrderDetail } from '../models/entity/orderDetail.model';
import { OrderDetailInput } from '../dtos/orderDetail.dto';
import { Transaction } from 'sequelize';

export class OrderDetailRepository {
  async getAll(transaction: Transaction | null = null): Promise<OrderDetail[]> {
    return OrderDetail.findAll({ transaction });
  }

  async getById(id: number, transaction: Transaction | null = null): Promise<OrderDetail | null> {
    return OrderDetail.findByPk(id, { transaction });
  }

  async getByOrderId(orderId: number, transaction: Transaction | null = null): Promise<OrderDetail[]> {
    return OrderDetail.findAll({
      where: { order_id: orderId },
      transaction,
    });
  }

  async getByProductId(productId: number, transaction: Transaction | null = null): Promise<OrderDetail[]> {
    return OrderDetail.findAll({
      where: { product_id: productId },
      transaction,
    });
  }

  async create(data: OrderDetailInput, transaction: Transaction | null = null): Promise<OrderDetail> {
    return OrderDetail.create(data, { transaction });
  }

  async update(id: number, data: Partial<OrderDetailInput>, transaction: Transaction | null = null): Promise<OrderDetail | null> {
    const orderDetail = await OrderDetail.findByPk(id, { transaction });
    if (!orderDetail) return null;
    return orderDetail.update(data, { transaction });
  }

  async delete(id: number, transaction: Transaction | null = null): Promise<boolean> {
    const orderDetail = await OrderDetail.findByPk(id, { transaction });
    if (!orderDetail) return false;
    await orderDetail.destroy({ transaction });
    return true;
  }
}

export default new OrderDetailRepository();

