// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import app from '../../test-app';
// import { setupIntegrationTests } from './setup';
// import { Category, Product } from '../../models/entity';
// import jwt from 'jsonwebtoken';

// setupIntegrationTests();

// const JWT_SECRET = process.env.JWT_SECRET ?? 'super_secret_key';
// // mock user ADMIN
// const adminToken = jwt.sign({ user_id: 1, role: 'ADMIN' }, JWT_SECRET);

// describe('Product Integration Tests', () => {

//   let categoryId: number;

//   beforeEach(async () => {
//     // Creamos una categoría para asociar los productos
//     const category = await Category.create({ name: 'Supplements', description: 'All supplements' });
//     categoryId = category.category_id;
//   });

//   describe('POST /api/products', () => {
//     it('should create a product', async () => {
//       const res = await request(app)
//         .post('/api/products')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({
//           name: 'Protein Powder',
//           price: 49.99,
//           category_id: categoryId,
//           stock: 100,
//           brand: 'MyBrand',
//           description: 'High quality protein powder',
//         });

//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe('Protein Powder');

//       const productInDb = await Product.findByPk(res.body.product_id);
//       expect(productInDb).not.toBeNull();
//       expect(productInDb!.name).toBe('Protein Powder');
//     });
//   });

//   describe('GET /api/products', () => {
//     it('should return all products', async () => {
//       await Product.create({
//         name: 'BCAA',
//         price: 29.99,
//         category_id: categoryId,
//         stock: 50,
//         brand: 'BrandX',
//         description: 'Branched-chain amino acids',
//       });

//       const res = await request(app).get('/api/products');
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBe(1);
//       expect(res.body[0].name).toBe('BCAA');
//     });
//   });

//   describe('GET /api/products/:id', () => {
//     it('should return a product by id', async () => {
//       const product = await Product.create({
//         name: 'Creatine',
//         price: 19.99,
//         category_id: categoryId,
//         stock: 70,
//         brand: 'CreatineBrand',
//         description: 'Pure creatine monohydrate',
//       });

//       const res = await request(app).get(`/api/products/${product.product_id}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe('Creatine');
//     });
//   });

//   describe('PATCH /api/products/:id', () => {
//     it('should update a product', async () => {
//       const product = await Product.create({
//         name: 'Old Name',
//         price: 10,
//         category_id: categoryId,
//         stock: 5,
//         brand: 'BrandY',
//         description: 'Old description',
//       });

//       const res = await request(app)
//         .patch(`/api/products/${product.product_id}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({ name: 'New Name', price: 12 });

//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe('New Name');

//       const updatedProduct = await Product.findByPk(product.product_id);
//       expect(updatedProduct!.name).toBe('New Name');
//       expect(updatedProduct!.price).toBe(12);
//     });
//   });

//   describe('DELETE /api/products/:id', () => {
//     it('should delete a product', async () => {
//       const product = await Product.create({
//         name: 'DeleteMe',
//         price: 5,
//         category_id: categoryId,
//         stock: 1,
//         brand: 'BrandDel',
//         description: 'To delete',
//       });

//       const res = await request(app)
//         .delete(`/api/products/${product.product_id}`)
//         .set('Authorization', `Bearer ${adminToken}`);

//       expect(res.statusCode).toBe(200);
//       expect(res.body.message).toMatch(/Producto eliminado correctamente/i);

//       const deletedProduct = await Product.findByPk(product.product_id);
//       expect(deletedProduct).toBeNull();
//     });
//   });
// });


// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import app from '../../test-app';
// import { Product, Category } from '../../models/entity';
// import jwt from 'jsonwebtoken';
// import { setupIntegrationTests } from './setup';

// setupIntegrationTests();

// const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';
// const adminToken = jwt.sign({ user_id: 1, role: 'ADMIN' }, JWT_SECRET);

// describe('Product Integration Tests', () => {
//   let categoryId: number;
//   let productId: number;

//   beforeAll(async () => {
//     // Creamos una categoría para asignar a los productos
//     const category = await Category.create({
//       name: 'Supplements',
//       description: 'Health supplements',
//     });
//     categoryId = category.category_id;
//   });

