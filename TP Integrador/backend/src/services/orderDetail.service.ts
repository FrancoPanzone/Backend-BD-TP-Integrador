// src/services/orderDetail.service.ts
import { Transaction } from 'sequelize';
import OrderDetailRepository from '../repositories/orderDetail.repository';
import { OrderDetail } from '../models/entity/orderDetail.model';
import { OrderDetailInput } from '../dtos/orderDetail.dto';

class OrderDetailService {
  async getAll(transaction?: Transaction): Promise<OrderDetail[]> {
    return OrderDetailRepository.getAll(transaction ?? null);
  }

  async getById(id: number, transaction?: Transaction): Promise<OrderDetail | null> {
    return OrderDetailRepository.getById(id, transaction ?? null);
  }

  async getByProductId(productId: number, transaction?: Transaction): Promise<OrderDetail[]> {
    return OrderDetailRepository.getByProductId(productId, transaction ?? null);
  }

  async getByOrderId(orderId: number, transaction?: Transaction): Promise<OrderDetail[]> {
    return OrderDetailRepository.getByOrderId(orderId, transaction ?? null);
  }

  async create(data: OrderDetailInput, transaction?: Transaction): Promise<OrderDetail> {
    return OrderDetailRepository.create(data, transaction ?? null);
  }

  async update(
    id: number,
    data: Partial<OrderDetailInput>,
    transaction?: Transaction,
  ): Promise<OrderDetail | null> {
    return OrderDetailRepository.update(id, data, transaction ?? null);
  }

  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    return OrderDetailRepository.delete(id, transaction ?? null);
  }
}

export default new OrderDetailService();
