// src/tests/integration/orderDetail.integration.test.ts
// import { sequelize } from '../../models/entity';
// import { Transaction } from 'sequelize';
// import OrderDetailService from '../../services/orderDetail.service';
// import OrderService from '../../services/order.service';
// import UserService from '../../services/user.service';
// import ProductService from '../../services/product.service';

// describe('OrderDetail Integration Tests (with transaction)', () => {
//     let transaction: Transaction;
//     let orderId: number;
//     let productId: number;

//     beforeEach(async () => {
//         transaction = await sequelize.transaction();

//         const user = await UserService.create(
//             {
//                 name: 'OD User',
//                 email: 'od@test.com',
//                 password: 'Password123',
//                 address: 'Test',
//             },
//             transaction
//         );

//         const product = await ProductService.create(
//             {
//                 name: 'OD Product',
//                 description: 'desc',
//                 price: 100,
//                 stock: 10,
//                 rating: 4,
//                 brand: 'brand',
//                 image: 'img',
//                 category_id: 1,
//             },
//             transaction
//         );

//         productId = product.product_id!;

//         const order = await OrderService.create(
//             {
//                 user_id: user.user_id,
//                 items: [{ productId, quantity: 2 }],
//             },
//             transaction
//         );

//         orderId = order.order_id;
//     });

//     afterEach(async () => {
//         await transaction.rollback();
//     });

//     //   it('should get order details by order id', async () => {
//     //     const details = await OrderDetailService.getByOrderId(orderId, transaction);

//     //     expect(details).toHaveLength(1);
//     //     expect(details[0].order_id).toBe(orderId);
//     //     expect(details[0].product_id).toBe(productId);
//     //     expect(details[0].quantity).toBe(2);
//     //     expect(Number(details[0].unit_price)).toBe(100);
//     //   });
//     it('should get order details by order id', async () => {
//         const details = await OrderDetailService.getByOrderId(orderId, transaction);

//         expect(details).toBeDefined();
//         expect(details.length).toBe(1);

//         const [detail] = details;

//         expect(detail).toBeDefined();
//         expect(detail!.order_id).toBe(orderId);
//         expect(detail!.product_id).toBe(productId);
//         expect(detail!.quantity).toBe(2);
//         expect(Number(detail!.unit_price)).toBe(100);
//     });
// });

// src/tests/integration/orderDetail.integration.test.ts
// import OrderDetailService from '../../services/orderDetail.service';
// import { OrderDetailInput } from '../../dtos/orderDetail.dto';
// import { Transaction } from 'sequelize';
// import { User, Order, Product, Category, OrderDetail, sequelize } from '../../models/entity';

// describe('OrderDetailService - Integration Tests', () => {
//     let transaction: Transaction;
//     let userId: number;
//     let orderId: number;
//     let productId: number;

//     beforeAll(async () => {
//         // Crear datos base: user, product y order
//         const user = await User.create({
//             name: 'Integration User',
//             email: 'integration@example.com',
//             password: '123456',
//         });
//         userId = user.user_id;

//         const category = await Category.create({
//             name: 'Category Test',
//             description: 'Categoría para test',
//         });
//         const testCategoryId = category.category_id;

//         // const product = await Product.create({
//         //     name: 'Integration Product',
//         //     price: 100,
//         //     stock: 10,
//         // });
//         // productId = product.product_id;

//         const product = await Product.create({
//             name: 'Integration Product',
//             description: 'Producto de prueba',
//             price: 100,
//             stock: 10,
//             category_id: testCategoryId, // Debes crear o usar una categoría de prueba
//             rating: 4,
//             brand: 'TestBrand',
//         });
//         productId = product.product_id;


//         const order = await Order.create({
//             user_id: userId,
//             status: 'pending',
//         });
//         orderId = order.order_id;
//     });

//     beforeEach(async () => {
//         transaction = await sequelize.transaction();
//     });

//     afterEach(async () => {
//         await transaction.rollback(); // 🔹 rollback después de cada test
//     });

//     afterAll(async () => {
//         await User.destroy({ where: { user_id: userId } });
//         await Product.destroy({ where: { product_id: productId } });
//         await Order.destroy({ where: { order_id: orderId } });
//         await sequelize.close();
//     });

