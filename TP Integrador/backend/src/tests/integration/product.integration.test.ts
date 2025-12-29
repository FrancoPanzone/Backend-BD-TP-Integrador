// tests/integration/product.service.int.spec.ts

import productService from '../../services/product.service';
import CategoryService from '../../services/category.service';
import { ProductInput } from '../../dtos/product.dto';
import mockProduct from '../../models/implementations/mock/mockProduct';
import { Product } from '../../models/entity/product.entity';

jest.mock('../../services/category.service'); // Mock de CategoryService

describe('ProductService - Integration Tests', () => {
  // Limpiar el mock antes de cada test
  beforeEach(() => {
    mockProduct.clear();
    (CategoryService.getById as jest.Mock).mockResolvedValue({
      category_id: 1,
      name: 'Suplementos',
    });
  });

  it('debería crear, obtener, actualizar y eliminar un producto', async () => {
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

    const created: Product = await productService.create(input);
    expect(created.product_id).toBeDefined();
    expect(created.name).toBe(input.name);

    const found = await productService.getById(created.product_id);
    expect(found).toBeInstanceOf(Product);
    expect(found?.name).toBe(input.name);

    const updated = await productService.update(created.product_id, { price: 130, stock: 20 });
    expect(updated?.price).toBe(130);
    expect(updated?.stock).toBe(20);

    const decreased = await productService.decreaseStock(created.product_id, 5);
    expect(decreased?.stock).toBe(15);

    const increased = await productService.increaseStock(created.product_id, 10);
    expect(increased?.stock).toBe(25);

    const deleted = await productService.delete(created.product_id);
    expect(deleted).toBe(true);

    const shouldBeUndefined = await productService.getById(created.product_id);
    expect(shouldBeUndefined).toBeUndefined();
  });

  it('debería retornar todos los productos creados', async () => {
    const inputs: ProductInput[] = [
      {
        name: 'Whey',
        price: 100,
        image: 'whey.jpg',
        category_id: 1,
        stock: 10,
        rating: 4.5,
        brand: 'Optimum',
        description: 'Proteína',
      },
      {
        name: 'Creatina',
        price: 80,
        image: 'creatina.jpg',
        category_id: 1,
        stock: 5,
        rating: 4.7,
        brand: 'MyProtein',
        description: 'Creatina pura',
      },
    ];

    for (const input of inputs) {
      await productService.create(input);
    }

    const all = await productService.getAll();
    expect(all.length).toBe(2);
    expect(all.map((p) => p.name)).toEqual(expect.arrayContaining(['Whey', 'Creatina']));
  });

  // Casos negativos y validaciones
  it('lanza error si la categoría no existe', async () => {
    (CategoryService.getById as jest.Mock).mockResolvedValue(undefined);

    const input: ProductInput = {
      name: 'Omega 3',
      price: 100,
      image: 'omega3.jpg',
      category_id: 999, // categoría inexistente
      stock: 10,
      rating: 4.0,
      brand: 'Now',
      description: 'Suplemento',
    };

    await expect(productService.create(input)).rejects.toThrow('La categoría con id 999 no existe');
  });

  it('no permite disminuir stock si es insuficiente', async () => {
    const product = await productService.create({
      name: 'Whey',
      price: 100,
      image: 'whey.jpg',
      category_id: 1,
      stock: 5,
      rating: 4.5,
      brand: 'Optimum',
      description: 'Proteína',
    });

    await expect(productService.decreaseStock(product.product_id, 10)).rejects.toThrow(
      'Stock insuficiente',
    );
  });

  it('lanza error al actualizar un producto inexistente', async () => {
    const updated = await productService.update(999, { price: 200 });
    expect(updated).toBeUndefined();
  });

  it('lanza error al eliminar un producto inexistente', async () => {
    const deleted = await productService.delete(999);
    expect(deleted).toBe(false);
  });

  it('lanza error al obtener un producto inexistente', async () => {
    const found = await productService.getById(999);
    expect(found).toBeUndefined();
  });
});
