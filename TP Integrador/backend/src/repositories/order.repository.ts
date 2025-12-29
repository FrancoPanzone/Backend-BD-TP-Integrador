// // src/repositories/order.repository.ts
// import { Order, OrderStatus } from '../models/entity/order.model';
// import { OrderDetail } from '../models/entity/orderDetail.model';
// import { OrderInput } from '../dtos/order.dto';
// import productService from '../services/product.service';

// class OrderRepository {
//   // Obtener todas las órdenes con detalles
//   async getAll(): Promise<Order[]> {
//     return Order.findAll({ include: [{ model: OrderDetail, as: 'details' }] });
//   }

//   // Obtener orden por ID con detalles
//   async getById(order_id: number): Promise<Order | null> {
//     return Order.findByPk(order_id, { include: [{ model: OrderDetail, as: 'details' }] });
//   }

//   // Obtener todas las órdenes de un usuario
//   async getByUserId(user_id: number): Promise<Order[]> {
//     return Order.findAll({
//       where: { user_id },
//       include: [{ model: OrderDetail, as: 'details' }],
//     });
//   }

//   // Crear orden junto con sus detalles
// //   async create(data: OrderInput): Promise<Order> {
// //     // Se espera que data.items sea [{ productId, quantity, unit_price }]
// //     const order = await Order.create(
// //       {
// //         user_id: data.user_id,
// //         status: 'pending',
// //         details: data.items?.map((item) => ({
// //           product_id: item.productId,
// //           quantity: item.quantity,
// //           unit_price: item.unit_price,
// //         })),
// //       },
// //       {
// //         include: [{ model: OrderDetail, as: 'details' }],
// //       }
// //     );

// //     return order;
// //   }

// // TODO: Este create se hace en paralelo con el metodo privado _createOrder del servicio para checkout , ver como arreglar

// // async create(data: OrderInput): Promise<Order> {
// //   // Crear los detalles con unit_price
// //   const details = await Promise.all(
// //     data.items.map(async (item) => {
// //       const product = await productService.getById(item.productId);
// //       if (!product) throw new Error(`Producto ${item.productId} no encontrado`);

// //       return {
// //         product_id: item.productId,
// //         quantity: item.quantity,
// //         unit_price: product.price, // ahora sí existe
// //       };
// //     })
// //   );

// //   // Crear orden incluyendo detalles
// //   const order = await Order.create(
// //     {
// //       user_id: data.user_id,
// //       status: 'pending',
// //       details,
// //     },
// //     {
// //       include: [{ model: OrderDetail, as: 'details' }],
// //     }
// //   );

// //   return order;
// // }


//   // Actualizar el estado de una orden
//   async updateStatus(order_id: number, status: OrderStatus): Promise<Order | null> {
//     const order = await Order.findByPk(order_id);
//     if (!order) return null;

//     order.status = status;
//     await order.save();

//     return order;
//   }

//   // Eliminar orden y sus detalles
//   async delete(order_id: number): Promise<boolean> {
//     const deleted = await Order.destroy({ where: { order_id } });
//     return deleted > 0;
//   }
// }

// export default new OrderRepository();

// src/repositories/order.repository.ts

import { sequelize } from '../config/database.config';
import { Order, OrderStatus } from '../models/entity/order.model';
import { OrderDetail } from '../models/entity/orderDetail.model';
import { OrderInput } from '../dtos/order.dto';
import productService from '../services/product.service';

class OrderRepository {
  async getAll(): Promise<Order[]> {
    return Order.findAll({ include: [{ model: OrderDetail, as: 'details' }] });
  }

  async getById(order_id: number): Promise<Order | null> {
    return Order.findByPk(order_id, {
      include: [{ model: OrderDetail, as: 'details' }],
    });
  }

  async getByUserId(user_id: number): Promise<Order[]> {
    return Order.findAll({
      where: { user_id },
      include: [{ model: OrderDetail, as: 'details' }],
    });
  }

  /**
   * CREA ORDEN + DETALLES + ACTUALIZA STOCK (ATÓMICO)
   */
  async create(data: OrderInput): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new Error('No se pueden crear órdenes vacías');
    }

    return sequelize.transaction(async (t) => {
      // 1️⃣ Crear orden base
      const order = await Order.create(
        {
          user_id: data.user_id,
          status: 'pending',
          total: 0,
        },
        { transaction: t }
      );

      let total = 0;

      // 2️⃣ Crear detalles
      for (const item of data.items) {
        const product = await productService.getById(item.productId);
        if (!product) {
          throw new Error(`Producto ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}`);
        }

        await productService.decreaseStock(item.productId, item.quantity);

        const detail = await OrderDetail.create(
          {
            order_id: order.order_id,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: product.price,
          },
          { transaction: t }
        );

        total += Number(detail.subtotal);
      }

      // 3️⃣ Actualizar total
      order.total = total;
      await order.save({ transaction: t });

      // 4️⃣ Cargar detalles para devolver orden completa
      await order.reload({
        include: [{ model: OrderDetail, as: 'details' }],
        transaction: t,
      });

      return order;
    });
  }

  async updateStatus(
    order_id: number,
    status: OrderStatus
  ): Promise<Order | null> {
    const order = await Order.findByPk(order_id);
    if (!order) return null;

    order.status = status;
    await order.save();
    return order;
  }

  async delete(order_id: number): Promise<boolean> {
    const deleted = await Order.destroy({ where: { order_id } });
    return deleted > 0;
  }
}

export default new OrderRepository();
