// import request from 'supertest';
// import app from '../../test-app'; // tu express solo para tests
// import { DatabaseConnection } from '../../patterns/singleton/database.connection';
// import { Category } from '../../models/entity/category.model';

// describe('Category Integration Tests', () => {
//   beforeAll(async () => {
//     process.env.NODE_ENV = 'test';
//     await DatabaseConnection.connect();
//     await DatabaseConnection.clear(); // opcional, limpia todas las tablas
//   });

//   afterAll(async () => {
//     await DatabaseConnection.close();
//   });

//   describe('POST /api/categories', () => {
//     it('should create a category', async () => {
//       const res = await request(app)
//         .post('/api/categories')
//         .send({ name: 'Electronics', description: 'Gadgets and devices' });

//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe('Electronics');

//       const categoryInDb = await Category.findByPk(res.body.category_id);
//       expect(categoryInDb).not.toBeNull();
//     });
//   });

//   describe('GET /api/categories', () => {
//     it('should return all categories', async () => {
//       const res = await request(app).get('/api/categories');
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBeGreaterThan(0);
//     });
//   });
// });

// import request from 'supertest';
// import app from '../../test-app';
// import { DatabaseConnection } from '../../patterns/singleton/database.connection';
// import { Category } from '../../models/entity/category.model';

// describe('Category Integration Tests', () => {
//   beforeAll(async () => {
//     process.env.NODE_ENV = 'test';
//     await DatabaseConnection.connect();
//     const sequelize = DatabaseConnection.getInstance();
//     await sequelize.sync({ force: true });
//   });

// //   afterEach(async () => {
// //     const sequelize = DatabaseConnection.getInstance();
// //     const tables = Object.keys(sequelize.models);
// //     for (const table of tables) {
// //       await sequelize.models[table].destroy({ where: {}, truncate: true, force: true });
// //     }
// //   });

// afterEach(async () => {
//   const sequelize = DatabaseConnection.getInstance();
//   const tables = Object.keys(sequelize.models);

//   for (const table of tables) {
//     const model = sequelize.models[table];
//     if (model) {
//       await model.destroy({ where: {}, truncate: true, force: true });
//     }
//   }
// });

//   afterAll(async () => {
//     await DatabaseConnection.close();
//   });

//   describe('POST /api/categories', () => {
//     it('should create a category', async () => {
//       const res = await request(app)
//         .post('/api/categories')
//         .send({ name: 'Electronics', description: 'Gadgets and devices' });

//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe('Electronics');

//       const categoryInDb = await Category.findByPk(res.body.category_id);
//       expect(categoryInDb).not.toBeNull();
//     });
//   });

//   describe('GET /api/categories', () => {
//     it('should return all categories', async () => {
//       // Crear una categoría primero
//       await Category.create({ name: 'Books', description: 'All kinds of books' });

//       const res = await request(app).get('/api/categories');
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBeGreaterThan(0);
//     });
//   });
// });




// import request from 'supertest';
// import app from '../../test-app';
// import { DatabaseConnection } from '../../patterns/singleton/database.connection';
// import { Category } from '../../models/entity/category.model';
// import { Transaction } from 'sequelize';

// describe('Category Integration Tests', () => {
//   let transaction: Transaction;

//   beforeAll(async () => {
//     process.env.NODE_ENV = 'test';
//     await DatabaseConnection.connect();
//     const sequelize = DatabaseConnection.getInstance();
//     await sequelize.sync({ force: true }); // crea tablas vacías antes de todos los tests
//   });

//   beforeEach(async () => {
//     const sequelize = DatabaseConnection.getInstance();
//     transaction = await sequelize.transaction(); // inicia transacción para este test
//   });

//   afterEach(async () => {
//     await transaction.rollback(); // deshace todo lo que hizo el test
//   });

//   afterAll(async () => {
//     await DatabaseConnection.close();
//   });

//   describe('POST /api/categories', () => {
//     it('should create a category', async () => {
//       const res = await request(app)
//         .post('/api/categories')
//         .send({ name: 'Electronics', description: 'Gadgets and devices' });

//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe('Electronics');

//       // Aquí le pasamos la transacción a Sequelize para que busque dentro de la misma
//       const categoryInDb = await Category.findByPk(res.body.category_id, { transaction });
//       expect(categoryInDb).not.toBeNull();
//     });
//   });

