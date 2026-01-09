// // src/services/itemCart.service.test.ts
// import ItemCartService from '../../services/itemCart.service';
// import MockItemCart from '../../models/implementations/mock/mockItemCart';
// import ProductService from '../../services/product.service';
// import { ItemCart } from '../../models/entity/itemCart.entity';
// import { ItemCartInput } from '../../dtos/itemCart.dto';

// jest.mock('../../models/implementations/mock/mockItemCart');
// jest.mock('../../services/product.service');

// describe('ItemCart Service - Unit Tests', () => {
//   const sampleItem: ItemCart = new ItemCart(
//     1, // item_id
//     1, // cart_id
//     2, // product_id
//     3, // quantity
//   );

//   const sampleInput: ItemCartInput = {
//     cart_id: 1,
//     product_id: 2,
//     quantity: 3,
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // CREATE
//   it('debería crear un nuevo item en el carrito', async () => {
//     // Mockear que el producto existe
//     (ProductService.getById as jest.Mock).mockResolvedValue({ product_id: 2 });

//     // Mockear creación
//     (MockItemCart.create as jest.Mock).mockResolvedValue(sampleItem);

//     const created = await ItemCartService.create(sampleInput);

//     expect(created).toBe(sampleItem);
//     expect(MockItemCart.create).toHaveBeenCalledWith(sampleInput);
//   });

//   it('debería lanzar error si se intenta crear un item con un product_id inexistente', async () => {
//     (ProductService.getById as jest.Mock).mockResolvedValueOnce(undefined);

//     await expect(ItemCartService.create(sampleInput)).rejects.toThrow(
//       `Producto con id ${sampleInput.product_id} no existe`,
//     );
//   });

//   // GET
//   it('debería obtener todos los items', async () => {
//     (MockItemCart.getAll as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getAll();

//     expect(items.length).toBeGreaterThan(0);
//     expect(items[0]).toBe(sampleItem);
//   });

//   it('debería obtener un item por item_id', async () => {
//     (MockItemCart.getByItemId as jest.Mock).mockResolvedValue(sampleItem);

//     const item = await ItemCartService.getByItemId(1);

//     expect(item).toBe(sampleItem);
//   });

//   it('debería obtener items por cart_id', async () => {
//     (MockItemCart.getByCartId as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getByCartId(1);

//     expect(items.length).toBe(1);
//     expect(items[0]!.getCartId()).toBe(1);
//   });

//   it('debería obtener items por product_id', async () => {
//     (MockItemCart.getByProductId as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getByProductId(2);

//     expect(items.length).toBe(1);
//     expect(items[0]!.getProductId()).toBe(2);
//   });

//   // DELETE
//   it('debería eliminar un item correctamente', async () => {
//     (MockItemCart.delete as jest.Mock).mockResolvedValue(true);

//     await expect(ItemCartService.delete(1)).resolves.not.toThrow();
//   });

//   it('debería lanzar error al intentar eliminar un item inexistente', async () => {
//     (MockItemCart.delete as jest.Mock).mockResolvedValue(false);

//     await expect(ItemCartService.delete(999)).rejects.toThrow('Item carrito con id 999 no existe');
//   });

//   // CLEAR BY CART ID
//   it('debería limpiar todos los items por cart_id', async () => {
//     (MockItemCart.clearByCartId as jest.Mock).mockResolvedValue(undefined);

//     await expect(ItemCartService.clearByCartId(1)).resolves.not.toThrow();

//     expect(MockItemCart.clearByCartId).toHaveBeenCalledWith(1);
//   });
// });

// src/tests/unit/itemCart.service.test.ts

// CON EL ITEMCART QUE USA EL UNIT_PRICE DEL MODELO
// import ItemCartService from '../../services/itemCart.service';
// import { ItemCart } from '../../models/entity/itemCart.model';
// import { Product } from '../../models/entity/product.model';
// import { ItemCartInput } from '../../dtos/itemCart.dto';

// jest.mock('../../models/entity/itemCart.model');
// jest.mock('../../models/entity/product.model');

// describe('ItemCart Service - Unit Tests', () => {
//   const sampleItem: ItemCart = {
//     item_id: 1,
//     cart_id: 1,
//     product_id: 2,
//     quantity: 3,
//     unit_price: 100,
//   } as unknown as ItemCart;

//   const sampleInput: ItemCartInput = {
//     cart_id: 1,
//     product_id: 2,
//     quantity: 3,
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // CREATE
//   it('should create a new item in the cart', async () => {
//     // Mock Product
//     (Product.findByPk as jest.Mock).mockResolvedValue({ product_id: 2, price: 100 });

//     // Mock ItemCart.create
//     (ItemCart.create as jest.Mock).mockResolvedValue(sampleItem);

//     const created = await ItemCartService.create(sampleInput);

