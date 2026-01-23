// src/repositories/order.repository.ts
import { Order, OrderStatus } from '../models/entity/order.model';
import { OrderDetail } from '../models/entity/orderDetail.model';
import { OrderInput } from '../dtos/order.dto';
import { Transaction } from 'sequelize';
import productService from '../services/product.service';
// itemCart para dejar el cart vacio
import { ItemCart } from '../models/entity/itemCart.model';

class OrderRepository {
  async getAll(transaction: Transaction | null = null): Promise<Order[]> {
    return Order.findAll({
      include: [{ model: OrderDetail, as: 'details' }],
      transaction,
    });
  }

  async getById(order_id: number, transaction: Transaction | null = null): Promise<Order | null> {
    return Order.findByPk(order_id, {
      include: [{ model: OrderDetail, as: 'details' }],
      transaction,
    });
  }

  async getByUserId(user_id: number, transaction: Transaction | null = null): Promise<Order[]> {
    return Order.findAll({
      where: { user_id },
      include: [{ model: OrderDetail, as: 'details' }],
      transaction,
    });
  }

  // async create(data: OrderInput, transaction: Transaction | null = null): Promise<Order> {
  //   if (!data.items || data.items.length === 0) {
  //     throw new Error('No se pueden crear órdenes vacías');
  //   }

  //   const order = await Order.create(
  //     {
  //       user_id: data.user_id,
  //       status: 'pending',
  //       total: 0,
  //     },
  //     { transaction }
  //   );

  //   let total = 0;

  //   for (const item of data.items) {
  //     const product = await productService.getById(item.productId, transaction ?? undefined);
  //     if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
  //     if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

  //     //await productService.decreaseStock(item.productId, item.quantity, transaction);
  //     await productService.decreaseStock(
  //       item.productId,
  //       item.quantity,
  //       transaction ?? undefined
  //     );

  //     const detail = await OrderDetail.create(
  //       {
  //         order_id: order.order_id,
  //         product_id: item.productId,
  //         quantity: item.quantity,
  //         unit_price: product.price,
  //       },
  //       { transaction }
  //     );

  //     total += Number(detail.subtotal);
  //   }

  //   order.total = total;
  //   await order.save({ transaction });

  //   await order.reload({
  //     include: [{ model: OrderDetail, as: 'details' }],
  //     transaction,
  //   });

  //   return order;
  // }

  // para el test de integracion
  // async create(data: OrderInput, transaction: Transaction | null = null): Promise<Order> {
  //   if (!data.items || data.items.length === 0) {
  //     throw new Error('No se pueden crear órdenes vacías');
  //   }

  //   const t = transaction ?? await Order.sequelize!.transaction();

  //   try {
  //     const order = await Order.create(
  //       {
  //         user_id: data.user_id,
  //         status: 'pending',
  //         total: 0,
  //       },
  //       { transaction: t }
  //     );

  //     let total = 0;

  //     for (const item of data.items) {
  //       const product = await productService.getById(item.productId, t);
  //       if (!product) {
  //         throw new Error(`Producto ${item.productId} no encontrado`);
  //       }

  //       if (product.stock < item.quantity) {
  //         throw new Error('Stock insuficiente');
  //       }

  //       await productService.decreaseStock(item.productId, item.quantity, t);

  //       const detail = await OrderDetail.create(
  //         {
  //           order_id: order.order_id,
  //           product_id: item.productId,
  //           quantity: item.quantity,
  //           unit_price: product.price,
  //         },
  //         { transaction: t }
  //       );

  //       total += Number(detail.subtotal);
  //     }

  //     order.total = total;
  //     await order.save({ transaction: t });

  //     await order.reload({
  //       include: [{ model: OrderDetail, as: 'details' }],
  //       transaction: t,
  //     });

  //     if (!transaction) await t.commit();

  //     return order;
  //   } catch (error) {
  //     if (!transaction) await t.rollback();
  //     throw error;
  //   }
  // }

  // para usar hook de orderDetail model y la transaccion para el test de integracion
  async create(
    data: OrderInput,
    transaction: Transaction | null = null
  ): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new Error('No se pueden crear órdenes vacías');
    }

    const t = transaction ?? await Order.sequelize!.transaction();

    try {
      // 1️⃣ Crear orden
      const order = await Order.create(
        {
          user_id: data.user_id,
          status: 'pending',
          total: 0,
        },
        { transaction: t }
      );

      let total = 0;

      // 2️⃣ Crear detalles + manejar stock
      for (const item of data.items) {
        const product = await productService.getById(item.productId, t);

        if (!product) {
          throw new Error(`Producto ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}`);
        }

        await productService.decreaseStock(
          item.productId,
          item.quantity,
          t
        );

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

      // 4️⃣ Vaciar carrito (mantiene comportamiento original)
      // await ItemCart.destroy({
      //   where: { cart_id: data.cart_id },
      //   transaction: t,
      // });

      // 5️⃣ Reload final
      await order.reload({
        include: [{ model: OrderDetail, as: 'details' }],
        transaction: t,
      });

      // Commit solo si la transacción es interna
      if (!transaction) {
        await t.commit();
      }

      return order;
    } catch (error) {
      // Rollback solo si la transacción es interna
      if (!transaction) {
        await t.rollback();
      }
      throw error;
    }
  }

  // async updateStatus(order_id: number, status: OrderStatus, transaction: Transaction | null = null): Promise<Order | null> {
  //   const order = await Order.findByPk(order_id, { transaction });
  //   if (!order) return null;

  //   order.status = status;
  //   await order.save({ transaction });
  //   return order;
  // }

  async updateStatus( order: Order, status: OrderStatus, transaction: Transaction | null= null ): Promise<Order> {
    order.status = status;
    await order.save({ transaction });
    return order;
  }

  async delete(order_id: number, transaction: Transaction | null = null): Promise<boolean> {
    const deleted = await Order.destroy({ where: { order_id }, transaction });
    return deleted > 0;
  }
}

export default new OrderRepository();

