// src/tests/integration/cart.integration.test.ts
import CartService from '../../services/cart.service';
import userService from '../../services/user.service';
import { sequelize } from '../../models/entity';
import { Transaction } from 'sequelize';
import { UserInput } from '../../dtos/user.dto';

describe('Cart Integration Tests with Transactions', () => {
  let transaction: Transaction;
  let userId: number;

  beforeEach(async () => {
    transaction = await sequelize.transaction();

    // Creamos un usuario de prueba
    const userData: UserInput = {
      name: 'Test User Cart',
      email: 'testcart@example.com',
      password: 'Password123',
      address: '123 Test Street',
    };

    const user = await userService.create(userData, transaction);
    userId = user.user_id;
  });

  afterEach(async () => {
    await transaction.rollback(); // limpia DB automáticamente
  });

  it('should create or return cart for user', async () => {
    const cart = await CartService.getOrCreateCartForUser(userId, transaction);

    expect(cart).toBeDefined();
    expect(cart.user_id).toBe(userId);
  });

  it('should get cart by user ID', async () => {
    const cart = await CartService.getOrCreateCartForUser(userId, transaction);
    const fetched = await CartService.getCartByUserId(userId, transaction);

    expect(fetched).toBeDefined();
    expect(fetched!.cart_id).toBe(cart.cart_id);
  });

  it('should delete cart by ID', async () => {
    const cart = await CartService.getOrCreateCartForUser(userId, transaction);

    await CartService.delete(cart.cart_id, transaction);

    const fetched = await CartService.getById(cart.cart_id, transaction);
    expect(fetched).toBeUndefined();
  });

  it('should delete cart by user ID', async () => {
    await CartService.getOrCreateCartForUser(userId, transaction);

    await CartService.deleteByUserId(userId, transaction);

    const fetched = await CartService.getCartByUserId(userId, transaction);
    expect(fetched).toBeUndefined();
  });
});