//     it('should create an order detail', async () => {
//         const input: OrderDetailInput = {
//             order_id: orderId,
//             product_id: productId,
//             quantity: 2,
//             unit_price: 100,
//         };

//         const detail = await OrderDetailService.create(input);

//         expect(detail).toBeDefined();
//         expect(detail.order_id).toBe(orderId);
//         expect(detail.product_id).toBe(productId);
//         expect(detail.quantity).toBe(2);
//         expect(Number(detail.unit_price)).toBe(100);
//     });

//     it('should get order detail by ID', async () => {
//         const input: OrderDetailInput = { order_id: orderId, product_id: productId, quantity: 1, unit_price: 100 };
//         const created = await OrderDetailService.create(input);

//         const found = await OrderDetailService.getById(created.order_detail_id);
//         expect(found).toBeDefined();
//         expect(found!.order_detail_id).toBe(created.order_detail_id);
//     });

//     // it('should get order details by order ID', async () => {
//     //     const input: OrderDetailInput = { order_id: orderId, product_id: productId, quantity: 3, unit_price: 100 };
//     //     await OrderDetailService.create(input);

//     //     const details = await OrderDetailService.getByOrderId(orderId);
//     //     expect(details).toBeDefined();
//     //     expect(details.length).toBeGreaterThan(0);
//     //     expect(details[0].order_id).toBe(orderId);
//     // });

//     // it('should get order details by product ID', async () => {
//     //     const input: OrderDetailInput = { order_id: orderId, product_id: productId, quantity: 4, unit_price: 100 };
//     //     await OrderDetailService.create(input);

//     //     const details = await OrderDetailService.getByProductId(productId);
//     //     expect(details).toBeDefined();
//     //     expect(details.length).toBeGreaterThan(0);
//     //     expect(details[0].product_id).toBe(productId);
//     // });

//     it('should get order details by order ID', async () => {
//         const input: OrderDetailInput = { order_id: orderId, product_id: productId, quantity: 3, unit_price: 100 };
//         await OrderDetailService.create(input);

//         const details = await OrderDetailService.getByOrderId(orderId);
//         expect(details).toBeDefined();
//         expect(details.length).toBeGreaterThan(0);

//         const firstDetail = details[0];
//         expect(firstDetail).toBeDefined();
//         expect(firstDetail!.order_id).toBe(orderId);
//         expect(firstDetail!.product_id).toBe(productId);
//         expect(firstDetail!.quantity).toBe(3);
//         expect(Number(firstDetail!.unit_price)).toBe(100);
//     });

//     it('should get order details by product ID', async () => {
//         const input: OrderDetailInput = { order_id: orderId, product_id: productId, quantity: 4, unit_price: 100 };
//         await OrderDetailService.create(input);

//         const details = await OrderDetailService.getByProductId(productId);
//         expect(details).toBeDefined();
//         expect(details.length).toBeGreaterThan(0);

//         const firstDetail = details[0];
//         expect(firstDetail).toBeDefined();
//         expect(firstDetail!.product_id).toBe(productId);
//         expect(firstDetail!.order_id).toBe(orderId);
//         expect(firstDetail!.quantity).toBe(4);
//         expect(Number(firstDetail!.unit_price)).toBe(100);
//     });


//     it('should update an order detail', async () => {
//         const input: OrderDetailInput = { order_id: orderId, product_id: productId, quantity: 2, unit_price: 100 };
//         const created = await OrderDetailService.create(input);

//         const updated = await OrderDetailService.update(created.order_detail_id, { quantity: 5 });
//         expect(updated).toBeDefined();
//         expect(updated!.quantity).toBe(5);
//     });

//     it('should delete an order detail', async () => {
//         const input: OrderDetailInput = { order_id: orderId, product_id: productId, quantity: 2, unit_price: 100 };
//         const created = await OrderDetailService.create(input);

//         const deleted = await OrderDetailService.delete(created.order_detail_id);
//         expect(deleted).toBe(true);

//         const found = await OrderDetailService.getById(created.order_detail_id);
//         expect(found).toBeNull();
//     });
// });

// src/tests/integration/orderDetail.integration.test.ts
// import { Transaction } from 'sequelize';
// import OrderDetailService from '../../services/orderDetail.service';
// import OrderService from '../../services/order.service';
// import UserService from '../../services/user.service';
// import ProductService from '../../services/product.service';
// import { sequelize } from '../../models/entity';

