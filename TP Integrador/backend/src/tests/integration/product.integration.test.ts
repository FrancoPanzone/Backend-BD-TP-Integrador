// tests/integration/product.service.int.spec.ts

// import productService from '../../services/product.service';
// import CategoryService from '../../services/category.service';
// import { ProductInput } from '../../dtos/product.dto';
// import mockProduct from '../../models/implementations/mock/mockProduct';
// import { Product } from '../../models/entity/product.entity';

// jest.mock('../../services/category.service'); // Mock de CategoryService

// describe('ProductService - Integration Tests', () => {
//   // Limpiar el mock antes de cada test
//   beforeEach(() => {
//     mockProduct.clear();
//     (CategoryService.getById as jest.Mock).mockResolvedValue({
//       category_id: 1,
//       name: 'Suplementos',
//     });
//   });

//   it('debería crear, obtener, actualizar y eliminar un producto', async () => {
//     const input: ProductInput = {
//       name: 'Beta Alanina',
//       price: 120,
//       image: 'beta.jpg',
//       category_id: 1,
//       stock: 15,
//       rating: 4.3,
//       brand: 'Now',
//       description: 'Suplemento de resistencia',
//     };

//     const created: Product = await productService.create(input);
//     expect(created.product_id).toBeDefined();
//     expect(created.name).toBe(input.name);

//     const found = await productService.getById(created.product_id);
//     expect(found).toBeInstanceOf(Product);
//     expect(found?.name).toBe(input.name);

//     const updated = await productService.update(created.product_id, { price: 130, stock: 20 });
//     expect(updated?.price).toBe(130);
//     expect(updated?.stock).toBe(20);

//     const decreased = await productService.decreaseStock(created.product_id, 5);
//     expect(decreased?.stock).toBe(15);

//     const increased = await productService.increaseStock(created.product_id, 10);
//     expect(increased?.stock).toBe(25);

//     const deleted = await productService.delete(created.product_id);
//     expect(deleted).toBe(true);

//     const shouldBeUndefined = await productService.getById(created.product_id);
//     expect(shouldBeUndefined).toBeUndefined();
//   });

//   it('debería retornar todos los productos creados', async () => {
//     const inputs: ProductInput[] = [
//       {
//         name: 'Whey',
//         price: 100,
//         image: 'whey.jpg',
//         category_id: 1,
//         stock: 10,
//         rating: 4.5,
//         brand: 'Optimum',
//         description: 'Proteína',
//       },
//       {
//         name: 'Creatina',
//         price: 80,
//         image: 'creatina.jpg',
//         category_id: 1,
//         stock: 5,
//         rating: 4.7,
//         brand: 'MyProtein',
//         description: 'Creatina pura',
//       },
//     ];

//     for (const input of inputs) {
//       await productService.create(input);
//     }

//     const all = await productService.getAll();
//     expect(all.length).toBe(2);
//     expect(all.map((p) => p.name)).toEqual(expect.arrayContaining(['Whey', 'Creatina']));
//   });

//   // Casos negativos y validaciones
//   it('lanza error si la categoría no existe', async () => {
//     (CategoryService.getById as jest.Mock).mockResolvedValue(undefined);

//     const input: ProductInput = {
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

//   it('lanza error al actualizar un producto inexistente', async () => {
//     const updated = await productService.update(999, { price: 200 });
//     expect(updated).toBeUndefined();
//   });

//   it('lanza error al eliminar un producto inexistente', async () => {
//     const deleted = await productService.delete(999);
//     expect(deleted).toBe(false);
//   });

//   it('lanza error al obtener un producto inexistente', async () => {
//     const found = await productService.getById(999);
//     expect(found).toBeUndefined();
//   });
// });

// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import app from '../../app'; // tu express app
// import AuthService from '../../services/auth.service';
// import { User } from '../../models/entity/user.model';
// import { Product } from '../../models/entity/product.model';
// import CategoryService from '../../services/category.service';

// describe('Product Integration Tests', () => {
//   let adminToken: string;
//   let testCategoryId: number;
//   let createdProductId: number;

//   beforeAll(async () => {
//     // 1️⃣ Logueamos al admin y generamos token
//     const adminUser: User | null = await AuthService.validateUserByName(
//       'Administrador',
//       'admin123'
//     );
//     if (!adminUser) throw new Error('Usuario admin no encontrado');
//     adminToken = await AuthService.generateToken(adminUser);

