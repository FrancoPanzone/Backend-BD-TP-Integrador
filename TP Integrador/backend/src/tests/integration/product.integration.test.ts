// src/tests/integration/product.integration.test.ts
import ProductService from '../../services/product.service';
import CategoryService from '../../services/category.service';
import { sequelize } from '../../models/entity';
import { Transaction } from 'sequelize';

describe('Product Integration Tests with Transactions', () => {
  let transaction: Transaction;
  let testCategoryId: number;
  let testProductId: number;

  beforeEach(async () => {
    transaction = await sequelize.transaction();

    // Crear categoría de prueba en la transacción
    const category = await CategoryService.create(
      {
        name: 'Suplementos Test',
        description: 'Categoría para productos de prueba',
      },
      transaction,
    );
    testCategoryId = category.category_id!;
  });

  afterEach(async () => {
    await transaction.rollback(); // Limpia todo automáticamente
  });

  it('should create a new product', async () => {
    const product = await ProductService.create(
      {
        name: 'Proteína de suero',
        description: 'Proteína de suero aislada',
        price: 1200,
        stock: 100,
        category_id: testCategoryId,
        rating: 4.5, // obligatorio
        brand: 'WheyTest', // obligatorio
        image: '/images/products/test.webp',
      },
      transaction,
    );

    expect(product).toBeDefined();
    expect(product.name).toBe('Proteína de suero');
    testProductId = product.product_id!;
  });

  it('should get product by ID', async () => {
    const product = await ProductService.create(
      {
        name: 'Creatina Test',
        description: 'Creatina para fuerza',
        price: 800,
        stock: 50,
        category_id: testCategoryId,
        rating: 4,
        brand: 'CreatinaTest',
      },
      transaction,
    );

    const found = await ProductService.getById(product.product_id!, transaction);

    expect(found).toBeDefined();
    expect(found?.name).toBe('Creatina Test');
  });

  it('should update a product', async () => {
    const product = await ProductService.create(
      {
        name: 'Aminoácidos Test',
        description: 'BCAA',
        price: 600,
        stock: 30,
        category_id: testCategoryId,
        rating: 4,
        brand: 'BCAATest',
      },
      transaction,
    );

    const updated = await ProductService.update(product.product_id!, { stock: 40 }, transaction);

    expect(updated).not.toBeNull();
    expect(updated!.stock).toBe(40);
  });

  it('should delete a product', async () => {
    const product = await ProductService.create(
      {
        name: 'Pre-entreno Test',
        description: 'Energizante',
        price: 900,
        stock: 20,
        category_id: testCategoryId,
        rating: 3.5,
        brand: 'PreTest',
      },
      transaction,
    );

    const deleted = await ProductService.delete(product.product_id!, transaction);
    expect(deleted).toBe(true);
  });

  it('should decrease product stock', async () => {
    const product = await ProductService.create(
      {
        name: 'Glutamina Test',
        description: 'Recuperación muscular',
        price: 500,
        stock: 50,
        category_id: testCategoryId,
        rating: 4,
        brand: 'GlutaTest',
      },
      transaction,
    );

    const updated = await ProductService.decreaseStock(product.product_id!, 20, transaction);
    expect(updated.stock).toBe(30);
  });

  it('should increase product stock', async () => {
    const product = await ProductService.create(
      {
        name: 'Omega 3 Test',
        description: 'Ácidos grasos esenciales',
        price: 700,
        stock: 25,
        category_id: testCategoryId,
        rating: 4.2,
        brand: 'OmegaTest',
      },
      transaction,
    );

    const updated = await ProductService.increaseStock(product.product_id!, 15, transaction);
    expect(updated.stock).toBe(40);
  });

  it('should not decrease stock below 0', async () => {
    const product = await ProductService.create(
      {
        name: 'Vitamina C Test',
        description: 'Inmunidad',
        price: 300,
        stock: 10,
        category_id: testCategoryId,
        rating: 4,
        brand: 'VitCTest',
      },
      transaction,
    );

    await expect(
      ProductService.decreaseStock(product.product_id!, 20, transaction),
    ).rejects.toThrow('Stock insuficiente');
  });
});
