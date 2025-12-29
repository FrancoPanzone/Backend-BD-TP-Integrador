// tests/unit/order.service.mock.test.ts
// import OrderService from '../../services/order.service';
// import OrderModel from '../../models/implementations/mock/mockOrder';
// import ProductService from '../../services/product.service';
// import UserService from '../../services/user.service';
// import { Order } from '../../models/entity/order.entity';

// import CartService from '../../services/cart.service';
// import MockItemCart from '../../models/implementations/mock/mockItemCart';

// jest.mock('../../services/product.service');
// jest.mock('../../services/user.service');
// jest.mock('../../models/implementations/mock/mockOrder');

// jest.mock('../../services/cart.service');
// jest.mock('../../models/implementations/mock/mockItemCart');

// describe('OrderService Unit Tests - con jest.mock', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('create', () => {
//     it('debería crear una orden si el usuario existe y hay stock suficiente', async () => {
//       //  Mock usuario
//       (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1, name: 'Juan' });

//       //  Mock productos
//       (ProductService.getById as jest.Mock).mockImplementation(async (id: number) => {
//         if (id === 101) return { product_id: 101, name: 'Camiseta', price: 20, stock: 10 };
//         if (id === 102) return { product_id: 102, name: 'Pantalón', price: 40, stock: 5 };
//         return undefined;
//       });

//       (ProductService.decreaseStock as jest.Mock).mockResolvedValue({} as any);

//       //  Mock OrderModel.create
//       (OrderModel.create as jest.Mock).mockImplementation(async (data: any) => {
//         return new Order(1, data.user_id, 'pending', data.total, new Date());
//       });

//       const input = {
//         user_id: 1,
//         items: [
//           { productId: 101, quantity: 2 },
//           { productId: 102, quantity: 1 },
//         ],
//       };

//       const result = await OrderService.create(input);

//       expect(UserService.getById).toHaveBeenCalledWith(1);
//       expect(ProductService.getById).toHaveBeenCalledTimes(2);
//       expect(ProductService.decreaseStock).toHaveBeenCalledTimes(2);
//       expect(OrderModel.create).toHaveBeenCalledWith(
//         expect.objectContaining({ user_id: 1, total: 80 }),
//       );
//       expect(result).toBeInstanceOf(Order);
//       expect(result.total).toBe(80);
//       expect(result.status).toBe('pending');
//     });

//     it('debería lanzar error si el usuario no existe', async () => {
//       (UserService.getById as jest.Mock).mockResolvedValue(undefined);

//       const input = {
//         user_id: 999,
//         items: [{ productId: 1, quantity: 1 }],
//       };

//       await expect(OrderService.create(input)).rejects.toThrow('Usuario no existe');
//     });

//     it('debería lanzar error si no hay stock suficiente', async () => {
//       (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1 } as any);
//       (ProductService.getById as jest.Mock).mockResolvedValue({
//         product_id: 1,
//         name: 'Zapato',
//         price: 50,
//         stock: 1,
//       });

//       const input = {
//         user_id: 1,
//         items: [{ productId: 1, quantity: 3 }],
//       };

//       await expect(OrderService.create(input)).rejects.toThrow('Stock insuficiente para Zapato');
//     });
//   });

//   describe('updateStatus', () => {
//     it('debería actualizar el estado de una orden existente', async () => {
//       const mockOrder = new Order(1, 1, 'pending', 200, new Date());

//       (OrderModel.getById as jest.Mock).mockResolvedValue(mockOrder);
//       (OrderModel.updateStatus as jest.Mock).mockResolvedValue(mockOrder);

//       const result = await OrderService.updateStatus(1, 'paid');

//       expect(OrderModel.updateStatus).toHaveBeenCalledWith(1, 'paid');
//       expect(result).toBe(mockOrder);
//     });

//     it('debería lanzar error si la orden no existe', async () => {
//       (OrderModel.getById as jest.Mock).mockResolvedValue(undefined);

//       await expect(OrderService.updateStatus(999, 'paid')).rejects.toThrow('Orden no encontrada');
//     });
//   });

//   describe('delete', () => {
//     it('debería eliminar una orden existente', async () => {
//       (OrderModel.delete as jest.Mock).mockResolvedValue(true);

//       const result = await OrderService.delete(1);

//       expect(OrderModel.delete).toHaveBeenCalledWith(1);
//       expect(result).toBe(true);
//     });

//     it('debería retornar false si la orden no existe', async () => {
//       (OrderModel.delete as jest.Mock).mockResolvedValue(false);

//       const result = await OrderService.delete(999);

//       expect(OrderModel.delete).toHaveBeenCalledWith(999);
//       expect(result).toBe(false);
//     });
//   });

//   describe('OrderService - checkout', () => {
//     beforeEach(() => {
//       jest.clearAllMocks();
//     });