//     // 2️⃣ Creamos categoría de prueba
//     const category = await CategoryService.create({
//       name: 'Suplementos',
//       description: 'Categoría para productos de prueba',
//     });
//     testCategoryId = category.category_id!;
//   });

//   afterAll(async () => {
//     // Limpiamos la categoría de prueba
//     await CategoryService.delete(testCategoryId);
//   });

//   it('should create a new product', async () => {
//     const res = await request(app)
//       .post('/api/products')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({
//         name: 'Proteína Whey',
//         description: 'Proteína de suero',
//         price: 49.99,
//         stock: 100,
//         category_id: testCategoryId,
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.name).toBe('Proteína Whey');
//     createdProductId = res.body.product_id;
//   });

//   it('should get all products', async () => {
//     const res = await request(app).get('/api/products');
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('should get product by ID', async () => {
//     const res = await request(app).get(`/api/products/${createdProductId}`);
//     expect(res.status).toBe(200);
//     expect(res.body.product_id).toBe(createdProductId);
//   });

//   it('should update the product', async () => {
//     const res = await request(app)
//       .patch(`/api/products/${createdProductId}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({ price: 54.99 });

//     expect(res.status).toBe(200);
//     expect(res.body.price).toBe(54.99);
//   });

//   it('should delete the product', async () => {
//     const res = await request(app)
//       .delete(`/api/products/${createdProductId}`)
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('Producto eliminado correctamente');
//   });
// });

// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import app from '../../app';
// import AuthService from '../../services/auth.service';
// import UserService from '../../services/user.service';
// import CategoryService from '../../services/category.service';
// import ProductService from '../../services/product.service';

// let adminToken: string;
// let testCategoryId: number;
// let testProductId: number;

// describe('Product Integration Tests', () => {
//   beforeAll(async () => {
//     // 1️⃣ Obtenemos el usuario admin real
//     const adminUser = await UserService.getByName('Administrador');
//     if (!adminUser) throw new Error('Usuario admin no encontrado');

//     adminToken = await AuthService.generateToken(adminUser);

//     // 2️⃣ Creamos una categoría de prueba
//     const category = await CategoryService.create({
//       name: 'Suplementos Test',
//       description: 'Categoría para productos de prueba',
//     });
//     testCategoryId = category.category_id!;
//   });

//   afterAll(async () => {
//     // Limpiamos productos de prueba
//     if (testProductId) {
//       await ProductService.delete(testProductId);
//     }
//     // Limpiamos categoría de prueba
//     if (testCategoryId) {
//       await CategoryService.delete(testCategoryId);
//     }
//   });

//   it('should create a new product', async () => {
//     const res = await request(app)
//       .post('/api/products')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({
//         name: 'Proteína Whey',
//         description: 'Proteína de suero',
//         price: 1200,
//         stock: 100,
//         category_id: testCategoryId,
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.name).toBe('Proteína Whey');
//     expect(res.body.category_id).toBe(testCategoryId);

//     testProductId = res.body.product_id; // guardamos para los siguientes tests
//   });

//   it('should get all products', async () => {
//     const res = await request(app).get('/api/products');

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.find((p: any) => p.product_id === testProductId)).toBeDefined();
//   });

//   it('should get product by ID', async () => {
//     const res = await request(app).get(`/api/products/${testProductId}`);

//     expect(res.status).toBe(200);
//     expect(res.body.product_id).toBe(testProductId);
//     expect(res.body.name).toBe('Proteína Whey');
//   });

//   it('should update the product', async () => {
//     const res = await request(app)
//       .patch(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({
//         price: 1300,
//         stock: 90,
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.price).toBe(1300);
//     expect(res.body.stock).toBe(90);
//   });

//   it('should delete the product', async () => {
//     const res = await request(app)
//       .delete(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('Producto eliminado correctamente');

//     // opcional: confirmamos que ya no existe
//     const check = await request(app).get(`/api/products/${testProductId}`);
//     expect(check.status).toBe(404);
//   });
// });

// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import { testAdminToken } from '../setupTests';
// import app from '../../app';
// import CategoryService from '../../services/category.service';

// describe('Product Integration Tests', () => {
//   let testCategoryId: number;
//   let testProductId: number;

//   const apiKey = process.env.API_KEY!; // 🔹 Asegúrate de que esté en .env.test

//   beforeAll(async () => {
//     // 1️⃣ Crear categoría de prueba
//     const category = await CategoryService.create({
//       name: 'Suplementos Test',
//       description: 'Categoría para productos de prueba',
//     });

//     testCategoryId = category.category_id!;
//   });

