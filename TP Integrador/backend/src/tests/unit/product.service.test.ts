// tests/unit/product.service.test.ts
import productService from '../../services/product.service';
import ProductRepository from '../../repositories/product.repository';
import CategoryService from '../../services/category.service';
import { ProductInput } from '../../dtos/product.dto';
import { Product } from '../../models/entity/product.model';

jest.mock('../../repositories/product.repository');
jest.mock('../../services/category.service');

describe('ProductService - Reglas de negocio (Unit)', () => {
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

    // Mock del repositorio
    const fakeProduct = { ...input, product_id: 1 } as Product;
    (ProductRepository.create as jest.Mock).mockResolvedValue(fakeProduct);

    const created = await productService.create(input);

    expect(CategoryService.getById).toHaveBeenCalledWith(input.category_id, undefined);

    expect(ProductRepository.create).toHaveBeenCalledWith(
      {
        ...input,
        image: 'beta.jpg',
      },
      undefined,
    );

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

    await expect(productService.create(input)).rejects.toThrow('La categoría con id 999 no existe');

    expect(CategoryService.getById).toHaveBeenCalledWith(999, undefined);
  });

  it('disminuye stock correctamente', async () => {
    const fakeProduct = {
      product_id: 1,
      stock: 20,
    } as Product;

    // Mock del método del service (no del repo)
    jest.spyOn(productService, 'getById').mockResolvedValue(fakeProduct);

    (ProductRepository.update as jest.Mock).mockResolvedValue({
      ...fakeProduct,
      stock: 15,
    });

    const updated = await productService.decreaseStock(1, 5);

    expect(productService.getById).toHaveBeenCalledWith(1, undefined);

    expect(ProductRepository.update).toHaveBeenCalledWith(1, { stock: 15 }, undefined);

    expect(updated.stock).toBe(15);
  });

  it('lanza error si el stock es insuficiente', async () => {
    const fakeProduct = {
      product_id: 1,
      stock: 3,
    } as Product;

    jest.spyOn(productService, 'getById').mockResolvedValue(fakeProduct);

    await expect(productService.decreaseStock(1, 5)).rejects.toThrow('Stock insuficiente');

    expect(productService.getById).toHaveBeenCalledWith(1, undefined);
  });
});