//     expect(Product.findByPk).toHaveBeenCalledWith(2);
//     expect(ItemCart.create).toHaveBeenCalledWith({
//       cart_id: 1,
//       product_id: 2,
//       quantity: 3,
//       unit_price: 100,
//     });
//     expect(created).toBe(sampleItem);
//   });

//   it('should throw error if product does not exist', async () => {
//     (Product.findByPk as jest.Mock).mockResolvedValue(null);

//     await expect(ItemCartService.create(sampleInput)).rejects.toThrow(
//       `Producto con id ${sampleInput.product_id} no existe`,
//     );
//   });

//   // GET
//   it('should get all items', async () => {
//     (ItemCart.findAll as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getAll();

//     expect(ItemCart.findAll).toHaveBeenCalled();
//     expect(items.length).toBe(1);
//     expect(items[0]).toBe(sampleItem);
//   });

//   it('should get item by item_id', async () => {
//     (ItemCart.findByPk as jest.Mock).mockResolvedValue(sampleItem);

//     const item = await ItemCartService.getByItemId(1);

//     expect(ItemCart.findByPk).toHaveBeenCalledWith(1);
//     expect(item).toBe(sampleItem);
//   });

//   it('should get items by cart_id', async () => {
//     (ItemCart.findAll as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getByCartId(1);

//     expect(ItemCart.findAll).toHaveBeenCalledWith({ where: { cart_id: 1 } });
//     expect(items[0]!.cart_id).toBe(1); // "!" asegura a TS que no es undefined
//   });

//   it('should get items by product_id', async () => {
//     (ItemCart.findAll as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getByProductId(2);

//     expect(ItemCart.findAll).toHaveBeenCalledWith({ where: { product_id: 2 } });
//     expect(items[0]!.product_id).toBe(2); // aquí también
//   });

//   // DELETE
//   it('should delete an item', async () => {
//     const destroyMock = jest.fn().mockResolvedValue(undefined);
//     (ItemCart.findByPk as jest.Mock).mockResolvedValue({ destroy: destroyMock });

//     await expect(ItemCartService.delete(1)).resolves.not.toThrow();
//     expect(ItemCart.findByPk).toHaveBeenCalledWith(1);
//     expect(destroyMock).toHaveBeenCalled();
//   });

//   it('should throw error if item does not exist on delete', async () => {
//     (ItemCart.findByPk as jest.Mock).mockResolvedValue(null);

//     await expect(ItemCartService.delete(999)).rejects.toThrow(
//       'ItemCart con id 999 no existe',
//     );
//   });

//   // CLEAR BY CART ID
//   it('should clear all items by cart_id', async () => {
//     const destroyMock = jest.fn().mockResolvedValue(undefined);
//     (ItemCart.destroy as jest.Mock).mockResolvedValue(undefined);

//     await expect(ItemCartService.clearByCartId(1)).resolves.not.toThrow();
//     expect(ItemCart.destroy).toHaveBeenCalledWith({ where: { cart_id: 1 } });
//   });
// });


// src/tests/unit/itemCart.service.test.ts
// USA EL CREATE DEL REPO CON UN NUEVO INPUT PARA UNIT_PRICE
// import ItemCartService from '../../services/itemCart.service';
// import ItemCartRepository from '../../repositories/itemCart.repository';
// import { ItemCartInput } from '../../dtos/itemCart.dto';
// import { Product } from '../../models/entity/product.model';
// import { ItemCart } from '../../models/entity/itemCart.model';

// jest.mock('../../repositories/itemCart.repository');
// jest.mock('../../models/entity/product.model');

// describe('ItemCart Service - Unit Tests', () => {
//   const sampleItem: ItemCart = {
//     item_id: 1,
//     cart_id: 1,
//     product_id: 2,
//     quantity: 3,
//     unit_price: 100,
//   } as unknown as ItemCart;

//   const sampleInput: ItemCartInput = {
//     cart_id: 1,
//     product_id: 2,
//     quantity: 3,
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // CREATE
//   it('should create a new item in the cart', async () => {
//     // Mock Product
//     (Product.findByPk as jest.Mock).mockResolvedValue({ product_id: 2, price: 100 });

//     // Mock repository
//     (ItemCartRepository.create as jest.Mock).mockResolvedValue(sampleItem);

//     const created = await ItemCartService.create(sampleInput);

//     expect(Product.findByPk).toHaveBeenCalledWith(2);
//     expect(ItemCartRepository.create).toHaveBeenCalledWith({
//       ...sampleInput,
//       unit_price: 100,
//     });
//     expect(created).toBe(sampleItem);
//   });

//   it('should throw error if product does not exist', async () => {
//     (Product.findByPk as jest.Mock).mockResolvedValue(null);

//     await expect(ItemCartService.create(sampleInput)).rejects.toThrow(
//       `Producto con id ${sampleInput.product_id} no existe`,
//     );
//   });

