// tests/unit/order.service.test.ts
import OrderService from '../../services/order.service';
import OrderRepository from '../../repositories/order.repository';
import UserService from '../../services/user.service';
import CartService from '../../services/cart.service';
import ItemCartService from '../../services/itemCart.service';
import { Order } from '../../models/entity/order.model';

jest.mock('../../repositories/order.repository');
jest.mock('../../services/user.service');
jest.mock('../../services/cart.service');
jest.mock('../../services/itemCart.service');

describe('OrderService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una orden si el usuario existe', async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1 });

      const mockOrder = new Order();
      mockOrder.order_id = 1;
      mockOrder.user_id = 1;
      mockOrder.status = 'pending';
      mockOrder.total = 100;

      (OrderRepository.create as jest.Mock).mockResolvedValue(mockOrder);

      const input = {
        user_id: 1,
        items: [{ productId: 101, quantity: 2 }],
      };

      const result = await OrderService.create(input);

      expect(UserService.getById).toHaveBeenCalledWith(1, undefined);
      expect(OrderRepository.create).toHaveBeenCalledWith(input, null);
      expect(result).toBe(mockOrder);
    });

    it('lanza error si el usuario no existe', async () => {
      (UserService.getById as jest.Mock).mockResolvedValue(null);

      await expect(OrderService.create({ user_id: 999, items: [] })).rejects.toThrow(
        'Usuario no existe',
      );
    });
  });

  describe('checkout', () => {
    it('crea una orden a partir del carrito', async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1 });
      (CartService.getCartByUserId as jest.Mock).mockResolvedValue({ cart_id: 10 });

      (ItemCartService.getByCartId as jest.Mock).mockResolvedValue([
        { product_id: 101, quantity: 2 },
        { product_id: 102, quantity: 1 },
      ]);

      (ItemCartService.clearByCartId as jest.Mock).mockResolvedValue(undefined);

      const mockOrder = new Order();
      mockOrder.order_id = 1;
      mockOrder.user_id = 1;
      mockOrder.status = 'pending';

      (OrderRepository.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await OrderService.checkout(1);

      expect(UserService.getById).toHaveBeenCalledWith(1, undefined);
      expect(CartService.getCartByUserId).toHaveBeenCalledWith(1, undefined);
      expect(ItemCartService.getByCartId).toHaveBeenCalledWith(10, undefined);

      expect(OrderRepository.create).toHaveBeenCalledWith(
        {
          user_id: 1,
          items: [
            { productId: 101, quantity: 2 },
            { productId: 102, quantity: 1 },
          ],
        },
        null,
      );

      expect(ItemCartService.clearByCartId).toHaveBeenCalledWith(10, undefined);
      expect(result).toBe(mockOrder);
    });

    it('lanza error si el carrito está vacío', async () => {
      (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1 });
      (CartService.getCartByUserId as jest.Mock).mockResolvedValue({ cart_id: 10 });
      (ItemCartService.getByCartId as jest.Mock).mockResolvedValue([]);

      await expect(OrderService.checkout(1)).rejects.toThrow('El carrito está vacío');
    });
  });

  describe('updateStatus', () => {
    it('actualiza el estado de la orden', async () => {
      const mockOrder = new Order();
      mockOrder.order_id = 1;
      mockOrder.status = 'pending';

      (OrderRepository.getById as jest.Mock).mockResolvedValue(mockOrder);
      (OrderRepository.updateStatus as jest.Mock).mockResolvedValue(mockOrder);

      const result = await OrderService.updateStatus(1, 'paid');

      expect(OrderRepository.getById).toHaveBeenCalledWith(1, undefined);
      expect(OrderRepository.updateStatus).toHaveBeenCalledWith(mockOrder, 'paid', undefined);

      expect(result).toBe(mockOrder);
    });

    it('lanza error si la orden no existe', async () => {
      (OrderRepository.getById as jest.Mock).mockResolvedValue(null);

      await expect(OrderService.updateStatus(999, 'paid')).rejects.toThrow('Orden no encontrada');
    });
  });

  describe('delete', () => {
    it('elimina una orden existente', async () => {
      (OrderRepository.delete as jest.Mock).mockResolvedValue(true);

      await expect(OrderService.delete(1)).resolves.toBeUndefined();
      expect(OrderRepository.delete).toHaveBeenCalledWith(1, null);
    });

    it('lanza error si la orden no existe', async () => {
      (OrderRepository.delete as jest.Mock).mockResolvedValue(false);

      await expect(OrderService.delete(999)).rejects.toThrow('Orden no encontrada');
    });
  });
});
