// src/tests/integration/auth.integration.test.ts
import request from 'supertest';
import app from '../../app';
import UserService from '../../services/user.service';
import bcrypt from 'bcrypt';
import { User, UserRole } from '../../models/entity/user.entity';

describe('Integración - AUTH', () => {
  const API_KEY = process.env.API_KEY || 'test_api_key';

  let testUser: User;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Crear instancia real de User
    testUser = new User(
      1,
      'TestUser',
      'testuser@example.com',
      hashedPassword,
      'Calle Falsa 123',
      UserRole.USER,
    );

    // Mockear getByName para login
    jest.spyOn(UserService, 'getByName').mockImplementation(async (name: string) => {
      return name === testUser.name ? testUser : undefined;
    });

    // Mockear getByEmail para forgot-password
    jest.spyOn(UserService, 'getByEmail').mockImplementation(async (email: string) => {
      return email === testUser.email ? testUser : undefined;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // ------------------- LOGIN -------------------
  describe('POST /api/auth/login', () => {
    it('debería iniciar sesión con credenciales válidas y devolver un token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('x-api-key', API_KEY)
        .send({ name: 'TestUser', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login exitoso');
      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe(testUser.name);
    });

    it('debería retornar 401 si la contraseña es incorrecta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('x-api-key', API_KEY)
        .send({ name: 'TestUser', password: 'wrongpass' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Credenciales inválidas');
    });

    it('debería retornar 401 si el usuario no existe', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('x-api-key', API_KEY)
        .send({ name: 'NoExiste', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Credenciales inválidas');
    });

    it('debería retornar 422 si faltan campos o no cumplen el schema', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('x-api-key', API_KEY)
        .send({ name: 'Te' }); // contraseña faltante

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
  });

  // ------------------- FORGOT PASSWORD -------------------
  describe('POST /api/auth/forgot-password', () => {
    it('debería enviar un "correo" si el email existe', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .set('x-api-key', API_KEY)
        .send({ email: 'testuser@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Se enviaron instrucciones a su correo electrónico');
    });

    it('debería retornar 404 si el email no pertenece a ningún usuario', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .set('x-api-key', API_KEY)
        .send({ email: 'noexiste@example.com' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('No existe un usuario con ese email');
    });

    it('debería retornar 422 si el email es inválido', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .set('x-api-key', API_KEY)
        .send({ email: 'correo-invalido' });

      expect(res.status).toBe(422);
      expect(res.body.errors).toBeDefined();
    });
  });
});
