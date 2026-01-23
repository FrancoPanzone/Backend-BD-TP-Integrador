// src/tests/unit/cart.service.test.ts
import cartService from '../../services/cart.service';
import CartRepository from '../../repositories/cart.repository';
import { Cart } from '../../models/entity/cart.model';

jest.mock('../../repositories/cart.repository');

describe('CartService (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new cart', async () => {
    const fakeCart = {
      cart_id: 1,
      user_id: 3,
    } as Cart;

    (CartRepository.create as jest.Mock).mockResolvedValue(fakeCart);

    const result = await cartService.create({ user_id: 3 });

    expect(CartRepository.create).toHaveBeenCalledWith(
      { user_id: 3 },
      null
    );
    expect(result).toBe(fakeCart);
  });

  it('should return all carts', async () => {
    const fakeCarts = [
      { cart_id: 1, user_id: 3 },
      { cart_id: 2, user_id: 4 },
    ] as Cart[];

    (CartRepository.getAll as jest.Mock).mockResolvedValue(fakeCarts);

    const result = await cartService.getAll();

    expect(CartRepository.getAll).toHaveBeenCalledWith(null);
    expect(result).toEqual(fakeCarts);
  });

  it('should get cart by cart ID', async () => {
    const fakeCart = { cart_id: 3, user_id: 10 } as Cart;

    (CartRepository.getById as jest.Mock).mockResolvedValue(fakeCart);

    const result = await cartService.getById(3);

    expect(CartRepository.getById).toHaveBeenCalledWith(
      3,
      null
    );
    expect(result).toBe(fakeCart);
  });

  it('should get cart by user ID', async () => {
    const fakeCart = { cart_id: 5, user_id: 99 } as Cart;

    (CartRepository.getCartByUserId as jest.Mock).mockResolvedValue(fakeCart);

    const result = await cartService.getCartByUserId(99);

    expect(CartRepository.getCartByUserId).toHaveBeenCalledWith(
      99,
      null
    );
    expect(result?.user_id).toBe(99);
  });

  it('should delete a cart', async () => {
    (CartRepository.delete as jest.Mock).mockResolvedValue(true);

    await cartService.delete(1);

    expect(CartRepository.delete).toHaveBeenCalledWith(
      1,
      null
    );
  });

  it('should throw error if cart does not exist when deleting', async () => {
    (CartRepository.delete as jest.Mock).mockResolvedValue(false);

    await expect(cartService.delete(999)).rejects.toThrow(
      'El carrito con id 999 no existe'
    );

    expect(CartRepository.delete).toHaveBeenCalledWith(
      999,
      null
    );
  });
});