//   afterAll(async () => {
//     // 2️⃣ Limpiar producto
//     if (testProductId) {
//       await request(app)
//         .delete(`/api/products/${testProductId}`)
//         .set('Authorization', `Bearer ${testAdminToken}`)
//         .set('x-api-key', apiKey);
//     }

//     // Opcional: limpiar categoría si tu servicio lo permite
//   });

//   it('should create a new product', async () => {
//     const res = await request(app)
//       .post('/api/products')
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey) // 🔹 API Key obligatoria
//       .send({
//         name: 'Proteína de suero',
//         description: 'Proteína de suero aislada',
//         price: 1200,
//         stock: 100,
//         category_id: testCategoryId,
//       });

//     expect(res.status).toBe(201);
//     testProductId = res.body.product_id;
//   });

//   it('should get all products', async () => {
//     const res = await request(app)
//       .get('/api/products')
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('should get product by ID', async () => {
//     const res = await request(app)
//       .get(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//     expect(res.body.product_id).toBe(testProductId);
//   });

//   it('should update the product', async () => {
//     const res = await request(app)
//       .patch(`/api/products/${testProductId}`) // 🔹 PATCH según tu routes
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey)
//       .send({ stock: 150 });

//     expect(res.status).toBe(200);
//     expect(res.body.stock).toBe(150);
//   });

//   it('should delete the product', async () => {
//     const res = await request(app)
//       .delete(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//   });
// });

// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import { testAdminToken } from '../setupTests';
// import app from '../../app';
// import CategoryService from '../../services/category.service';

// describe('Product Integration Tests', () => {
//   let testCategoryId: number;
//   let testProductId: number;

//   const apiKey = process.env.API_KEY!;

//   beforeAll(async () => {
//     // 1️⃣ Crear categoría de prueba
//     const category = await CategoryService.create({
//       name: 'Suplementos Test',
//       description: 'Categoría para productos de prueba',
//     });
//     testCategoryId = category.category_id!;

//     // 2️⃣ Crear producto de prueba **una sola vez**
//     const res = await request(app)
//       .post('/api/products')
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey)
//       .send({
//         name: 'Proteína de suero',
//         description: 'Proteína de suero aislada',
//         price: 1200,
//         stock: 100,
//         category_id: testCategoryId,
//         rating: 0,         // obligatorio según schema
//         brand: 'MyBrand',  // obligatorio según schema
//       });

//     testProductId = res.body.product_id;
//   });

//   afterAll(async () => {
//     // Limpiar producto de prueba
//     if (testProductId) {
//       await request(app)
//         .delete(`/api/products/${testProductId}`)
//         .set('Authorization', `Bearer ${testAdminToken}`)
//         .set('x-api-key', apiKey);
//     }

//     // Opcional: limpiar categoría si tu servicio lo permite
//   });

//   it('should get all products', async () => {
//     const res = await request(app)
//       .get('/api/products')
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('should get product by ID', async () => {
//     const res = await request(app)
//       .get(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//     expect(res.body.product_id).toBe(testProductId);
//   });

//   it('should update the product', async () => {
//     const res = await request(app)
//       .patch(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey)
//       .send({ stock: 150 });

//     expect(res.status).toBe(200);
//     expect(res.body.stock).toBe(150);
//   });

//   it('should delete the product', async () => {
//     const res = await request(app)
//       .delete(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//   });
// });

// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import { testAdminToken } from '../setupTests';
// import app from '../../app';
// import CategoryService from '../../services/category.service';

// describe('Product Integration Tests', () => {
//   let testCategoryId: number;
//   let testProductId: number;

//   const apiKey = process.env.API_KEY!;

//   beforeAll(async () => {
//     // Crear categoría de prueba
//     const category = await CategoryService.create({
//       name: 'Suplementos Test',
//       description: 'Categoría para productos de prueba',
//     });
//     testCategoryId = category.category_id!;
//   });

//   afterAll(async () => {
//     // Limpiar producto de prueba si existe
//     if (testProductId) {
//       await request(app)
//         .delete(`/api/products/${testProductId}`)
//         .set('Authorization', `Bearer ${testAdminToken}`)
//         .set('x-api-key', apiKey);
//     }

//     // Borrar categoría creada durante el test
//     if (testCategoryId) {
//       await request(app)
//         .delete(`/api/categories/${testCategoryId}`)
//         .set('Authorization', `Bearer ${testAdminToken}`)
//         .set('x-api-key', apiKey);
//     }
//   });

//   it('should create a new product', async () => {
//     const res = await request(app)
//       .post('/api/products')
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey)
//       .send({
//         name: 'Proteína de suero',
//         description: 'Proteína de suero aislada',
//         price: 1200,
//         stock: 100,
//         category_id: testCategoryId,
//         rating: 0,         // obligatorio según schema
//         brand: 'MyBrand',  // obligatorio según schema
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.product_id).toBeDefined();
//     testProductId = res.body.product_id;
//   });