// describe('OrderDetail Integration Tests (with services)', () => {
//   let transaction: Transaction;
//   let orderId: number;
//   let productId: number;
//   let userId: number;

//   beforeEach(async () => {
//     transaction = await sequelize.transaction();

//     // Crear usuario de prueba
//     const user = await UserService.create(
//       {
//         name: 'OD User',
//         email: 'od@test.com',
//         password: 'Password123',
//         address: 'Test Address',
//       },
//       transaction
//     );
//     userId = user.user_id!;

//     // Crear producto de prueba
//     const product = await ProductService.create(
//       {
//         name: 'OD Product',
//         description: 'Producto prueba',
//         price: 100,
//         stock: 10,
//         rating: 4,
//         brand: 'BrandTest',
//         image: '/img/test.webp',
//         category_id: 1, // Debe existir la categoría 1, o crear una categoría con CategoryService
//       },
//       transaction
//     );
//     productId = product.product_id!;

//     // Crear orden de prueba
//     const order = await OrderService.create(
//       {
//         user_id: userId,
//         items: [{ productId, quantity: 2 }],
//       },
//       transaction
//     );
//     orderId = order.order_id!;
//   });

//   afterEach(async () => {
//     await transaction.rollback(); // rollback después de cada test
//   });

//   it('should create an order detail', async () => {
//     const input = { order_id: orderId, product_id: productId, quantity: 2, unit_price: 100 };
//     const detail = await OrderDetailService.create(input, transaction);

//     expect(detail).toBeDefined();
//     expect(detail!.order_id).toBe(orderId);
//     expect(detail!.product_id).toBe(productId);
//     expect(detail!.quantity).toBe(2);
//     expect(Number(detail!.unit_price)).toBe(100);
//   });

//   it('should get order detail by ID', async () => {
//     const input = { order_id: orderId, product_id: productId, quantity: 1, unit_price: 100 };
//     const created = await OrderDetailService.create(input, transaction);

//     const found = await OrderDetailService.getById(created.order_detail_id!, transaction);
//     expect(found).toBeDefined();
//     expect(found!.order_detail_id).toBe(created.order_detail_id);
//   });

//   it('should get order details by order ID', async () => {
//     const input = { order_id: orderId, product_id: productId, quantity: 3, unit_price: 100 };
//     await OrderDetailService.create(input, transaction);

//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     expect(details).toBeDefined();
//     expect(details.length).toBeGreaterThan(0);

//     const firstDetail = details[0];
//     expect(firstDetail).toBeDefined();
//     expect(firstDetail!.order_id).toBe(orderId);
//     expect(firstDetail!.product_id).toBe(productId);
//     expect(firstDetail!.quantity).toBe(3);
//   });

//   it('should get order details by product ID', async () => {
//     const input = { order_id: orderId, product_id: productId, quantity: 4, unit_price: 100 };
//     await OrderDetailService.create(input, transaction);

//     const details = await OrderDetailService.getByProductId(productId, transaction);
//     expect(details).toBeDefined();
//     expect(details.length).toBeGreaterThan(0);

//     const firstDetail = details[0];
//     expect(firstDetail).toBeDefined();
//     expect(firstDetail!.product_id).toBe(productId);
//     expect(firstDetail!.order_id).toBe(orderId);
//     expect(firstDetail!.quantity).toBe(4);
//   });

//   it('should update an order detail', async () => {
//     const input = { order_id: orderId, product_id: productId, quantity: 2, unit_price: 100 };
//     const created = await OrderDetailService.create(input, transaction);

//     const updated = await OrderDetailService.update(created.order_detail_id!, { quantity: 5 }, transaction);
//     expect(updated).toBeDefined();
//     expect(updated!.quantity).toBe(5);
//   });

//   it('should delete an order detail', async () => {
//     const input = { order_id: orderId, product_id: productId, quantity: 2, unit_price: 100 };
//     const created = await OrderDetailService.create(input, transaction);

//     const deleted = await OrderDetailService.delete(created.order_detail_id!, transaction);
//     expect(deleted).toBe(true);

//     const found = await OrderDetailService.getById(created.order_detail_id!, transaction);
//     expect(found).toBeNull();
//   });
// });