//   // GET
//   it('should get all items', async () => {
//     (ItemCartRepository.getAll as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getAll();

//     expect(ItemCartRepository.getAll).toHaveBeenCalled();
//     expect(items.length).toBe(1);
//     expect(items[0]).toBe(sampleItem);
//   });

//   it('should get item by item_id', async () => {
//     (ItemCartRepository.getByItemId as jest.Mock).mockResolvedValue(sampleItem);

//     const item = await ItemCartService.getByItemId(1);

//     expect(ItemCartRepository.getByItemId).toHaveBeenCalledWith(1);
//     expect(item).toBe(sampleItem);
//   });

//   it('should get items by cart_id', async () => {
//     (ItemCartRepository.getByCartId as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getByCartId(1);

//     expect(ItemCartRepository.getByCartId).toHaveBeenCalledWith(1);
//     expect(items[0]!.cart_id).toBe(1);
//   });

//   it('should get items by product_id', async () => {
//     (ItemCartRepository.getByProductId as jest.Mock).mockResolvedValue([sampleItem]);

//     const items = await ItemCartService.getByProductId(2);

//     expect(ItemCartRepository.getByProductId).toHaveBeenCalledWith(2);
//     expect(items[0]!.product_id).toBe(2);
//   });

//   // DELETE
//   it('should delete an item', async () => {
//     (ItemCartRepository.delete as jest.Mock).mockResolvedValue(true);

//     await expect(ItemCartService.delete(1)).resolves.not.toThrow();
//     expect(ItemCartRepository.delete).toHaveBeenCalledWith(1);
//   });

//   it('should throw error if item does not exist on delete', async () => {
//     (ItemCartRepository.delete as jest.Mock).mockResolvedValue(false);

//     await expect(ItemCartService.delete(999)).rejects.toThrow(
//       'ItemCart con id 999 no existe',
//     );
//   });

//   // CLEAR BY CART ID
//   it('should clear all items by cart_id', async () => {
//     (ItemCartRepository.clearByCartId as jest.Mock).mockResolvedValue(undefined);

//     await expect(ItemCartService.clearByCartId(1)).resolves.not.toThrow();
//     expect(ItemCartRepository.clearByCartId).toHaveBeenCalledWith(1);
//   });
// });

// src/tests/unit/itemCart.service.test.ts
import ItemCartService from '../../services/itemCart.service';
import ItemCartRepository from '../../repositories/itemCart.repository';
import { ItemCartInput } from '../../dtos/itemCart.dto';
import { Product } from '../../models/entity/product.model';
import { ItemCart } from '../../models/entity/itemCart.model';

jest.mock('../../repositories/itemCart.repository');
jest.mock('../../models/entity/product.model');

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

  // CREATE
  it('should create a new item in the cart', async () => {
    (Product.findByPk as jest.Mock).mockResolvedValue({
      product_id: 2,
      price: 100,
    });

    (ItemCartRepository.create as jest.Mock).mockResolvedValue(sampleItem);

    const created = await ItemCartService.create(sampleInput);

    expect(Product.findByPk).toHaveBeenCalledWith(
      2,
      { transaction: null }
    );

    expect(ItemCartRepository.create).toHaveBeenCalledWith(
      {
        ...sampleInput,
        unit_price: 100,
      },
      null
    );

    expect(created).toBe(sampleItem);
  });

  it('should throw error if product does not exist', async () => {
    (Product.findByPk as jest.Mock).mockResolvedValue(null);

    await expect(ItemCartService.create(sampleInput)).rejects.toThrow(
      `Producto con id ${sampleInput.product_id} no existe`
    );

    expect(Product.findByPk).toHaveBeenCalledWith(
      sampleInput.product_id,
      { transaction: null }
    );
  });

  // GET
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

  // DELETE
  it('should delete an item', async () => {
    (ItemCartRepository.delete as jest.Mock).mockResolvedValue(true);

    await expect(ItemCartService.delete(1)).resolves.not.toThrow();

    expect(ItemCartRepository.delete).toHaveBeenCalledWith(1, null);
  });

  it('should throw error if item does not exist on delete', async () => {
    (ItemCartRepository.delete as jest.Mock).mockResolvedValue(false);

    await expect(ItemCartService.delete(999)).rejects.toThrow(
      'ItemCart con id 999 no existe'
    );

    expect(ItemCartRepository.delete).toHaveBeenCalledWith(999, null);
  });

  // CLEAR BY CART ID
  it('should clear all items by cart_id', async () => {
    (ItemCartRepository.clearByCartId as jest.Mock).mockResolvedValue(undefined);

    await expect(ItemCartService.clearByCartId(1)).resolves.not.toThrow();

    expect(ItemCartRepository.clearByCartId).toHaveBeenCalledWith(1, null);
  });
});
