// src/tests/integration/user.integration.test.ts
// import request from 'supertest';
// import jwt from 'jsonwebtoken';
// import app from '../../app';
// import mockUser from '../../models/implementations/mock/mockUser';
// import { UserRole } from '../../models/entity/user.entity';

// let adminToken: string;
// let normalToken: string;
// const API_KEY = process.env.API_KEY || 'test_api_key';

// beforeAll(() => {
//   if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'testsecret';
// });

// beforeEach(async () => {
//   mockUser.clear();

//   const adminUser = await mockUser.create({
//     name: 'Admin',
//     email: 'admin@example.com',
//     password: 'adminpass',
//     address: 'Admin Address',
//     role: UserRole.ADMIN,
//   });

//   const normalUser = await mockUser.create({
//     name: 'User',
//     email: 'user@example.com',
//     password: 'userpass',
//     address: 'Normal Address',
//     role: UserRole.USER,
//   });

//   adminToken = jwt.sign(
//     { user_id: adminUser.user_id, role: adminUser.role },
//     process.env.JWT_SECRET!,
//     { expiresIn: '1h' },
//   );

//   normalToken = jwt.sign(
//     { user_id: normalUser.user_id, role: normalUser.role },
//     process.env.JWT_SECRET!,
//     { expiresIn: '1h' },
//   );
// });

// describe('Pruebas de integración de usuarios', () => {
//   // ------------------- GET /users -------------------
//   describe('Obtener todos los usuarios (solo admin)', () => {
//     it('debería retornar 403 para usuarios no admin', async () => {
//       const res = await request(app)
//         .get('/api/users')
//         .set('Authorization', `Bearer ${normalToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(403);
//     });

//     it('debería retornar 401 si no hay token', async () => {
//       const res = await request(app).get('/api/users').set('x-api-key', API_KEY);
//       expect(res.status).toBe(401);
//     });

//     it('debería retornar 200 para admin', async () => {
//       const res = await request(app)
//         .get('/api/users')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(200);
//       expect(Array.isArray(res.body)).toBe(true);
//     });
//   });

//   // ------------------- GET /users/:id -------------------
//   describe('Obtener usuario por ID', () => {
//     it('debería retornar 403 para usuarios no admin y no dueños del recurso', async () => {
//       const otherUser = await mockUser.create({
//         name: 'User2',
//         email: 'user2@example.com',
//         password: 'pass2',
//         address: 'Address 2',
//         role: UserRole.USER,
//       });

//       const res = await request(app)
//         .get(`/api/users/${otherUser.user_id}`)
//         .set('Authorization', `Bearer ${normalToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(403);
//     });

//     it('debería retornar 200 para admin', async () => {
//       const user = await mockUser.create({
//         name: 'User2',
//         email: 'user2@example.com',
//         password: 'pass2',
//         address: 'Address 2',
//         role: UserRole.USER,
//       });

//       const res = await request(app)
//         .get(`/api/users/${user.user_id}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(200);
//       expect(res.body.user_id).toBe(user.user_id);
//     });

//     it('debería retornar 404 si el usuario no existe', async () => {
//       const res = await request(app)
//         .get('/api/users/99999')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(404);
//     });
//   });

//   // ------------------- POST /users -------------------
//   describe('Crear usuario', () => {
//     it('debería crear un usuario correctamente', async () => {
//       const res = await request(app).post('/api/users').set('x-api-key', API_KEY).send({
//         name: 'NuevoUsuario',
//         email: 'nuevousuario@example.com',
//         password: 'password123',
//         address: 'Dirección 1',
//       });

//       expect(res.status).toBe(201);
//       expect(res.body.user_id).toBeDefined();
//       expect(res.body.email).toBe('nuevousuario@example.com');
//     });

//     it('no debería permitir emails duplicados', async () => {
//       await mockUser.create({
//         name: 'Usuario1',
//         email: 'duplicado@example.com',
//         password: 'pass123',
//         address: 'Dirección 1',
//         role: UserRole.USER,
//       });

//       const res = await request(app).post('/api/users').set('x-api-key', API_KEY).send({
//         name: 'Usuario1',
//         email: 'duplicado@example.com',
//         password: 'pass123',
//         address: 'Dirección 1',
//       });

//       expect(res.status).toBe(400);
//       expect(res.body.message).toBeDefined();
//       expect(res.body.message).toMatch(/ya está registrado/i);
//     });

//     it('debería retornar 422 si los datos son inválidos', async () => {
//       const res = await request(app).post('/api/users').set('x-api-key', API_KEY).send({
//         name: '',
//         email: 'correo_invalido',
//         password: '123',
//         address: '',
//       });

//       expect(res.status).toBe(422);
//     });
//   });

//   // ------------------- PUT /users/:id -------------------
//   describe('Actualizar usuario', () => {
//     it('debería retornar 403 para usuarios no admin', async () => {
//       const user = await mockUser.create({
//         name: 'Usuario3',
//         email: 'usuario3@example.com',
//         password: 'pass3',
//         address: 'Dirección 3',
//         role: UserRole.USER,
//       });

//       const res = await request(app)
//         .put(`/api/users/${user.user_id}`)
//         .set('Authorization', `Bearer ${normalToken}`)
//         .set('x-api-key', API_KEY)
//         .send({ name: 'Nombre Actualizado' });

//       expect(res.status).toBe(403);
//     });

