// import productService from '../../services/product.service';
// import CategoryService from '../../services/category.service';
// import mockProduct from '../../models/implementations/mock/mockProduct';
// import { Product } from '../../models/entity/product.entity';

// jest.mock('../../services/category.service');

// describe('ProductService - Reglas de negocio', () => {
//   beforeEach(() => {
//     mockProduct.clear(); // reinicia el mock
//     (CategoryService.getById as jest.Mock).mockResolvedValue({
//       category_id: 1,
//       name: 'Suplementos',
//     });
//   });

//   it('crea un producto correctamente', async () => {
//     const input = {
//       name: 'Beta Alanina',
//       price: 120,
//       image: 'beta.jpg',
//       category_id: 1,
//       stock: 15,
//       rating: 4.3,
//       brand: 'Now',
//       description: 'Suplemento de resistencia',
//     };

//     const created = await productService.create(input);

//     expect(created).toBeInstanceOf(Product);
//     expect(created.name).toBe('Beta Alanina');
//     expect(created.stock).toBe(15);
//   });

//   it('lanza error si la categoría no existe', async () => {
//     (CategoryService.getById as jest.Mock).mockResolvedValue(undefined);

//     const input = {
//       name: 'Omega 3',
//       price: 100,
//       image: 'omega3.jpg',
//       category_id: 999, // categoría inexistente
//       stock: 10,
//       rating: 4.0,
//       brand: 'Now',
//       description: 'Suplemento',
//     };

//     await expect(productService.create(input)).rejects.toThrow('La categoría con id 999 no existe');
//   });

//   it('disminuye el stock correctamente', async () => {
//     const product = await productService.create({
//       name: 'Creatina',
//       price: 80,
//       image: 'creatina.jpg',
//       category_id: 1,
//       stock: 20,
//       rating: 4.7,
//       brand: 'MyProtein',
//       description: 'Creatina pura',
//     });

//     const updated = await productService.decreaseStock(product.product_id, 5);
//     expect(updated?.stock).toBe(15);
//   });

//   it('no permite disminuir stock si es insuficiente', async () => {
//     const product = await productService.create({
//       name: 'Whey',
//       price: 100,
//       image: 'whey.jpg',
//       category_id: 1,
//       stock: 5,
//       rating: 4.5,
//       brand: 'Optimum',
//       description: 'Proteína',
//     });

//     await expect(productService.decreaseStock(product.product_id, 10)).rejects.toThrow(
//       'Stock insuficiente',
//     );
//   });

//   it('aumenta el stock correctamente', async () => {
//     const product = await productService.create({
//       name: 'Glutamina',
//       price: 50,
//       image: 'glutamina.jpg',
//       category_id: 1,
//       stock: 10,
//       rating: 4.6,
//       brand: 'Optimum',
//       description: 'Glutamina en polvo',
//     });

//     const updated = await productService.increaseStock(product.product_id, 5);
//     expect(updated?.stock).toBe(15);
//   });

//   it('elimina un producto correctamente', async () => {
//     const product = await productService.create({
//       name: 'Multivitamínico',
//       price: 60,
//       image: 'multi.jpg',
//       category_id: 1,
//       stock: 30,
//       rating: 4.2,
//       brand: 'Now',
//       description: 'Vitaminas diarias',
//     });

//     const deleted = await productService.delete(product.product_id);
//     expect(deleted).toBe(true);

//     const check = await productService.getById(product.product_id);
//     expect(check).toBeUndefined();
//   });
// });

// tests/unit/product.service.test.ts
import productService from '../../services/product.service';
import ProductRepository from '../../repositories/product.repository';
import CategoryService from '../../services/category.service';
import { ProductInput } from '../../dtos/product.dto';
import { Product } from '../../models/entity/product.model';

jest.mock('../../repositories/product.repository');
jest.mock('../../services/category.service');

describe('ProductService - Reglas de negocio (nuevo test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crea un producto correctamente', async () => {
    const input: ProductInput = {
      name: 'Beta Alanina',
      price: 120,
      image: 'beta.jpg',
      category_id: 1,
      stock: 15,
      rating: 4.3,
      brand: 'Now',
      description: 'Suplemento de resistencia',
    };

    // Mock de la categoría
    (CategoryService.getById as jest.Mock).mockResolvedValue({
      category_id: 1,
      name: 'Suplementos',
    });

    // Mock de creación en repositorio
    const fakeProduct = { ...input, product_id: 1 } as Product;
    (ProductRepository.create as jest.Mock).mockResolvedValue(fakeProduct);

    const created = await productService.create(input);

    expect(CategoryService.getById).toHaveBeenCalledWith(input.category_id);
    expect(ProductRepository.create).toHaveBeenCalledWith(input);
    expect(created.product_id).toBe(1);
    expect(created.name).toBe('Beta Alanina');
  });

  it('lanza error si la categoría no existe', async () => {
    (CategoryService.getById as jest.Mock).mockResolvedValue(undefined);

    const input: ProductInput = {
      name: 'Omega 3',
      price: 100,
      image: 'omega3.jpg',
      category_id: 999,
      stock: 10,
      rating: 4.0,
      brand: 'Now',
      description: 'Suplemento',
    };

    await expect(productService.create(input)).rejects.toThrow(
      'La categoría con id 999 no existe',
    );
  });

  it('disminuye stock correctamente', async () => {
    const fakeProduct = {
      product_id: 1,
      stock: 20,
    } as Product;

    (productService.getById as jest.Mock) = jest.fn().mockResolvedValue(fakeProduct);
    (ProductRepository.update as jest.Mock) = jest.fn().mockImplementation((id, data) => ({
      ...fakeProduct,
      stock: data.stock,
    }));

    const updated = await productService.decreaseStock(1, 5);

    expect(updated.stock).toBe(15);
    expect(ProductRepository.update).toHaveBeenCalledWith(1, { stock: 15 });
  });

  it('lanza error si el stock es insuficiente', async () => {
    const fakeProduct = { product_id: 1, stock: 3 } as Product;
    (productService.getById as jest.Mock) = jest.fn().mockResolvedValue(fakeProduct);

    await expect(productService.decreaseStock(1, 5)).rejects.toThrow('Stock insuficiente');
  });
});