// src/tests/integration/orderDetail.integration.test.ts
// src/tests/integration/orderDetail.integration.test.ts
// import { sequelize } from '../../models/entity';
// import { Transaction } from 'sequelize';
// import OrderDetailService from '../../services/orderDetail.service';
// import UserService from '../../services/user.service';
// import ProductService from '../../services/product.service';
// import CartService from '../../services/cart.service';
// import ItemCartService from '../../services/itemCart.service';
// import OrderService from '../../services/order.service';
// import { OrderDetailInput } from '../../dtos/orderDetail.dto';

// describe('OrderDetail Integration Tests (with services)', () => {
//   let transaction: Transaction;
//   let userId: number;
//   let productId: number;
//   let orderId: number;

//   beforeAll(async () => {
//     // 1️⃣ Crear usuario
//     const user = await UserService.create({
//       name: 'Integration User',
//       email: 'integration@example.com',
//       password: '123456',
//       address: 'Test Address',
//     });
//     userId = user.user_id!;

//     // 2️⃣ Crear carrito
//     await CartService.create({ user_id: userId });

//     // 3️⃣ Crear producto
//     const product = await ProductService.create({
//       name: 'Integration Product',
//       description: 'Producto de prueba',
//       price: 100,
//       stock: 10,
//       rating: 4,
//       brand: 'TestBrand',
//       category_id: 1, // puedes crear una categoría real si quieres
//     });
//     productId = product.product_id!;

//     // 4️⃣ Agregar producto al carrito
//     const cart = await CartService.getCartByUserId(userId);
//     await ItemCartService.create({
//       cart_id: cart!.cart_id,
//       product_id: productId,
//       quantity: 2,
//     });

//     // 5️⃣ Hacer checkout → genera Order y OrderDetails
//     const order = await OrderService.checkout(userId);
//     orderId = order.order_id;
//   });

//   beforeEach(async () => {
//     transaction = await sequelize.transaction();
//   });

//   afterEach(async () => {
//     await transaction.rollback();
//   });

//   afterAll(async () => {
//     // Limpiar
//     await ItemCartService.clearByUserId(userId);
//     await OrderService.deleteByUserId(userId);
//     await ProductService.delete(productId);
//     await UserService.delete(userId);
//     await sequelize.close();
//   });

//   it('should create an order detail', async () => {
//     const input: OrderDetailInput = {
//       order_id: orderId,
//       product_id: productId,
//       quantity: 3,
//       unit_price: 100,
//     };
//     const detail = await OrderDetailService.create(input);
//     expect(detail).toBeDefined();
//     expect(detail!.order_id).toBe(orderId);
//     expect(detail!.product_id).toBe(productId);
//     expect(detail!.quantity).toBe(3);
//     expect(Number(detail!.unit_price)).toBe(100);
//   });

//   it('should get order detail by ID', async () => {
//     const input: OrderDetailInput = {
//       order_id: orderId,
//       product_id: productId,
//       quantity: 1,
//       unit_price: 100,
//     };
//     const created = await OrderDetailService.create(input);

//     const found = await OrderDetailService.getById(created.order_detail_id);
//     expect(found).toBeDefined();
//     expect(found!.order_detail_id).toBe(created.order_detail_id);
//   });

//   it('should get order details by order ID', async () => {
//     const input: OrderDetailInput = {
//       order_id: orderId,
//       product_id: productId,
//       quantity: 4,
//       unit_price: 100,
//     };
//     await OrderDetailService.create(input);

//     const details = await OrderDetailService.getByOrderId(orderId);
//     expect(details).toBeDefined();
//     expect(details!.length).toBeGreaterThan(0);

//     const detail = details![0]!;
//     expect(detail!.order_id).toBe(orderId);
//     expect(detail!.product_id).toBe(productId);
//     expect(detail!.quantity).toBe(4);
//     expect(Number(detail!.unit_price)).toBe(100);
//   });

//   it('should get order details by product ID', async () => {
//     const input: OrderDetailInput = {
//       order_id: orderId,
//       product_id: productId,
//       quantity: 5,
//       unit_price: 100,
//     };
//     await OrderDetailService.create(input);