//   it('should get all products', async () => {
//     const res = await request(app)
//       .get('/api/products')
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('should get product by ID', async () => {
//     const res = await request(app)
//       .get(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//     expect(res.body.product_id).toBe(testProductId);
//   });

//   it('should update the product', async () => {
//     const res = await request(app)
//       .patch(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey)
//       .send({ stock: 150 });

//     expect(res.status).toBe(200);
//     expect(res.body.stock).toBe(150);
//   });

//   it('should delete the product', async () => {
//     const res = await request(app)
//       .delete(`/api/products/${testProductId}`)
//       .set('Authorization', `Bearer ${testAdminToken}`)
//       .set('x-api-key', apiKey);

//     expect(res.status).toBe(200);
//   });
// });


// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import app from '../../app';
// import ProductService from '../../services/product.service';
// import CategoryService from '../../services/category.service';
// import { sequelize } from '../../models/entity';
// import { Transaction } from 'sequelize';

// describe('Product Integration Tests with Transactions', () => {
//   let transaction: Transaction;
//   let testCategoryId: number;
//   let testProductId: number;

//   const apiKey = process.env.API_KEY!;
//   const adminToken = process.env.TEST_ADMIN_TOKEN!;

//   beforeEach(async () => {
//     transaction = await sequelize.transaction();

//     // Crear categoría de prueba en la transacción
//     const category = await CategoryService.create(
//       {
//         name: 'Suplementos Test',
//         description: 'Categoría para productos de prueba',
//       },
//       transaction // 🔹 Pasamos la transacción
//     );
//     testCategoryId = category.category_id!;
//   });

//   afterEach(async () => {
//     await transaction.rollback(); // 🔹 Limpia todo automáticamente
//   });

//   it('should create a new product', async () => {
//     const product = await ProductService.create(
//       {
//         name: 'Proteína de suero',
//         description: 'Proteína de suero aislada',
//         price: 1200,
//         stock: 100,
//         category_id: testCategoryId,
//       },
//       transaction
//     );

//     expect(product).toBeDefined();
//     expect(product.name).toBe('Proteína de suero');
//     testProductId = product.product_id!;
//   });

//   it('should get product by ID', async () => {
//     const product = await ProductService.create(
//       {
//         name: 'Creatina Test',
//         description: 'Creatina para fuerza',
//         price: 800,
//         stock: 50,
//         category_id: testCategoryId,
//       },
//       transaction
//     );

//     const found = await ProductService.getById(product.product_id!, transaction);

//     expect(found).toBeDefined();
//     expect(found?.name).toBe('Creatina Test');
//   });

//   it('should update a product', async () => {
//     const product = await ProductService.create(
//       {
//         name: 'Aminoácidos Test',
//         description: 'BCAA',
//         price: 600,
//         stock: 30,
//         category_id: testCategoryId,
//       },
//       transaction
//     );

//     const updated = await ProductService.update(
//       product.product_id!,
//       { stock: 40 },
//       transaction
//     );

//     expect(updated.stock).toBe(40);
//   });

//   it('should delete a product', async () => {
//     const product = await ProductService.create(
//       {
//         name: 'Pre-entreno Test',
//         description: 'Energizante',
//         price: 900,
//         stock: 20,
//         category_id: testCategoryId,
//       },
//       transaction
//     );

//     const deleted = await ProductService.delete(product.product_id!, transaction);
//     expect(deleted).toBe(true);
//   });
// });

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
      transaction
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
        rating: 4.5,       // obligatorio
        brand: 'WheyTest', // obligatorio
        image: '/images/products/test.webp',
      },
      transaction
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
      transaction
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
      transaction
    );

    const updated = await ProductService.update(
      product.product_id!,
      { stock: 40 },
      transaction
    );

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
      transaction
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
      transaction
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
      transaction
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
      transaction
    );

    await expect(
      ProductService.decreaseStock(product.product_id!, 20, transaction)
    ).rejects.toThrow('Stock insuficiente');
  });
});
