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
    await ItemCartService.create(
      {
        cart_id: cart.cart_id,
        product_id: productId,
        quantity: 3,
      },
      transaction,
    );

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

    const updated = await OrderDetailService.update(
      detail.order_detail_id!,
      { quantity: 5 },
      transaction,
    );
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