//     const details = await OrderDetailService.getByProductId(productId);
//     expect(details).toBeDefined();
//     expect(details!.length).toBeGreaterThan(0);

//     const detail = details![0]!;
//     expect(detail!.product_id).toBe(productId);
//     expect(detail!.order_id).toBe(orderId);
//     expect(detail!.quantity).toBe(5);
//     expect(Number(detail!.unit_price)).toBe(100);
//   });

//   it('should update an order detail', async () => {
//     const input: OrderDetailInput = {
//       order_id: orderId,
//       product_id: productId,
//       quantity: 2,
//       unit_price: 100,
//     };
//     const created = await OrderDetailService.create(input);

//     const updated = await OrderDetailService.update(created.order_detail_id, { quantity: 7 });
//     expect(updated).toBeDefined();
//     expect(updated!.quantity).toBe(7);
//   });

//   it('should delete an order detail', async () => {
//     const input: OrderDetailInput = {
//       order_id: orderId,
//       product_id: productId,
//       quantity: 2,
//       unit_price: 100,
//     };
//     const created = await OrderDetailService.create(input);

//     const deleted = await OrderDetailService.delete(created.order_detail_id);
//     expect(deleted).toBe(true);

//     const found = await OrderDetailService.getById(created.order_detail_id);
//     expect(found).toBeNull();
//   });
// });

// src/tests/integration/orderDetail.integration.test.ts
// import { Transaction } from 'sequelize';
// import { sequelize } from '../../models/entity';
// import OrderDetailService from '../../services/orderDetail.service';
// import OrderService from '../../services/order.service';
// import ItemCartService from '../../services/itemCart.service';
// import CartService from '../../services/cart.service';
// import ProductService from '../../services/product.service';
// import UserService from '../../services/user.service';
// import { OrderDetailInput } from '../../dtos/orderDetail.dto';

// describe('OrderDetail Integration Tests (with services)', () => {
//   let transaction: Transaction;
//   let userId: number;
//   let productId: number;
//   let orderId: number;

//   beforeAll(async () => {
//     // 1️⃣ Crear usuario
//     const user = await UserService.create({
//       name: 'Integration User',
//       email: 'integration@example.com',
//       password: '123456',
//       address: 'Test address',
//     });
//     userId = user.user_id!;

//     // 2️⃣ Crear producto
//     const product = await ProductService.create({
//       name: 'Integration Product',
//       description: 'Test product',
//       price: 100,
//       stock: 10,
//       rating: 4,
//       brand: 'TestBrand',
//       category_id: 1,
//       image: 'test.png',
//     });
//     productId = product.product_id!;

//     // 3️⃣ Crear carrito automáticamente al crear usuario o manualmente si tu CartService lo requiere
//     await CartService.getOrCreateCartForUser(userId);
//   });

//   beforeEach(async () => {
//     transaction = await sequelize.transaction();
//   });

//   afterEach(async () => {
//     await transaction.rollback();
//   });

//   afterAll(async () => {
//     // Vaciar carrito
//     const cart = await CartService.getCartByUserId(userId);
//     if (cart) await ItemCartService.clearByCartId(cart.cart_id);

//     // Eliminar la orden
//     if (orderId) await OrderService.delete(orderId);

//     // Eliminar producto y usuario
//     if (productId) await ProductService.delete(productId);
//     if (userId) await UserService.delete(userId);

//     await sequelize.close();
//   });

//   it('should create an order detail via checkout', async () => {
//     // Agregar item al carrito
//     await ItemCartService.create({ cart_id: (await CartService.getCartByUserId(userId))!.cart_id, product_id: productId, quantity: 3 });

//     // Checkout → genera order + orderDetails
//     const order = await OrderService.checkout(userId, transaction);
//     orderId = order.order_id!;

//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     expect(details.length).toBe(1);

//     const detail = details[0]!;
//     expect(detail.order_id).toBe(orderId);
//     expect(detail.product_id).toBe(productId);
//     expect(detail.quantity).toBe(3);
//     expect(Number(detail.unit_price)).toBe(100);
//   });

//   it('should get order detail by ID', async () => {
//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     const detail = details[0]!;

//     const found = await OrderDetailService.getById(detail.order_detail_id!, transaction);
//     expect(found!.order_detail_id).toBe(detail.order_detail_id!);
//     expect(found!.order_id).toBe(orderId);
//     expect(found!.product_id).toBe(productId);
//   });

