// tests/integration/setup.ts
// import { DatabaseConnection } from '../../patterns/singleton/database.connection';
// import { Category } from '../../models/entity/category.model';

// beforeAll(async () => {
//   process.env.NODE_ENV = 'test';

//   // Conecta con la DB de test
//   await DatabaseConnection.connect();

//   const sequelize = DatabaseConnection.getInstance();
//   // Sincroniza tablas, fuerza vaciado
//   await sequelize.sync({ force: true });
// });

// afterEach(async () => {
//   // Limpia datos después de cada test
//   await Category.destroy({ where: {}, truncate: true, cascade: true });
// });

// afterAll(async () => {
//   // Cierra la conexión a la DB
//   await DatabaseConnection.close();
// });

import { DatabaseConnection } from '../../patterns/singleton/database.connection';
import { Category, Product } from '../../models/entity';
import dotenv from 'dotenv';

// cargar variables de entorno para tests
dotenv.config({ path: '../../.env.test' });

export const setupIntegrationTests = () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await DatabaseConnection.connect();
    const sequelize = DatabaseConnection.getInstance();
    await sequelize.sync({ force: true }); // limpieza completa antes de tests
  });

  afterEach(async () => {
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await Category.destroy({ where: {}, truncate: true, cascade: true });
  });

  afterAll(async () => {
    await DatabaseConnection.close();
  });
};

