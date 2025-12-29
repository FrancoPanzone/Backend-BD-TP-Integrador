// // src/services/order.service.ts
// import { Order } from '../models/entity/order.entity';
// import { OrderInput } from '../dtos/order.dto';
// import { OrderStatus } from '../models/entity/order.entity';
// import { OrderDetail } from '../models/entity/orderDetail.entity';

// import ProductService from './product.service';
// import UserService from './user.service';
// import CartService from './cart.service';

// import OrderModel from '../models/implementations/mock/mockOrder';
// import OrderDetailModel from '../models/implementations/mock/mockOrderDetail';
// import MockItemCart from '../models/implementations/mock/mockItemCart';

// class OrderService {
//   private async validateUser(user_id: number) {
//     const user = await UserService.getById(user_id);
//     if (!user) throw new Error('Usuario no existe');
//     return user;
//   }

//   private calculateTotal(details: OrderDetail[]): number {
//     return details.reduce((sum, d) => sum + d.getSubtotal(), 0);
//   }

//   private async _createOrder(
//     user_id: number,
//     items: { productId: number; quantity: number }[],
//   ): Promise<Order> {
//     if (items.length === 0) throw new Error('No se pueden crear órdenes vacías');

//     const details: OrderDetail[] = [];

//     for (const item of items) {
//       const product = await ProductService.getById(item.productId);
//       if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
//       if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

//       await ProductService.decreaseStock(item.productId, item.quantity);

//       const detail = await OrderDetailModel.create({
//         order_id: 0, // temporal
//         product_id: item.productId,
//         quantity: item.quantity,
//         unit_price: product.price,
//       });

//       details.push(detail);
//     }

//     const total = this.calculateTotal(details);

//     const order = await OrderModel.create({
//       user_id,
//       total,
//       items,
//     });

//     details.forEach((d) => d.setOrderId(order.getId()));
//     order.details = details;

//     return order;
//   }

//   // ---------- Métodos públicos ----------

//   async getAll(): Promise<Order[]> {
//     return OrderModel.getAll();
//   }

//   async getById(id: number): Promise<Order | undefined> {
//     return OrderModel.getById(id);
//   }

//   async getByUserId(userId: number): Promise<Order[]> {
//     return OrderModel.getByUserId(userId);
//   }

//   async checkout(user_id: number): Promise<Order> {
//     await this.validateUser(user_id);

//     const cart = await CartService.getCartByUserId(user_id);
//     if (!cart) throw new Error('Carrito no encontrado');

//     const cartItems = await MockItemCart.getByCartId(cart.getCartId());
//     const items = cartItems.map((i) => ({
//       productId: i.getProductId(),
//       quantity: i.getQuantity(),
//     }));

//     if (items.length === 0) throw new Error('El carrito está vacío');

//     const order = await this._createOrder(user_id, items);

//     await MockItemCart.clearByCartId(cart.getCartId());
//     return order;
//   }

//   async create(data: OrderInput): Promise<Order> {
//     await this.validateUser(data.user_id);
//     return this._createOrder(data.user_id, data.items);
//   }

//   async delete(id: number): Promise<boolean> {
//     return OrderModel.delete(id);
//   }

//   async updateStatus(id: number, status: OrderStatus): Promise<Order | undefined> {
//     const order = await OrderModel.getById(id);
//     if (!order) throw new Error('Orden no encontrada');

//     if (order.status === 'cancel') throw new Error('No se puede modificar una orden cancelada');
//     if (!['pending', 'paid', 'cancel'].includes(status)) throw new Error('Estado inválido');

//     return OrderModel.updateStatus(id, status);
//   }
// }

// export default new OrderService();

// src/services/order.service.ts

// TODO: HACER QUE USE EL REPOSITORIO!!!!!!!
// import { Order, OrderStatus } from '../models/entity/order.model';
// import { OrderDetail } from '../models/entity/orderDetail.model';
// import { OrderInput } from '../dtos/order.dto';

// import ProductService from './product.service';
// import UserService from './user.service';
// import CartService from './cart.service';
// import ItemCartService from './itemCart.service';

// class OrderService {
//   private async validateUser(user_id: number) {
//     const user = await UserService.getById(user_id);
//     if (!user) throw new Error('Usuario no existe');
//     return user;
//   }