//     it('debería actualizar el usuario si es admin', async () => {
//       const user = await mockUser.create({
//         name: 'Usuario3',
//         email: 'usuario3@example.com',
//         password: 'pass3',
//         address: 'Dirección 3',
//         role: UserRole.USER,
//       });

//       const res = await request(app)
//         .put(`/api/users/${user.user_id}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY)
//         .send({ name: 'Nombre Actualizado' });

//       expect(res.status).toBe(200);
//       expect(res.body.name).toBe('Nombre Actualizado');
//     });

//     it('debería retornar 404 si el usuario no existe', async () => {
//       const res = await request(app)
//         .put('/api/users/99999')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY)
//         .send({ name: 'SinUsuario' });

//       expect(res.status).toBe(404);
//     });

//     it('debería retornar 422 si los datos son inválidos', async () => {
//       const user = await mockUser.create({
//         name: 'Usuario4',
//         email: 'usuario4@example.com',
//         password: 'pass4',
//         address: 'Dirección 4',
//         role: UserRole.USER,
//       });

//       const res = await request(app)
//         .put(`/api/users/${user.user_id}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY)
//         .send({ email: 'correo_no_valido' });

//       expect(res.status).toBe(422);
//     });
//   });

//   // ------------------- DELETE /users/:id -------------------
//   describe('Eliminar usuario', () => {
//     it('debería retornar 403 para usuarios no admin', async () => {
//       const user = await mockUser.create({
//         name: 'Usuario5',
//         email: 'usuario5@example.com',
//         password: 'pass5',
//         address: 'Dirección 5',
//         role: UserRole.USER,
//       });

//       const res = await request(app)
//         .delete(`/api/users/${user.user_id}`)
//         .set('Authorization', `Bearer ${normalToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(403);
//     });

//     it('debería eliminar usuario si es admin', async () => {
//       const user = await mockUser.create({
//         name: 'Usuario5',
//         email: 'usuario5@example.com',
//         password: 'pass5',
//         address: 'Dirección 5',
//         role: UserRole.USER,
//       });

//       const res = await request(app)
//         .delete(`/api/users/${user.user_id}`)
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(200);
//     });

//     it('debería retornar 404 si el usuario no existe', async () => {
//       const res = await request(app)
//         .delete('/api/users/99999')
//         .set('Authorization', `Bearer ${adminToken}`)
//         .set('x-api-key', API_KEY);

//       expect(res.status).toBe(404);
//     });
//   });
// });

// src/tests/integration/user.integration.test.ts
/* import request from 'supertest';
import app from '../../test-app';
//import { User, UserRole } from '../../models/entity';
import { User, UserRole } from '../../models/entity/user.model';
import { setupIntegrationTests } from './setup';

setupIntegrationTests();

describe('User Integration Tests', () => {
  let adminToken: string;
  let userId: number;

  // Crear un admin antes de los tests para autenticación
  beforeAll(async () => {
    const admin = await User.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: '123456',
      role: UserRole.ADMIN,
      address: '123 Admin St',
    });

    // Login para obtener JWT
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: '123456' });

    adminToken = res.body.token;
  });

  describe('POST /api/users', () => {
    it('should create a new user (public endpoint)', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'Test User',
          email: 'user@test.com',
          password: '123456',
          address: '123 Test St',
          role: UserRole.USER,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.email).toBe('user@test.com');
      userId = res.body.user_id;

      const userInDb = await User.findByPk(userId);
      expect(userInDb).not.toBeNull();
      expect(userInDb!.role).toBe(UserRole.USER);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users (admin only)', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // admin + created user
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id (self or admin)', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Test User');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user (self or admin)', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated User' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated User');

      const updatedUser = await User.findByPk(userId);
      expect(updatedUser!.name).toBe('Updated User');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user (admin only)', async () => {
      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/User deleted successfully/i);

      const deletedUser = await User.findByPk(userId);
      expect(deletedUser).toBeNull();
    });
  });
});
 */

// src/tests/integration/user.integration.test.ts
// src/tests/integration/user.integration.test.ts
import request from 'supertest';
import app from '../../test-app';
import { User, UserRole } from '../../models/entity/user.model';
import UserRepository from '../../repositories/user.repository';
import { setupIntegrationTests } from './setup';

setupIntegrationTests();

describe('User Integration Tests', () => {
  let adminToken: string;
  let normalUserId: number;

  beforeAll(async () => {
    // Crear admin usando el repository (para que el password se hashee)
    const admin = await UserRepository.create({
      name: 'Admin Test',
      email: 'admin@test.com',
      password: '123456',
      role: UserRole.ADMIN,
      address: 'Admin St',
    });

    // Login para obtener token JWT
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: '123456' });

    adminToken = res.body.token;
  });

  it('should create a new user (public endpoint)', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'user@test.com',
        password: '123456',
        address: '123 Test St',
        role: UserRole.USER,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test User');

    normalUserId = res.body.user_id; // guardar para tests siguientes
  });

  it('should return all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2); // admin + user
  });

  it('should return a user by id (self or admin)', async () => {
    const res = await request(app)
      .get(`/api/users/${normalUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Test User');
  });

  it('should update a user (self or admin)', async () => {
    const res = await request(app)
      .put(`/api/users/${normalUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ address: '456 New Address' });

    expect(res.statusCode).toBe(200);
    expect(res.body.address).toBe('456 New Address');
  });

  it('should delete a user (admin only)', async () => {
    const res = await request(app)
      .delete(`/api/users/${normalUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });
});

