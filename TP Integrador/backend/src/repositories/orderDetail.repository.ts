// src/repositories/orderDetail.repository.ts
import { OrderDetail } from '../models/entity/orderDetail.model';
import { OrderDetailInput } from '../dtos/orderDetail.dto';

export class OrderDetailRepository {
  // Obtener todos los detalles de pedido
  async getAll(): Promise<OrderDetail[]> {
    return await OrderDetail.findAll();
  }

  // Obtener detalle por ID
  async getById(id: number): Promise<OrderDetail | null> {
    return await OrderDetail.findByPk(id);
  }

  // Los métodos getByOrderId y getByProductId usan findAll con where, reemplazando los filtros manuales que había en el mock.

  // Obtener detalles por OrderId
  async getByOrderId(orderId: number): Promise<OrderDetail[]> {
    return await OrderDetail.findAll({
      where: { order_id: orderId },
    });
  }

  // Obtener detalles por ProductId
  async getByProductId(productId: number): Promise<OrderDetail[]> {
    return await OrderDetail.findAll({
      where: { product_id: productId },
    });
  }

  // Crear un nuevo detalle de pedido
  async create(data: OrderDetailInput): Promise<OrderDetail> {
    return await OrderDetail.create(data);
  }

  // Actualizar detalle de pedido
  async update(id: number, data: Partial<OrderDetailInput>): Promise<OrderDetail | null> {
    const orderDetail = await OrderDetail.findByPk(id);
    if (!orderDetail) return null;
    return await orderDetail.update(data);
  }

  // Eliminar detalle de pedido
  async delete(id: number): Promise<boolean> {
    const orderDetail = await OrderDetail.findByPk(id);
    if (!orderDetail) return false;
    await orderDetail.destroy();
    return true;
  }
}

export default new OrderDetailRepository();