//   private calculateTotal(details: OrderDetail[]): number {
//     return details.reduce((sum, d) => sum + Number(d.subtotal), 0);
//   }

//   // INTENTO 1
//   // private async _createOrder(
//   //   user_id: number,
//   //   items: { productId: number; quantity: number }[]
//   // ): Promise<Order> {
//   //   if (items.length === 0) throw new Error('No se pueden crear órdenes vacías');

//   //   const details: OrderDetail[] = [];

//   //   // Crear detalles y actualizar stock
//   //   for (const item of items) {
//   //     const product = await ProductService.getById(item.productId);
//   //     if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
//   //     if (product.stock < item.quantity)
//   //       throw new Error(`Stock insuficiente para ${product.name}`);

//   //     await ProductService.decreaseStock(item.productId, item.quantity);

//   //     const detail = await OrderDetail.create({
//   //       order_id: 0, // temporal, se actualizará luego
//   //       product_id: item.productId,
//   //       quantity: item.quantity,
//   //       unit_price: product.price,
//   //     });

//   //     details.push(detail);
//   //   }

//   //   // Crear la orden
//   //   const order = await Order.create(
//   //     {
//   //       user_id,
//   //       status: 'pending',
//   //       total: this.calculateTotal(details),
//   //       order_date: new Date(),
//   //     },
//   //     { include: [OrderDetail] }
//   //   );

//   //   // Actualizar order_id en los detalles
//   //   for (const d of details) {
//   //     d.order_id = order.order_id;
//   //     await d.save();
//   //   }

//   //   order.details = details;
//   //   return order;
//   // }

//   // INTENTO 2
//   // private async _createOrder(
//   //   user_id: number,
//   //   items: { productId: number; quantity: number }[]
//   // ): Promise<Order> {
//   //   if (items.length === 0) throw new Error('No se pueden crear órdenes vacías');

//   //   // Crear la orden primero, sin detalles
//   //   const order = await Order.create({
//   //     user_id,
//   //     status: 'pending',
//   //     total: 0, // se actualizará luego
//   //     order_date: new Date(),
//   //   });

//   //   const details: OrderDetail[] = [];

//   //   // Crear detalles asociados a la orden
//   //   for (const item of items) {
//   //     const product = await ProductService.getById(item.productId);
//   //     if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
//   //     if (product.stock < item.quantity)
//   //       throw new Error(`Stock insuficiente para ${product.name}`);

//   //     await ProductService.decreaseStock(item.productId, item.quantity);

//   //     const detail = await OrderDetail.create({
//   //       order_id: order.order_id, // ahora sí existe
//   //       product_id: item.productId,
//   //       quantity: Number(item.quantity),
//   //       unit_price: Number(product.price),
//   //     });

//   //     details.push(detail);
//   //   }

//   //   // Calcular total y actualizar la orden
//   //   order.total = details.reduce((sum, d) => sum + Number(d.subtotal), 0);
//   //   await order.save();

//   //   order.details = details;
//   //   return order;
//   // }

//   // INTENTO 3
//   // private async _createOrder(
//   //   user_id: number,
//   //   items: { productId: number; quantity: number }[]
//   // ): Promise<Order> {
//   //   console.log('🛠️ Iniciando creación de orden para user_id:', user_id);
//   //   console.log('🔹 Items recibidos:', items);

//   //   if (items.length === 0) {
//   //     console.log('⚠️ El carrito está vacío, abortando...');
//   //     throw new Error('No se pueden crear órdenes vacías');
//   //   }

//   //   const details: OrderDetail[] = [];

//   //   // 1️⃣ Crear la orden primero, sin detalles todavía
//   //   const order = await Order.create({
//   //     user_id,
//   //     status: 'pending',
//   //     total: 0, // se calculará luego
//   //     order_date: new Date(),
//   //   });

//   //   console.log('✅ Orden creada con order_id:', order.order_id);

//   //   // 2️⃣ Crear detalles de orden y actualizar stock
//   //   for (const item of items) {
//   //     console.log(`🔹 Procesando item: productId=${item.productId}, quantity=${item.quantity}`);

