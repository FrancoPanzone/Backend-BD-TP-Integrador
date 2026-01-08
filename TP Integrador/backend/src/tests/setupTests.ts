//src/tests/setupTests.ts

// import { resetTestDatabase } from '../helpers/testDatabase';
// import { DatabaseConnection } from '../patterns/singleton/database.connection';

// beforeAll(async () => {
//     await DatabaseConnection.connect();
//     const sequelize = DatabaseConnection.getInstance();
//     const dbName = sequelize.getDatabaseName();
//     console.log('Base de datos conectada:', dbName);
// });

// beforeEach(async () => {
//     await resetTestDatabase();
// });

// afterAll(async () => {
//     const sequelize = DatabaseConnection.getInstance();
//     await sequelize.close();
// });

// src/tests/setupTests.ts
// import { DatabaseConnection } from '../patterns/singleton/database.connection';
// import { resetTestDatabase } from '../helpers/testDatabase';
// import { Sequelize, QueryTypes } from 'sequelize';

// beforeAll(async () => {
//   // Conectar a la DB
//   await DatabaseConnection.connect();
//   const sequelize: Sequelize = DatabaseConnection.getInstance();

//   // Mostrar base de datos conectada
//   const dbName = sequelize.getDatabaseName();
//   console.log('🟢 Base de datos conectada:', dbName);

//   try {
//     // Verificar el schema actual
//     const result = await sequelize.query<{ current_schema: string }>(
//       'SELECT current_schema();',
//       { type: QueryTypes.SELECT } // ✅ usar QueryTypes importado de sequelize
//     );

//     // result es un array con un objeto
//     console.log('🔹 Schema usado en test:', result[0]?.current_schema ?? 'desconocido');
//   } catch (err) {
//     console.error('❌ Error obteniendo el schema actual:', err);
//   }
// });

// beforeEach(async () => {
//   try {
//     await resetTestDatabase();
//   } catch (err) {
//     console.error('❌ Error reseteando el schema test:', err);
//   }
// });

// afterAll(async () => {
//   const sequelize: Sequelize = DatabaseConnection.getInstance();
//   try {
//     await sequelize.close();
//     console.log('🔒 Conexión a la DB cerrada correctamente');
//   } catch (err) {
//     console.error('❌ Error cerrando la conexión a la DB:', err);
//   }
// });

// src/tests/setupTests.ts
// import { DatabaseConnection } from '../patterns/singleton/database.connection';
// import { resetTestDatabase } from '../helpers/testDatabase';
// import { Sequelize, QueryTypes } from 'sequelize';

// // 🔹 Importar todos los modelos para inicializar asociaciones
// import '../models/entity';

// beforeAll(async () => {
//   // Conectar a la DB
//   await DatabaseConnection.connect();
//   const sequelize: Sequelize = DatabaseConnection.getInstance();

//   // Mostrar base de datos conectada
//   const dbName = sequelize.getDatabaseName();
//   console.log('🟢 Base de datos conectada:', dbName);

//   try {
//     // Verificar el schema actual
//     const result = await sequelize.query<{ current_schema: string }>(
//       'SELECT current_schema();',
//       { type: QueryTypes.SELECT }
//     );
//     console.log('🔹 Schema usado en test:', result[0]?.current_schema ?? 'desconocido');

//     // 🔹 Sincronizar todos los modelos en el schema test
//     await sequelize.sync({ force: true }); // fuerza la recreación de todas las tablas
//     console.log('✅ Todos los modelos sincronizados en schema "test"');
//   } catch (err) {
//     console.error('❌ Error inicializando el schema de test:', err);
//   }
// });

// beforeEach(async () => {
//   try {
//     // Resetea el schema test antes de cada test
//     await resetTestDatabase();
//     console.log('✅ Schema "test" reseteado antes del test');
//   } catch (err) {
//     console.error('❌ Error reseteando el schema test:', err);
//   }
// });