//   describe('POST /api/products', () => {
//     it('should create a product', async () => {
//       const res = await request(app)
//         .post('/api/products')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({
//           name: 'Protein Powder',
//           price: 49.99,
//           category_id: categoryId,
//           stock: 100,
//           brand: 'MyBrand',
//           description: 'High quality protein powder',
//           rating: 0, // obligatorio por Zod
//         });

//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe('Protein Powder');
//       expect(Number(res.body.price)).toBe(49.99);

//       const productInDb = await Product.findByPk(res.body.product_id);
//       expect(productInDb).not.toBeNull();
//       expect(productInDb!.name).toBe('Protein Powder');

//       productId = res.body.product_id;
//     });
//   });

//   describe('GET /api/products', () => {
//     it('should return all products', async () => {
//       const res = await request(app).get('/api/products');
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBeGreaterThanOrEqual(1);
//     });
//   });

//   describe('GET /api/products/:id', () => {
//     it('should return a product by id', async () => {
//       const res = await request(app).get(`/api/products/${productId}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.product_id).toBe(productId);
//     });
//   });

//   describe('PATCH /api/products/:id', () => {
//     it('should update a product', async () => {
//       const res = await request(app)
//         .patch(`/api/products/${productId}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .send({ name: 'New Name', price: 12, rating: 0 });

//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe('New Name');
//       expect(Number(res.body.price)).toBe(12);

//       const updated = await Product.findByPk(productId);
//       expect(updated!.name).toBe('New Name');
//     });
//   });

//   describe('DELETE /api/products/:id', () => {
//     it('should delete a product', async () => {
//       const res = await request(app)
//         .delete(`/api/products/${productId}`)
//         .set('Authorization', `Bearer ${adminToken}`);

//       expect(res.statusCode).toBe(200);
//       expect(res.body.message).toMatch(/Producto eliminado correctamente/i);

//       const deleted = await Product.findByPk(productId);
//       expect(deleted).toBeNull();
//     });
//   });
// });

// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import app from '../../app';
// import { setupIntegrationTests } from './setup';
// import { Category, Product } from '../../models/entity';

// setupIntegrationTests(); // setup general: conecta DB, limpia tablas

// describe('Product Integration Tests', () => {
//   let categoryId: number;

//   beforeEach(async () => {
//     // Crear categoría SOLO para cada test de producto
//     const category = await Category.create({
//       name: 'Electronics',
//       description: 'Gadgets and devices',
//     });
//     categoryId = category.category_id;
//   });

//   afterEach(async () => {
//     // Limpiar productos y categorías después de cada test
//     await Product.destroy({ where: {}, truncate: true, cascade: true });
//     await Category.destroy({ where: {}, truncate: true, cascade: true });
//   });

//   it('should create a product', async () => {
//     const res = await request(app)
//       .post('/api/products')
//       .send({
//         name: 'Protein Powder',
//         price: 49.99,
//         category_id: categoryId,
//         stock: 100,
//         brand: 'MyBrand',
//         description: 'High quality protein powder',
//         rating: 0,
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.name).toBe('Protein Powder');
//     expect(res.body.category_id).toBe(categoryId);
//   });

//   it('should return all products', async () => {
//     // Crear producto para test
//     await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app).get('/api/products');

//     expect(res.status).toBe(200);
//     expect(res.body.length).toBeGreaterThanOrEqual(1);
//   });

//   it('should return a product by id', async () => {
//     const product = await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app).get(`/api/products/${product.product_id}`);

//     expect(res.status).toBe(200);
//     expect(res.body.name).toBe('Protein Powder');
//   });

//   it('should update a product', async () => {
//     const product = await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app)
//       .patch(`/api/products/${product.product_id}`)
//       .send({ name: 'New Name', price: 12 });

//     expect(res.status).toBe(200);

//     const updated = await Product.findByPk(product.product_id);
//     expect(updated!.name).toBe('New Name');
//     expect(Number(updated!.price)).toBe(12);
//   });

//   it('should delete a product', async () => {
//     const product = await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app).delete(`/api/products/${product.product_id}`);

//     expect(res.status).toBe(200);

//     const deleted = await Product.findByPk(product.product_id);
//     expect(deleted).toBeNull();
//   });
// });


// src/tests/integration/product.integration.test.ts
// import request from 'supertest';
// import app from '../../app';
// import { Product, Category, User } from '../../models/entity';
// import { setupIntegrationTests } from './setup';
// import jwt from 'jsonwebtoken';

// setupIntegrationTests(); // limpia la DB y conecta