//   //     const product = await ProductService.getById(item.productId);
//   //     if (!product) {
//   //       console.log(`❌ Producto ${item.productId} no encontrado`);
//   //       throw new Error(`Producto ${item.productId} no encontrado`);
//   //     }

//   //     if (product.stock < item.quantity) {
//   //       console.log(`❌ Stock insuficiente para ${product.name}`);
//   //       throw new Error(`Stock insuficiente para ${product.name}`);
//   //     }

//   //     await ProductService.decreaseStock(item.productId, item.quantity);
//   //     console.log(`✅ Stock actualizado para producto ${product.name}`);

//   //     const detail = await OrderDetail.create({
//   //       order_id: order.order_id,          // ahora sí existe
//   //       product_id: item.productId,
//   //       quantity: Number(item.quantity),
//   //       unit_price: Number(product.price), // convertir a number
//   //     });

//   //     console.log(`✅ Detalle creado: order_detail_id=${detail.order_detail_id}, subtotal=${detail.subtotal}`);
//   //     details.push(detail);
//   //   }

//   //   // 3️⃣ Calcular total de la orden
//   //   const total = details.reduce((sum, d) => sum + Number(d.subtotal), 0);
//   //   order.total = total;
//   //   await order.save();
//   //   console.log(`💰 Total de la orden actualizado: ${order.total}`);

//   //   order.details = details;
//   //   console.log('🎉 Orden completa con detalles creada correctamente');

//   //   return order;
//   // }

//   // INTENTO 4
//   private async _createOrder(
//     user_id: number,
//     items: { productId: number; quantity: number }[]
//   ): Promise<Order> {
//     console.log('🛠️ Iniciando creación de orden para user_id:', user_id);
//     console.log('🔹 Items recibidos:', items);

//     if (items.length === 0) {
//       console.log('⚠️ El carrito está vacío, abortando...');
//       throw new Error('No se pueden crear órdenes vacías');
//     }

//     const details: OrderDetail[] = [];

//     try {
//       // 1️⃣ Crear la orden primero, sin detalles todavía
//       const order = await Order.create({
//         user_id,
//         status: 'pending',
//         total: 0, // se calculará luego
//         order_date: new Date(),
//       });

//       console.log('✅ Orden creada con order_id:', order.order_id);

//       // 2️⃣ Crear detalles de orden y actualizar stock
//       for (const item of items) {
//         console.log(`🔹 Procesando item: productId=${item.productId}, quantity=${item.quantity}`);

//         const product = await ProductService.getById(item.productId);
//         if (!product) {
//           console.log(`❌ Producto ${item.productId} no encontrado`);
//           throw new Error(`Producto ${item.productId} no encontrado`);
//         }

//         if (product.stock < item.quantity) {
//           console.log(`❌ Stock insuficiente para ${product.name}`);
//           throw new Error(`Stock insuficiente para ${product.name}`);
//         }

//         await ProductService.decreaseStock(item.productId, item.quantity);
//         console.log(`✅ Stock actualizado para producto ${product.name}`);

//         try {
//           const detail = await OrderDetail.create({
//             order_id: order.order_id,          // FK
//             product_id: item.productId,
//             quantity: Number(item.quantity),
//             unit_price: Number(product.price), // convertir a number
//           });

//           console.log(`✅ Detalle creado: order_detail_id=${detail.order_detail_id}, subtotal=${detail.subtotal}`);
//           details.push(detail);
//         } catch (err) {
//           console.log('❌ Error al crear OrderDetail:', err);
//           throw new Error(`Error creando detalle de orden para productId=${item.productId}: ${(err as Error).message}`);
//         }
//       }

//       // 3️⃣ Calcular total de la orden
//       const total = details.reduce((sum, d) => sum + Number(d.subtotal), 0);
//       order.total = total;
//       await order.save();
//       console.log(`💰 Total de la orden actualizado: ${order.total}`);

//       order.details = details;
//       console.log('🎉 Orden completa con detalles creada correctamente');

//       return order;
//     } catch (err) {
//       console.log('❌ Error creando la orden completa:', err);
//       throw err; // relanza para el controller
//     }
//   }

//   // ---------- Métodos públicos ----------