//   it('should get order details by order ID', async () => {
//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     const detail = details[0]!;

//     expect(detail.order_id).toBe(orderId);
//     expect(detail.product_id).toBe(productId);
//   });

//   it('should get order details by product ID', async () => {
//     const details = await OrderDetailService.getByProductId(productId, transaction);
//     const detail = details[0]!;

//     expect(detail.product_id).toBe(productId);
//     expect(detail.order_id).toBe(orderId);
//   });

//   it('should update an order detail', async () => {
//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     const detail = details[0]!;

//     const updated = await OrderDetailService.update(detail.order_detail_id!, { quantity: 5 }, transaction);
//     expect(updated!.quantity).toBe(5);
//   });

//   it('should delete an order detail', async () => {
//     // Crear un detalle nuevo para test
//     const input: OrderDetailInput = {
//       order_id: orderId,
//       product_id: productId,
//       quantity: 1,
//       unit_price: 100,
//     };
//     const newDetail = await OrderDetailService.create(input, transaction);

//     const deleted = await OrderDetailService.delete(newDetail.order_detail_id!, transaction);
//     expect(deleted).toBe(true);

//     const found = await OrderDetailService.getById(newDetail.order_detail_id!, transaction);
//     expect(found).toBeNull();
//   });
// });

// src/tests/integration/orderDetail.integration.test.ts
// import { Transaction } from 'sequelize';
// import { sequelize } from '../../models/entity';
// import OrderDetailService from '../../services/orderDetail.service';
// import OrderService from '../../services/order.service';
// import ItemCartService from '../../services/itemCart.service';
// import CartService from '../../services/cart.service';
// import ProductService from '../../services/product.service';
// import UserService from '../../services/user.service';
// import { OrderDetailInput } from '../../dtos/orderDetail.dto';
// import { UserInput } from '../../dtos/user.dto';

// describe('OrderDetail Integration Tests with Transactions', () => {
//   let transaction: Transaction;
//   let userId: number;
//   let productId: number;
//   let orderId: number;

//   beforeAll(async () => {
//     // Crear usuario base
//     const userData: UserInput = {
//       name: 'Integration User',
//       email: 'integration@example.com',
//       password: '123456',
//       address: 'Test address',
//     };
//     const user = await UserService.create(userData);
//     userId = user.user_id!;

//     // Crear producto base
//     const product = await ProductService.create({
//       name: 'Integration Product',
//       description: 'Test product',
//       price: 100,
//       stock: 10,
//       rating: 4,
//       brand: 'TestBrand',
//       category_id: 1,
//       image: 'test.png',
//     });
//     productId = product.product_id!;
//   });

//   afterAll(async () => {
//     await ProductService.delete(productId);
//     await UserService.delete(userId);
//     await sequelize.close();
//   });

//   beforeEach(async () => {
//     transaction = await sequelize.transaction();
//     // Asegurar que el usuario tenga carrito
//     await CartService.getOrCreateCartForUser(userId, transaction);
//   });

//   afterEach(async () => {
//     await transaction.rollback();
//   });

//   it('should create an order detail via checkout', async () => {
//     const cart = await CartService.getCartByUserId(userId, transaction);
//     await ItemCartService.create({
//       cart_id: cart!.cart_id,
//       product_id: productId,
//       quantity: 3,
//     }, transaction);

//     const order = await OrderService.checkout(userId, transaction);
//     orderId = order.order_id!;

//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     expect(details.length).toBe(1);

//     const detail = details[0]!;
//     expect(detail.order_id).toBe(orderId);
//     expect(detail.product_id).toBe(productId);
//     expect(detail.quantity).toBe(3);
//     expect(Number(detail.unit_price)).toBe(100);
//   });

//   it('should get order detail by ID', async () => {
//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     const detail = details[0]!;

//     const found = await OrderDetailService.getById(detail.order_detail_id!, transaction);
//     expect(found!.order_detail_id).toBe(detail.order_detail_id!);
//     expect(found!.order_id).toBe(orderId);
//     expect(found!.product_id).toBe(productId);
//   });

//   it('should update an order detail', async () => {
//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     const detail = details[0]!;