// describe('Product Integration Tests', () => {
//   let adminToken: string;
//   let categoryId: number;
//   let productId: number;

//   beforeAll(async () => {
//     // Crear category para los tests
//     const category = await Category.create({
//       name: 'Electronics',
//       description: 'Gadgets and devices',
//     });
//     categoryId = category.category_id;

//     // Crear usuario admin
//     const admin = await User.create({
//       name: 'Admin',
//       email: 'admin@test.com',
//       password: 'password123', // si tu middleware espera hashed, hashéalo aquí
//       role: 'ADMIN',
//     });

//     // Generar token JWT
//     adminToken = jwt.sign(
//       { id: admin.user_id, role: admin.role },
//       process.env.JWT_SECRET || 'test_secret',
//       { expiresIn: '1h' }
//     );
//   });

//   afterEach(async () => {
//     await Product.destroy({ where: {}, truncate: true, cascade: true });
//   });

//   it('should create a product', async () => {
//     const res = await request(app)
//       .post('/api/products')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({
//         name: 'Protein Powder',
//         price: 49.99,
//         category_id: categoryId,
//         stock: 100,
//         brand: 'MyBrand',
//         description: 'High quality protein powder',
//         rating: 0,
//       });

//     expect(res.status).toBe(201);
//     expect(res.body.name).toBe('Protein Powder');
//     productId = res.body.product_id;
//   });

//   it('should return all products', async () => {
//     // Crear producto manualmente para el GET
//     await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app)
//       .get('/api/products')
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.length).toBeGreaterThanOrEqual(1);
//   });

//   it('should return a product by id', async () => {
//     const product = await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app)
//       .get(`/api/products/${product.product_id}`)
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.status).toBe(200);
//     expect(res.body.name).toBe('Protein Powder');
//   });

//   it('should update a product', async () => {
//     const product = await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app)
//       .patch(`/api/products/${product.product_id}`)
//       .set('Authorization', `Bearer ${adminToken}`)
//       .send({
//         name: 'Updated Name',
//         price: 59.99,
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.name).toBe('Updated Name');
//   });

//   it('should delete a product', async () => {
//     const product = await Product.create({
//       name: 'Protein Powder',
//       price: 49.99,
//       category_id: categoryId,
//       stock: 100,
//       brand: 'MyBrand',
//       description: 'High quality protein powder',
//       rating: 0,
//     });

//     const res = await request(app)
//       .delete(`/api/products/${product.product_id}`)
//       .set('Authorization', `Bearer ${adminToken}`);

//     expect(res.status).toBe(200);

//     const deletedProduct = await Product.findByPk(product.product_id);
//     expect(deletedProduct).toBeNull();
//   });
// });

// src/tests/integration/product.integration.test.ts
import request from 'supertest';
import app from '../../app';
import { setupIntegrationTests } from '../setup';
import { UserRepository } from '../../repositories/user.repository';
import { Product, Category, UserRole } from '../../models/entity';
import { generateToken } from '../../utils/jwt.utils'; // tu función JWT

setupIntegrationTests();

describe('Product Integration Tests', () => {
  let adminToken: string;
  let categoryId: number;
  let productId: number;

  beforeAll(async () => {
    // 1️⃣ Crear usuario admin
    const admin = await UserRepository.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: UserRole.ADMIN, // ✅ usar enum
    });

    // 2️⃣ Generar JWT para usar en headers Authorization
    adminToken = generateToken(admin);

    // 3️⃣ Crear categoría para asignar a productos
    const category = await Category.create({
      name: 'Electronics',
      description: 'Gadgets and devices',
    });
    categoryId = category.category_id;
  });

  it('should create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Protein Powder',
        price: 49.99,
        category_id: categoryId,
        stock: 100,
        brand: 'MyBrand',
        description: 'High quality protein powder',
        rating: 0,
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Protein Powder');
    productId = res.body.product_id;
  });

  it('should return all products', async () => {
    const res = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('should return a product by id', async () => {
    const res = await request(app)
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.product_id).toBe(productId);
  });

  it('should update a product', async () => {
    const res = await request(app)
      .patch(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Protein Powder' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Protein Powder');
  });

  it('should delete a product', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);

    // Verificar que ya no exista
    const product = await Product.findByPk(productId);
    expect(product).toBeNull();
  });
});
