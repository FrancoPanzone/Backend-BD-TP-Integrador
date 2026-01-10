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
