// src/tests/unit/itemCart.service.test.ts
import ItemCartService from '../../services/itemCart.service';
import ItemCartRepository from '../../repositories/itemCart.repository';
import CartService from '../../services/cart.service';
import { ItemCartInput } from '../../dtos/itemCart.dto';
import { Product } from '../../models/entity/product.model';
import { ItemCart } from '../../models/entity/itemCart.model';

// Mocks
jest.mock('../../repositories/itemCart.repository');
jest.mock('../../models/entity/product.model');
jest.mock('../../services/cart.service', () => ({
  __esModule: true,
  default: {
    getById: jest.fn(),
  },
}));

describe('ItemCart Service - Unit Tests', () => {
  const sampleItem: ItemCart = {
    item_id: 1,
    cart_id: 1,
    product_id: 2,
    quantity: 3,
    unit_price: 100,
  } as ItemCart;

  const sampleInput: ItemCartInput = {
    cart_id: 1,
    product_id: 2,
    quantity: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================
  it('should create a new item in the cart', async () => {
    (CartService.getById as jest.Mock).mockResolvedValue({
      cart_id: 1,
    });

    (Product.findByPk as jest.Mock).mockResolvedValue({
      product_id: 2,
      price: 100,
    });

    (ItemCartRepository.create as jest.Mock).mockResolvedValue(sampleItem);

    const created = await ItemCartService.create(sampleInput);

    expect(CartService.getById).toHaveBeenCalledWith(1, undefined);

    expect(Product.findByPk).toHaveBeenCalledWith(2, { transaction: null });

    expect(ItemCartRepository.create).toHaveBeenCalledWith(
      {
        ...sampleInput,
        unit_price: 100,
      },
      null,
    );

    expect(created).toBe(sampleItem);
  });

  it('should throw error if cart does not exist', async () => {
    (CartService.getById as jest.Mock).mockResolvedValue(null);

    await expect(ItemCartService.create(sampleInput)).rejects.toThrow(
      `Carrito con id ${sampleInput.cart_id} no existe`,
    );

    expect(CartService.getById).toHaveBeenCalledWith(sampleInput.cart_id, undefined);
  });

  it('should throw error if product does not exist', async () => {
    (CartService.getById as jest.Mock).mockResolvedValue({
      cart_id: 1,
    });

    (Product.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(ItemCartService.create(sampleInput)).rejects.toThrow(
      `Producto con id ${sampleInput.product_id} no existe`,
    );

    expect(Product.findByPk).toHaveBeenCalledWith(sampleInput.product_id, {
      transaction: null,
    });
  });

  // =========================
  // GET
  // =========================
  it('should get all items', async () => {
    (ItemCartRepository.getAll as jest.Mock).mockResolvedValue([sampleItem]);

    const items = await ItemCartService.getAll();

    expect(ItemCartRepository.getAll).toHaveBeenCalledWith(null);
    expect(items[0]).toBe(sampleItem);
  });

  it('should get item by item_id', async () => {
    (ItemCartRepository.getByItemId as jest.Mock).mockResolvedValue(sampleItem);

    const item = await ItemCartService.getByItemId(1);

    expect(ItemCartRepository.getByItemId).toHaveBeenCalledWith(1, null);
    expect(item).toBe(sampleItem);
  });

  it('should get items by cart_id', async () => {
    (ItemCartRepository.getByCartId as jest.Mock).mockResolvedValue([sampleItem]);

    const items = await ItemCartService.getByCartId(1);

    expect(ItemCartRepository.getByCartId).toHaveBeenCalledWith(1, null);
    expect(items[0]!.cart_id).toBe(1);
  });

  it('should get items by product_id', async () => {
    (ItemCartRepository.getByProductId as jest.Mock).mockResolvedValue([sampleItem]);

    const items = await ItemCartService.getByProductId(2);

    expect(ItemCartRepository.getByProductId).toHaveBeenCalledWith(2, null);
    expect(items[0]!.product_id).toBe(2);
  });

  // =========================
  // DELETE
  // =========================
  it('should delete an item', async () => {
    (ItemCartRepository.delete as jest.Mock).mockResolvedValue(true);

    await expect(ItemCartService.delete(1)).resolves.not.toThrow();

    expect(ItemCartRepository.delete).toHaveBeenCalledWith(1, null);
  });

  it('should throw error if item does not exist on delete', async () => {
    (ItemCartRepository.delete as jest.Mock).mockResolvedValue(false);

    await expect(ItemCartService.delete(999)).rejects.toThrow('ItemCart con id 999 no existe');

    expect(ItemCartRepository.delete).toHaveBeenCalledWith(999, null);
  });

  // =========================
  // CLEAR BY CART ID
  // =========================
  it('should clear all items by cart_id', async () => {
    (ItemCartRepository.clearByCartId as jest.Mock).mockResolvedValue(undefined);

    await expect(ItemCartService.clearByCartId(1)).resolves.not.toThrow();

    expect(ItemCartRepository.clearByCartId).toHaveBeenCalledWith(1, null);
  });
});