//     it('debería crear una orden a partir del carrito del usuario', async () => {
//       // Mock usuario
//       (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1, name: 'Juan' });

//       // Mock carrito
//       (CartService.getCartByUserId as jest.Mock).mockResolvedValue({ getCartId: () => 10 });

//       // Mock items del carrito
//       (MockItemCart.getByCartId as jest.Mock).mockResolvedValue([
//         { getProductId: () => 101, getQuantity: () => 2 },
//         { getProductId: () => 102, getQuantity: () => 1 },
//       ]);
//       (MockItemCart.clearByCartId as jest.Mock).mockResolvedValue(undefined);

//       // Mock _createOrder (privado)
//       const orderMock = new Order(1, 1, 'pending', 80, new Date());
//       (OrderService as any)._createOrder = jest.fn().mockResolvedValue(orderMock);

//       const result = await OrderService.checkout(1);

//       expect(UserService.getById).toHaveBeenCalledWith(1);
//       expect(CartService.getCartByUserId).toHaveBeenCalledWith(1);
//       expect(MockItemCart.getByCartId).toHaveBeenCalledWith(10);
//       expect((OrderService as any)._createOrder).toHaveBeenCalledWith(1, [
//         { productId: 101, quantity: 2 },
//         { productId: 102, quantity: 1 },
//       ]);
//       expect(MockItemCart.clearByCartId).toHaveBeenCalledWith(10);
//       expect(result).toBe(orderMock);
//     });

//     it('debería lanzar error si el carrito está vacío', async () => {
//       (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1 });
//       (CartService.getCartByUserId as jest.Mock).mockResolvedValue({ getCartId: () => 10 });
//       (MockItemCart.getByCartId as jest.Mock).mockResolvedValue([]);

//       await expect(OrderService.checkout(1)).rejects.toThrow('El carrito está vacío');
//     });
//   });
// });


// tests/unit/order.service.mock.test.ts
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
      (UserService.getById as jest.Mock).mockResolvedValue({ user_id: 1, name: 'Juan' });

      const mockOrder = new Order();
      mockOrder.order_id = 1;
      mockOrder.user_id = 1;
      mockOrder.status = 'pending';
      mockOrder.total = 100;

      (OrderRepository.create as jest.Mock).mockResolvedValue(mockOrder);

      const input = {
        user_id: 1,
        items: [
          { productId: 101, quantity: 2 },
          { productId: 102, quantity: 1 },
        ],
      };

      const result = await OrderService.create(input);

      expect(UserService.getById).toHaveBeenCalledWith(1);
      expect(OrderRepository.create).toHaveBeenCalledWith(input);
      expect(result).toBe(mockOrder);
      expect(result.status).toBe('pending');
    });

    it('lanza error si el usuario no existe', async () => {
      (UserService.getById as jest.Mock).mockResolvedValue(undefined);

      const input = { user_id: 999, items: [{ productId: 1, quantity: 1 }] };

      await expect(OrderService.create(input)).rejects.toThrow('Usuario no existe');
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
      mockOrder.total = 80;

      (OrderRepository.create as jest.Mock).mockResolvedValue(mockOrder);

      const result = await OrderService.checkout(1);

      expect(UserService.getById).toHaveBeenCalledWith(1);
      expect(CartService.getCartByUserId).toHaveBeenCalledWith(1);
      expect(ItemCartService.getByCartId).toHaveBeenCalledWith(10);
      expect(OrderRepository.create).toHaveBeenCalledWith({
        user_id: 1,
        items: [
          { productId: 101, quantity: 2 },
          { productId: 102, quantity: 1 },
        ],
      });
      expect(ItemCartService.clearByCartId).toHaveBeenCalledWith(10);
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

      (OrderRepository.updateStatus as jest.Mock).mockResolvedValue(mockOrder);

      const result = await OrderService.updateStatus(1, 'paid');

      expect(OrderRepository.updateStatus).toHaveBeenCalledWith(1, 'paid');
      expect(result).toBe(mockOrder);
    });

    it('lanza error si la orden no existe', async () => {
      (OrderRepository.updateStatus as jest.Mock).mockResolvedValue(null);
      await expect(OrderService.updateStatus(999, 'paid')).rejects.toThrow('Orden no encontrada');
    });
  });

  describe('delete', () => {
    it('elimina una orden existente', async () => {
      (OrderRepository.delete as jest.Mock).mockResolvedValue(true);

      await expect(OrderService.delete(1)).resolves.toBeUndefined();
      expect(OrderRepository.delete).toHaveBeenCalledWith(1);
    });

    it('lanza error si la orden no existe', async () => {
      (OrderRepository.delete as jest.Mock).mockResolvedValue(false);

      await expect(OrderService.delete(999)).rejects.toThrow('Orden no encontrada');
    });
  });
});