// afterAll(async () => {
//   const sequelize: Sequelize = DatabaseConnection.getInstance();
//   try {
//     await sequelize.close();
//     console.log('🔒 Conexión a la DB cerrada correctamente');
//   } catch (err) {
//     console.error('❌ Error cerrando la conexión a la DB:', err);
//   }
// });

// src/tests/setupTests.ts
// import { DatabaseConnection } from '../patterns/singleton/database.connection';
// import { Sequelize, Transaction } from 'sequelize';

// let sequelize: Sequelize;
// let transaction: Transaction;

// beforeAll(async () => {
//   // Conectar a la DB
//   await DatabaseConnection.connect();
//   sequelize = DatabaseConnection.getInstance();
//   console.log('🟢 Base de datos conectada:', sequelize.getDatabaseName());
// });

// beforeEach(async () => {
//   // Iniciar una transacción antes de cada test
//   transaction = await sequelize.transaction();
// });

// afterEach(async () => {
//   // Revertir todo lo hecho en la transacción
//   if (transaction) await transaction.rollback();
// });

// afterAll(async () => {
//   // Cerrar conexión
//   await sequelize.close();
//   console.log('🔒 Conexión a la DB cerrada correctamente');
// });

// // Exportar la transacción para usarla en los repositorios/servicios
// export { transaction };


// src/tests/setupTests.ts
// import { DatabaseConnection } from '../patterns/singleton/database.connection';
// import { Sequelize, Transaction } from 'sequelize';

// // IMPORTA MODELOS PARA QUE SE DEFINAN ASOCIACIONES
// //import '../models/entity/index'; // ✅ aquí se ejecuta index.ts y se crean asociaciones
// import '../models/entity'; // 🔹 ruta corregida

// let sequelize: Sequelize;
// let transaction: Transaction;

// beforeAll(async () => {
//   await DatabaseConnection.connect();
//   sequelize = DatabaseConnection.getInstance();
//   console.log('🟢 Base de datos conectada:', sequelize.getDatabaseName());
// });

// // TODO: el cada each es mejor hacerlo en cada test individual?
// // beforeEach(async () => {
// //   transaction = await sequelize.transaction();
// // });

// // afterEach(async () => {
// //   if (transaction) await transaction.rollback();
// // });

// afterAll(async () => {
//   await sequelize.close();
//   console.log('🔒 Conexión a la DB cerrada correctamente');
// });

// export { transaction };

// src/tests/setupTests.ts
import { DatabaseConnection } from '../patterns/singleton/database.connection';
import { Sequelize } from 'sequelize';
import '../models/entity'; // 🔹 importa modelos para asociaciones
import { User, UserRole } from '../models/entity/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 🔹 Token de admin de test para usar en integration tests
export let testAdminToken: string;

let sequelize: Sequelize;

beforeAll(async () => {
  // 1️⃣ Conexión a la DB
  await DatabaseConnection.connect();
  sequelize = DatabaseConnection.getInstance();
  console.log('🟢 Base de datos conectada:', sequelize.getDatabaseName());

  // 2️⃣ Crear usuario admin de prueba si no existe
  const passwordHash = await bcrypt.hash('admin123', 10);

  const [adminUser] = await User.findOrCreate({
    where: { name: 'AdminTest' },
    defaults: {
      name: 'AdminTest',
      email: 'admin@test.com',
      password: passwordHash,
      role: UserRole.ADMIN,
      address: 'Calle Test 123',
    },
  });

  // 3️⃣ Generar JWT usando la clave de test
  testAdminToken = jwt.sign(
    { user_id: adminUser.user_id, name: adminUser.name, role: adminUser.role },
    process.env.JWT_SECRET || 'mi_jwt_secret_ecommerce',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  console.log(process.env.JWT_SECRET)

  console.log('🔑 Admin de test creado con token JWT');
});

afterAll(async () => {
  // 4️⃣ Limpiar usuario de prueba
  await User.destroy({ where: { name: 'AdminTest' } });

  // 5️⃣ Cerrar conexión
  await sequelize.close();
  console.log('🔒 Conexión a la DB cerrada correctamente');
});
