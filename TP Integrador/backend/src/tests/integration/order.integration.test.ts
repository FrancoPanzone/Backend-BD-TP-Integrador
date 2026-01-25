// src/tests/integration/order.integration.test.ts
import orderService from '../../services/order.service';
import userService from '../../services/user.service';
import ProductService from '../../services/product.service';
import { sequelize } from '../../models/entity';
import { Transaction } from 'sequelize';
import { UserInput } from '../../dtos/user.dto';
import { OrderStatus } from '../../models/entity/order.model';

describe('Order Integration Tests with Transactions', () => {
  let transaction: Transaction;
  let userId: number;
  let productId: number;

  beforeEach(async () => {
    transaction = await sequelize.transaction();

    // Crear usuario
    const userData: UserInput = {
      name: 'Test User Order',
      email: 'testorder@example.com',
      password: 'Password123',
      address: '123 Test Street',
    };

    const user = await userService.create(userData, transaction);
    userId = user.user_id;

    // Crear producto
    const product = await ProductService.create(
      {
        name: 'Producto Test Order',
        description: 'Desc',
        price: 100,
        stock: 10,
        rating: 4,
        brand: 'Test',
        image: '/img/test.webp',
        category_id: 1,
      },
      transaction,
    );

    productId = product.product_id!;
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('should create an order with details and update stock', async () => {
    const order = await orderService.create(
      {
        user_id: userId,
        items: [{ productId, quantity: 2 }],
      },
      transaction,
    );

    // Asegurar que existen los detalles
    expect(order).toBeDefined();
    expect(order.details).toBeDefined();
    expect(order.details!.length).toBe(1);

    // Primer (y único) detalle
    const [detail] = order.details!;
    expect(detail).toBeDefined();
    expect(detail!.product_id).toBe(productId);
    expect(detail!.quantity).toBe(2);
    expect(Number(detail!.unit_price)).toBe(100);

    // Stock actualizado
    const updatedProduct = await ProductService.getById(productId, transaction);
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct!.stock).toBe(8); // 10 - 2 = 8
  });

  it('should not allow creating order with insufficient stock', async () => {
    await expect(
      orderService.create(
        {
          user_id: userId,
          items: [{ productId, quantity: 100 }],
        },
        transaction,
      ),
    ).rejects.toThrow('Stock insuficiente');
  });

  it('should get orders by user', async () => {
    const order = await orderService.create(
      {
        user_id: userId,
        items: [{ productId, quantity: 1 }],
      },
      transaction,
    );

    const orders = await orderService.getByUserId(userId, transaction);

    expect(orders.length).toBeGreaterThanOrEqual(1);

    const fetched = orders.find((o) => o.order_id === order.order_id);
    expect(fetched).toBeDefined();
    expect(fetched!.details).toBeDefined();
    expect(fetched!.details!.length).toBe(1);
  });

  it('should update order status', async () => {
    const order = await orderService.create(
      {
        user_id: userId,
        items: [{ productId, quantity: 1 }],
      },
      transaction,
    );

    const updated = await orderService.updateStatus(
      order.order_id,
      'paid' as OrderStatus,
      transaction,
    );

    expect(updated).toBeDefined();
    expect(updated.status).toBe('paid');
  });

  it('should delete an order', async () => {
    const order = await orderService.create(
      {
        user_id: userId,
        items: [{ productId, quantity: 1 }],
      },
      transaction,
    );

    await orderService.delete(order.order_id, transaction);

    await expect(orderService.getById(order.order_id, transaction)).rejects.toThrow(
      'Orden no encontrada',
    );
  });
});
