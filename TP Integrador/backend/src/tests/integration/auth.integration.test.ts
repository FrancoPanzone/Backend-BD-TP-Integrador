// src/tests/integration/auth.integration.test.ts
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import { sequelize } from '../../models/entity';
import { UserInput } from '../../dtos/user.dto';
import { Transaction } from 'sequelize';
import { UserRole } from '../../models/entity/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt.config';

describe('AuthService - Integration Tests', () => {
  let transaction: Transaction;
  let testUser: UserInput;

  beforeEach(async () => {
    transaction = await sequelize.transaction();
    testUser = {
      name: 'AuthTestUser',
      email: 'authtest@example.com',
      password: 'Password123',
      address: 'Auth Street 1',
      role: UserRole.USER,
    };
  });

  afterEach(async () => {
    await transaction.rollback(); // limpia la DB después de cada test
  });

  it('should validate a user by name and password', async () => {
    // Crear usuario real en DB con transacción
    const user = await UserService.create(testUser, transaction);

    const validated = await AuthService.validateUserByName(user.name, testUser.password, transaction);

    expect(validated).toBeDefined();
    expect(validated?.user_id).toBe(user.user_id);
    expect(validated?.email).toBe(user.email);
  });

  it('should return null if user does not exist', async () => {
    const validated = await AuthService.validateUserByName('NonExistent', 'any', transaction);
    expect(validated).toBeNull();
  });

  it('should return null if password is incorrect', async () => {
    const user = await UserService.create(testUser, transaction);
    const validated = await AuthService.validateUserByName(user.name, 'WrongPassword', transaction);
    expect(validated).toBeNull();
  });

  it('should generate a valid JWT token', async () => {
    const user = await UserService.create(testUser, transaction);
    const token = await AuthService.generateToken(user);

    expect(token).toBeDefined();

    const decoded = jwt.verify(token, jwtConfig.secret) as any;
    expect(decoded.user_id).toBe(user.user_id);
    expect(decoded.role).toBe(user.role);
  });

  it('should simulate sending a password reset', async () => {
    const user = await UserService.create(testUser, transaction);
    const result = await AuthService.sendPasswordReset(user.email, transaction);

    expect(result).toBe(true);
  });

  it('should return false if password reset email does not exist', async () => {
    const result = await AuthService.sendPasswordReset('unknown@example.com', transaction);
    expect(result).toBe(false);
  });
});