//   describe('GET /api/categories', () => {
//     it('should return all categories', async () => {
//       // Crear categoría dentro de la transacción
//       await Category.create({ name: 'Books', description: 'All kinds of books' }, { transaction });

//       const res = await request(app).get('/api/categories');
//       expect(res.statusCode).toBe(200);

//       // Como la ruta no conoce la transacción, va a buscar en la base "real"
//       // Para tests que usan transacciones con rollback, a veces conviene mockear la DB
//       // o usar la transacción solo para datos internos de test
//     });
//   });
// });


// src/tests/integration/category.integration.test.ts
/* import request from 'supertest';
import app from '../../test-app';
import { DatabaseConnection } from '../../patterns/singleton/database.connection';
import { Category } from '../../models/entity/category.model';

describe('Category Integration Tests', () => {
  beforeAll(async () => {
    // Fuerza NODE_ENV para cargar .env.test
    process.env.NODE_ENV = 'test';
    await DatabaseConnection.connect();

    const sequelize = DatabaseConnection.getInstance();
    // Borra tablas si existen y crea nuevas
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    // Limpia datos entre tests
    await Category.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await DatabaseConnection.close();
  });

  describe('POST /api/categories', () => {
    it('should create a category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Electronics', description: 'Gadgets and devices' });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Electronics');

      const categoryInDb = await Category.findByPk(res.body.category_id);
      expect(categoryInDb).not.toBeNull();
      expect(categoryInDb!.name).toBe('Electronics');
    });
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      await Category.create({ name: 'Books', description: 'All kinds of books' });

      const res = await request(app).get('/api/categories');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Books');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const category = await Category.create({ name: 'Toys', description: 'Fun toys' });

      const res = await request(app).get(`/api/categories/${category.category_id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Toys');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      const category = await Category.create({ name: 'Clothing', description: 'Wearables' });

      const res = await request(app)
        .put(`/api/categories/${category.category_id}`)
        .send({ name: 'Apparel', description: 'Updated description' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Apparel');

      const updatedCategory = await Category.findByPk(category.category_id);
      expect(updatedCategory!.name).toBe('Apparel');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const category = await Category.create({ name: 'Food', description: 'Edibles' });

      const res = await request(app).delete(`/api/categories/${category.category_id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);

      const deletedCategory = await Category.findByPk(category.category_id);
      expect(deletedCategory).toBeNull();
    });
  });
}); */


// src/tests/integration/category.integration.test.ts
// import request from 'supertest';
// import app from '../../test-app';
// import { DatabaseConnection } from '../../patterns/singleton/database.connection';
// import { Category } from '../../models/entity/category.model';

// describe('Category Integration Tests', () => {
//   beforeAll(async () => {
//     process.env.NODE_ENV = 'test';
//     await DatabaseConnection.connect();
//     const sequelize = DatabaseConnection.getInstance();
//     await sequelize.sync({ force: true }); // tablas vacías
//   });

//   afterEach(async () => {
//     await Category.destroy({ where: {}, truncate: true, cascade: true });
//   });

//   afterAll(async () => {
//     await DatabaseConnection.close();
//   });

//   describe('POST /api/categories', () => {
//     it('should create a category', async () => {
//       const res = await request(app)
//         .post('/api/categories')
//         .send({ name: 'Electronics', description: 'Gadgets and devices' });

//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe('Electronics');

//       const categoryInDb = await Category.findByPk(res.body.category_id);
//       expect(categoryInDb).not.toBeNull();
//       expect(categoryInDb!.name).toBe('Electronics');
//     });
//   });

//   describe('GET /api/categories', () => {
//     it('should return all categories', async () => {
//       await Category.create({ name: 'Books', description: 'All kinds of books' });

//       const res = await request(app).get('/api/categories');
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBe(1);
//       expect(res.body[0].name).toBe('Books');
//     });
//   });

//   describe('GET /api/categories/:id', () => {
//     it('should return a category by id', async () => {
//       const category = await Category.create({ name: 'Toys', description: 'Kids toys' });

//       const res = await request(app).get(`/api/categories/${category.category_id}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe('Toys');
//     });
//   });

//   describe('PUT /api/categories/:id', () => {
//     it('should update a category', async () => {
//       const category = await Category.create({ name: 'Old', description: 'Old description' });

//       const res = await request(app)
//         .put(`/api/categories/${category.category_id}`)
//         .send({ name: 'Updated', description: 'New description' });

//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe('Updated');