//   async getAll(): Promise<Order[]> {
//     return Order.findAll({ include: [{ model: OrderDetail, as: 'details' }] });
//   }

//   async getById(id: number): Promise<Order | null> {
//     return Order.findByPk(id, { include: [{ model: OrderDetail, as: 'details' }] });
//   }

//   async getByUserId(userId: number): Promise<Order[]> {
//     return Order.findAll({
//       where: { user_id: userId },
//       include: [{ model: OrderDetail, as: 'details' }],
//     });
//   }

//   async checkout(user_id: number): Promise<Order> {
//     await this.validateUser(user_id);

//     const cart = await CartService.getCartByUserId(user_id);
//     if (!cart) throw new Error('Carrito no encontrado');

//     const cartItems = await ItemCartService.getByCartId(cart.cart_id);
//     const items = cartItems.map((i) => ({
//       productId: i.product_id,
//       quantity: i.quantity,
//     }));

//     if (items.length === 0) throw new Error('El carrito está vacío');

//     const order = await this._createOrder(user_id, items);

//     // Limpiar carrito
//     await ItemCartService.clearByCartId(cart.cart_id);

//     return order;
//   }

//   async create(data: OrderInput): Promise<Order> {
//     await this.validateUser(data.user_id);
//     return this._createOrder(data.user_id, data.items);
//   }

//   // async delete(id: number): Promise<void> {
//   //   const order = await this.getById(id);
//   //   if (!order) throw new Error('Orden no encontrada');
//   //   await Order.destroy({ where: { order_id: id } });
//   // }

//   async delete(id: number): Promise<boolean> {
//     const order = await this.getById(id);
//     if (!order) return false;

//     await Order.destroy({ where: { order_id: id } });
//     return true;
//   }

//   async updateStatus(id: number, status: OrderStatus): Promise<Order> {
//     const order = await this.getById(id);
//     if (!order) throw new Error('Orden no encontrada');

//     if (order.status === 'cancel')
//       throw new Error('No se puede modificar una orden cancelada');
//     if (!['pending', 'paid', 'cancel'].includes(status))
//       throw new Error('Estado inválido');

//     order.status = status;
//     await order.save();
//     return order;
//   }
// }

// export default new OrderService();

// src/services/order.service.ts
import { Order, OrderStatus } from '../models/entity/order.model';
import { OrderInput } from '../dtos/order.dto';
import OrderRepository from '../repositories/order.repository';

import UserService from './user.service';
import CartService from './cart.service';
import ItemCartService from './itemCart.service';

class OrderService {
  private orderRepo = OrderRepository;

  private async validateUser(user_id: number) {
    const user = await UserService.getById(user_id);
    if (!user) throw new Error('Usuario no existe');
  }

  async getAll(): Promise<Order[]> {
    return this.orderRepo.getAll();
  }

  async getById(id: number): Promise<Order> {
    const order = await this.orderRepo.getById(id);
    if (!order) throw new Error('Orden no encontrada');
    return order;
  }

  async getByUserId(user_id: number): Promise<Order[]> {
    return this.orderRepo.getByUserId(user_id);
  }

  async create(data: OrderInput): Promise<Order> {
    await this.validateUser(data.user_id);
    return this.orderRepo.create(data);
  }

  async checkout(user_id: number): Promise<Order> {
    await this.validateUser(user_id);

    const cart = await CartService.getCartByUserId(user_id);
    if (!cart) throw new Error('Carrito no encontrado');

    const cartItems = await ItemCartService.getByCartId(cart.cart_id);
    if (cartItems.length === 0) {
      throw new Error('El carrito está vacío');
    }

    const order = await this.orderRepo.create({
      user_id,
      items: cartItems.map((i) => ({
        productId: i.product_id,
        quantity: i.quantity,
      })),
    });

    await ItemCartService.clearByCartId(cart.cart_id);
    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepo.updateStatus(id, status);
    if (!order) throw new Error('Orden no encontrada');

    if (order.status === 'cancel') {
      throw new Error('No se puede modificar una orden cancelada');
    }

    return order;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.orderRepo.delete(id);
    if (!deleted) throw new Error('Orden no encontrada');
  }
}

export default new OrderService();