//     const updated = await OrderDetailService.update(detail.order_detail_id!, { quantity: 5 }, transaction);
//     expect(updated!.quantity).toBe(5);
//   });

//   it('should delete an order detail', async () => {
//     const details = await OrderDetailService.getByOrderId(orderId, transaction);
//     const detail = details[0]!;

//     const deleted = await OrderDetailService.delete(detail.order_detail_id!, transaction);
//     expect(deleted).toBe(true);

//     const found = await OrderDetailService.getById(detail.order_detail_id!, transaction);
//     expect(found).toBeNull();
//   });
// });

// src/tests/integration/orderDetail.integration.test.ts
import { Transaction } from 'sequelize';
import { sequelize } from '../../models/entity';
import OrderDetailService from '../../services/orderDetail.service';
import OrderService from '../../services/order.service';
import ItemCartService from '../../services/itemCart.service';
import CartService from '../../services/cart.service';
import ProductService from '../../services/product.service';
import UserService from '../../services/user.service';
import { UserInput } from '../../dtos/user.dto';

describe('OrderDetail Integration Tests with Transactions', () => {
  let transaction: Transaction;
  let userId: number;
  let productId: number;
  let orderId: number;

  beforeAll(async () => {
    // Crear usuario
    const userData: UserInput = {
      name: 'Integration User',
      email: 'integration@example.com',
      password: '123456',
      address: 'Test address',
    };
    const user = await UserService.create(userData);
    userId = user.user_id!;

    // Crear producto
    const product = await ProductService.create({
      name: 'Integration Product',
      description: 'Test product',
      price: 100,
      stock: 10,
      rating: 4,
      brand: 'TestBrand',
      category_id: 1,
      image: 'test.png',
    });
    productId = product.product_id!;
  });

  beforeEach(async () => {
    transaction = await sequelize.transaction();

    // Crear carrito para el usuario
    const cart = await CartService.getOrCreateCartForUser(userId, transaction);

    // Agregar producto al carrito
    await ItemCartService.create({
      cart_id: cart.cart_id,
      product_id: productId,
      quantity: 3,
    }, transaction);

    // Checkout → genera orden + detalles
    const order = await OrderService.checkout(userId, transaction);
    orderId = order.order_id!;
  });

  afterEach(async () => {
    await transaction.rollback(); // ❌ Esto borra todo lo creado en cada test
  });

  afterAll(async () => {
    // Limpiar productos y usuarios
    await ProductService.delete(productId);
    await UserService.delete(userId);
    // No cerramos sequelize para no romper otros tests
  });

  it('should get order detail by ID', async () => {
    const details = await OrderDetailService.getByOrderId(orderId, transaction);
    const detail = details[0]!;

    const found = await OrderDetailService.getById(detail.order_detail_id!, transaction);
    expect(found!.order_detail_id).toBe(detail.order_detail_id!);
    expect(found!.order_id).toBe(orderId);
    expect(found!.product_id).toBe(productId);
  });

  it('should get order details by order ID', async () => {
    const details = await OrderDetailService.getByOrderId(orderId, transaction);
    const detail = details[0]!;

    expect(detail.order_id).toBe(orderId);
    expect(detail.product_id).toBe(productId);
  });

  it('should get order details by product ID', async () => {
    const details = await OrderDetailService.getByProductId(productId, transaction);
    const detail = details[0]!;

    expect(detail.product_id).toBe(productId);
    expect(detail.order_id).toBe(orderId);
  });

  it('should update an order detail', async () => {
    const details = await OrderDetailService.getByOrderId(orderId, transaction);
    const detail = details[0]!;

    const updated = await OrderDetailService.update(detail.order_detail_id!, { quantity: 5 }, transaction);
    expect(updated!.quantity).toBe(5);
  });

  it('should delete an order detail', async () => {
    // Crear un nuevo detalle para test de borrado
    const input = {
      order_id: orderId,
      product_id: productId,
      quantity: 1,
      unit_price: 100,
    };
    const newDetail = await OrderDetailService.create(input, transaction);

    const deleted = await OrderDetailService.delete(newDetail.order_detail_id!, transaction);
    expect(deleted).toBe(true);

    const found = await OrderDetailService.getById(newDetail.order_detail_id!, transaction);
    expect(found).toBeNull();
  });
});
