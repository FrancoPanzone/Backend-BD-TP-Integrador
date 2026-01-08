// // src/repositories/orderDetail.repository.ts
// import { OrderDetail } from '../models/entity/orderDetail.model';
// import { OrderDetailInput } from '../dtos/orderDetail.dto';

// export class OrderDetailRepository {
//   // Obtener todos los detalles de pedido
//   async getAll(): Promise<OrderDetail[]> {
//     return await OrderDetail.findAll();
//   }

//   // Obtener detalle por ID
//   async getById(id: number): Promise<OrderDetail | null> {
//     return await OrderDetail.findByPk(id);
//   }

//   // Los métodos getByOrderId y getByProductId usan findAll con where, reemplazando los filtros manuales que había en el mock.

//   // Obtener detalles por OrderId
//   async getByOrderId(orderId: number): Promise<OrderDetail[]> {
//     return await OrderDetail.findAll({
//       where: { order_id: orderId },
//     });
//   }

//   // Obtener detalles por ProductId
//   async getByProductId(productId: number): Promise<OrderDetail[]> {
//     return await OrderDetail.findAll({
//       where: { product_id: productId },
//     });
//   }

//   // Crear un nuevo detalle de pedido
//   async create(data: OrderDetailInput): Promise<OrderDetail> {
//     return await OrderDetail.create(data);
//   }

//   // Actualizar detalle de pedido
//   async update(id: number, data: Partial<OrderDetailInput>): Promise<OrderDetail | null> {
//     const orderDetail = await OrderDetail.findByPk(id);
//     if (!orderDetail) return null;
//     return await orderDetail.update(data);
//   }

//   // Eliminar detalle de pedido
//   async delete(id: number): Promise<boolean> {
//     const orderDetail = await OrderDetail.findByPk(id);
//     if (!orderDetail) return false;
//     await orderDetail.destroy();
//     return true;
//   }
// }

// export default new OrderDetailRepository();

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

