// src/tests/integration/order.integration.test.ts
import request from 'supertest';
import express from 'express';
import orderRoutes from '../../routes/order.routes';
import OrderModel from '../../models/implementations/mock/mockOrder';
import UserService from '../../services/user.service';
import ProductService from '../../services/product.service';
import CartService from '../../services/cart.service';
import MockItemCart from '../../models/implementations/mock/mockItemCart';
import { Product } from '../../models/entity/product.entity';

// Mocks de servicios
jest.mock('../../services/user.service');
jest.mock('../../services/product.service');
jest.mock('../../services/cart.service');
jest.mock('../../models/implementations/mock/mockItemCart');

// Mock middlewares de auth/roles
jest.mock('../../middlewares/auth.middleware', () => ({
  authenticateJWT: (_req: any, _res: any, next: any) => next(),
}));
jest.mock('../../middlewares/role.middleware', () => ({
  authorizeRole: () => (_req: any, _res: any, next: any) => next(),
  authorizeSelfOrAdmin: () => (_req: any, _res: any, next: any) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

// Clases mock para checkout
class MockCart {
  constructor(
    public cart_id: number,
    public user_id: number,
  ) {}
  getCartId() {
    return this.cart_id;
  }
}
class MockItem {
  constructor(
    public itemCart_id: number,
    public product_id: number,
    public quantity: number,
  ) {}
  getProductId() {
    return this.product_id;
  }
  getQuantity() {
    return this.quantity;
  }
}

describe('Order API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    OrderModel.clear();
  });

  it('GET /api/orders debería retornar todos los pedidos', async () => {
    const response = await request(app).get('/api/orders');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/orders debería crear una orden correctamente', async () => {
    (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1, name: 'Juan' });
    const mockProducts: Record<number, Product> = {
      1: new Product(
        1,
        'Whey Protein',
        120,
        'whey.jpg',
        1,
        15,
        4.5,
        'Optimum',
        'Proteína de suero',
      ),
      2: new Product(2, 'Creatina', 80, 'creatina.jpg', 1, 10, 4.7, 'MyProtein', 'Creatina pura'),
    };
    (ProductService.getById as jest.Mock).mockImplementation((id: number) =>
      Promise.resolve(mockProducts[id]),
    );
    (ProductService.decreaseStock as jest.Mock).mockResolvedValue({});

    const payload = {
      user_id: 1,
      total: 320,
      order_date: new Date().toISOString(),
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    };

    const response = await request(app).post('/api/orders').send(payload);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('order_id');
    expect(response.body.total).toBe(320);
    expect(response.body.details.length).toBe(2);
  });

  it('POST /api/orders debería fallar si el usuario no existe', async () => {
    (UserService.getById as jest.Mock).mockResolvedValue(undefined);
    const payload = {
      user_id: 999,
      total: 120,
      order_date: new Date().toISOString(),
      items: [{ productId: 1, quantity: 1 }],
    };

    const response = await request(app).post('/api/orders').send(payload);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Usuario no existe');
  });

  it('GET /api/orders/:id debería retornar una orden específica', async () => {
    const order = await OrderModel.create({
      user_id: 1,
      total: 100,
      items: [{ productId: 1, quantity: 2 }],
    });
    const response = await request(app).get(`/api/orders/${order.getId()}`);
    expect(response.status).toBe(200);
    expect(response.body.order_id).toBe(order.getId());
  });

  it('DELETE /api/orders/:id debería eliminar una orden', async () => {
    const order = await OrderModel.create({
      user_id: 1,
      total: 100,
      items: [{ productId: 1, quantity: 2 }],
    });
    const response = await request(app).delete(`/api/orders/${order.getId()}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Orden eliminada correctamente');
    const check = await OrderModel.getById(order.getId());
    expect(check).toBeUndefined();
  });

  it('POST /api/orders/checkout/:userId debería crear orden desde carrito', async () => {
    // Mock usuario
    (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1, name: 'Juan' });

    // Mock del carrito y items
    const mockCart = new MockCart(1, 1);
    const mockItems = [new MockItem(1, 1, 2), new MockItem(2, 2, 1)];

    // Mock de productos
    const mockProducts: Record<number, Product> = {
      1: new Product(
        1,
        'Whey Protein',
        120,
        'whey.jpg',
        1,
        15,
        4.5,
        'Optimum',
        'Proteína de suero',
      ),
      2: new Product(2, 'Creatina', 80, 'creatina.jpg', 1, 10, 4.7, 'MyProtein', 'Creatina pura'),
    };

    (CartService.getCartByUserId as jest.Mock).mockResolvedValue(mockCart);
    (MockItemCart.getByCartId as jest.Mock).mockResolvedValue(mockItems);
    (ProductService.getById as jest.Mock).mockImplementation((id) =>
      Promise.resolve(mockProducts[id]),
    );
    (ProductService.decreaseStock as jest.Mock).mockResolvedValue({});

    const response = await request(app).post('/api/orders/checkout/1');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('order_id');
    expect(response.body.total).toBe(320);
    expect(response.body.details.length).toBe(2);
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ product_id: 1, quantity: 2, unit_price: 120 }),
        expect.objectContaining({ product_id: 2, quantity: 1, unit_price: 80 }),
      ]),
    );
  });
});
