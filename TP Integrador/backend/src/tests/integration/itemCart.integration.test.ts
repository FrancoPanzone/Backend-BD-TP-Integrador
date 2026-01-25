// src/tests/integration/itemCart.integration.test.ts
import itemCartService from '../../services/itemCart.service';
import cartService from '../../services/cart.service';
import userService from '../../services/user.service';
import { sequelize } from '../../models/entity';
import { Transaction } from 'sequelize';
import { UserInput } from '../../dtos/user.dto';
import { CartInput } from '../../dtos/cart.dto';
import ProductService from '../../services/product.service';

describe('ItemCart Integration Tests with Transactions', () => {
  let transaction: Transaction;
  let userId: number;
  let cartId: number;
  let productId: number;

  beforeEach(async () => {
    transaction = await sequelize.transaction();

    // Crear usuario
    const userData: UserInput = {
      name: 'Test User ItemCart',
      email: 'testitemcart@example.com',
      password: 'Password123',
      address: '123 Test Street',
    };
    const user = await userService.create(userData, transaction);
    userId = user.user_id;

    // Crear carrito
    const cart = await cartService.getOrCreateCartForUser(userId, transaction);
    cartId = cart.cart_id;

    // Crear producto
    const product = await ProductService.create(
      {
        name: 'Producto Test',
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

  it('should add item to cart', async () => {
    const item = await itemCartService.create(
      { cart_id: cartId, product_id: productId, quantity: 2 },
      transaction,
    );

    expect(item).toBeDefined();
    expect(item.cart_id).toBe(cartId);
    expect(item.product_id).toBe(productId);
    expect(item.quantity).toBe(2);
    expect(Number(item.unit_price)).toBe(100);
  });

  //   it('should get items by cart ID', async () => {
  //     await itemCartService.create({ cart_id: cartId, product_id: productId, quantity: 1 }, transaction);
  //     const items = await itemCartService.getByCartId(cartId, transaction);

  //     expect(items.length).toBe(1);
  //     expect(items[0].cart_id).toBe(cartId);
  //   });

  it('should get items by cart ID', async () => {
    // Creamos un item
    await itemCartService.create(
      { cart_id: cartId, product_id: productId, quantity: 1 },
      transaction,
    );

    // Obtenemos los items del carrito
    const items = await itemCartService.getByCartId(cartId, transaction);

    // Aseguramos que hay al menos un item
    expect(items.length).toBe(1);

    // Tomamos el primer item y decimos a TS que no es undefined
    const item = items[0]!;
    expect(item.cart_id).toBe(cartId);
  });

  it('should delete item from cart', async () => {
    const item = await itemCartService.create(
      { cart_id: cartId, product_id: productId, quantity: 1 },
      transaction,
    );
    await itemCartService.delete(item.item_id, transaction);

    const fetched = await itemCartService.getByItemId(item.item_id, transaction);
    expect(fetched).toBeUndefined();
  });

  it('should clear all items from cart', async () => {
    await itemCartService.create(
      { cart_id: cartId, product_id: productId, quantity: 1 },
      transaction,
    );
    await itemCartService.create(
      { cart_id: cartId, product_id: productId, quantity: 2 },
      transaction,
    );

    await itemCartService.clearByCartId(cartId, transaction);

    const items = await itemCartService.getByCartId(cartId, transaction);
    expect(items.length).toBe(0);
  });
});