//       const updatedCategory = await Category.findByPk(category.category_id);
//       expect(updatedCategory!.name).toBe('Updated');
//     });
//   });

//   describe('DELETE /api/categories/:id', () => {
//     it('should delete a category', async () => {
//       const category = await Category.create({ name: 'DeleteMe', description: 'To delete' });

//       const res = await request(app).delete(`/api/categories/${category.category_id}`);
//       //expect(res.statusCode).toBe(204);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.message).toMatch(/Categoría eliminada correctamente/i);

//       const deletedCategory = await Category.findByPk(category.category_id);
//       expect(deletedCategory).toBeNull();
//     });
//   });
// });

// src/tests/integration/category.integration.test.ts
// import request from 'supertest';
// import app from '../../test-app';
// import { Category } from '../../models/entity/category.model';

// // Importa setup global de integración
// import './setup';

// describe('Category Integration Tests', () => {

//   describe('POST /api/categories', () => {
//     it('should create a category', async () => {
//       const res = await request(app)
//         .post('/api/categories')
//         .send({ name: 'Electronics', description: 'Gadgets and devices' });

//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe('Electronics');

//       const categoryInDb = await Category.findByPk(res.body.category_id);
//       expect(categoryInDb).not.toBeNull();
//       expect(categoryInDb!.name).toBe('Electronics');
//     });
//   });

//   describe('GET /api/categories', () => {
//     it('should return all categories', async () => {
//       await Category.create({ name: 'Books', description: 'All kinds of books' });

//       const res = await request(app).get('/api/categories');
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBe(1);
//       expect(res.body[0].name).toBe('Books');
//     });
//   });

//   describe('GET /api/categories/:id', () => {
//     it('should return a category by id', async () => {
//       const category = await Category.create({ name: 'Toys', description: 'Kids toys' });

//       const res = await request(app).get(`/api/categories/${category.category_id}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe('Toys');
//     });
//   });

//   describe('PUT /api/categories/:id', () => {
//     it('should update a category', async () => {
//       const category = await Category.create({ name: 'Old', description: 'Old description' });

//       const res = await request(app)
//         .put(`/api/categories/${category.category_id}`)
//         .send({ name: 'Updated', description: 'New description' });

//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe('Updated');

//       const updatedCategory = await Category.findByPk(category.category_id);
//       expect(updatedCategory!.name).toBe('Updated');
//     });
//   });

//   describe('DELETE /api/categories/:id', () => {
//     it('should delete a category', async () => {
//       const category = await Category.create({ name: 'DeleteMe', description: 'To delete' });

//       const res = await request(app).delete(`/api/categories/${category.category_id}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.message).toMatch(/Categoría eliminada correctamente/i);

//       const deletedCategory = await Category.findByPk(category.category_id);
//       expect(deletedCategory).toBeNull();
//     });
//   });
// });


// src/tests/integration/category.integration.test.ts
import request from 'supertest';
import app from '../../test-app';
import { Category } from '../../models/entity';

// Importa setup global de integración
import { setupIntegrationTests } from './setup';

// Ejecuta el setup (beforeAll, afterEach, afterAll)
setupIntegrationTests();

describe('Category Integration Tests', () => {
  describe('POST /api/categories', () => {
    it('should create a category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Electronics', description: 'Gadgets and devices' });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Electronics');

      const categoryInDb = await Category.findByPk(res.body.category_id);
      expect(categoryInDb).not.toBeNull();
      expect(categoryInDb!.name).toBe('Electronics');
    });
  });

  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      await Category.create({ name: 'Books', description: 'All kinds of books' });

      const res = await request(app).get('/api/categories');

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Books');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const category = await Category.create({ name: 'Toys', description: 'Kids toys' });

      const res = await request(app).get(`/api/categories/${category.category_id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Toys');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category', async () => {
      const category = await Category.create({ name: 'Old', description: 'Old description' });

      const res = await request(app)
        .put(`/api/categories/${category.category_id}`)
        .send({ name: 'Updated', description: 'New description' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated');

      const updatedCategory = await Category.findByPk(category.category_id);
      expect(updatedCategory!.name).toBe('Updated');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category', async () => {
      const category = await Category.create({ name: 'DeleteMe', description: 'To delete' });

      const res = await request(app).delete(`/api/categories/${category.category_id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/Categoría eliminada correctamente/i);

      const deletedCategory = await Category.findByPk(category.category_id);
      expect(deletedCategory).toBeNull();
    });
  });
});
