// src/tests/integration/user.integration.test.ts
import userService from '../../services/user.service';
import { sequelize } from '../../models/entity/index'; // tu instancia de Sequelize
import { UserInput, UserUpdate } from '../../dtos/user.dto';
import { UserRole } from '../../models/entity/user.model';
import bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';

describe('UserService - Integration Tests', () => {
  let testUser: UserInput;
  let transaction: Transaction;

  beforeEach(async () => {
    transaction = await sequelize.transaction(); // transacción independiente para cada test
    testUser = {
      name: 'Integration User',
      email: 'integration@example.com',
      password: 'Password123',
      address: 'Integration Street 1',
    };
  });

  afterEach(async () => {
    await transaction.rollback(); // limpia la DB después de cada test
  });

  it('should create a user and retrieve it by ID', async () => {
    const user = await userService.create(testUser, transaction);
    expect(user).toBeDefined();
    expect(user.name).toBe(testUser.name);
    expect(user.email).toBe(testUser.email);
    expect(user.role).toBe(UserRole.USER);

    const foundUser = await userService.getById(user.user_id, transaction);
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe(testUser.email);
  });

  it('should hash the password when creating user', async () => {
    const user = await userService.create(testUser, transaction);
    expect(await bcrypt.compare(testUser.password, user.password)).toBe(true);
  });

  it('should throw error if email already exists', async () => {
    await userService.create(testUser, transaction);
    await expect(userService.create(testUser, transaction)).rejects.toThrow(
      'El email ya está registrado',
    );
  });

  // it('should update a user', async () => {
  //   const user = await userService.create(testUser, transaction);

  //   const updateData: UserUpdate = {
  //     name: 'Updated Name',
  //     password: 'NewPassword123'
  //   };

  //   const updatedUser = await userService.update(user.user_id, updateData, transaction);

  //   expect(updatedUser).toBeDefined();
  //   expect(updatedUser?.name).toBe('Updated Name');
  //   expect(await bcrypt.compare(updateData.password!, updatedUser!.password)).toBe(true);
  // });

  // it('should update a user', async () => {
  //   const user = await userService.create(testUser, transaction);

  //   const updateData: UserUpdate = {
  //     name: 'Updated Name',
  //     password: 'NewPassword123'
  //   };

  //   const updatedUser = await userService.update(user.user_id, updateData, transaction);

  //   // Refrescar desde DB para asegurarse de que el hash es el que se guardó
  //   const freshUser = await userService.getById(user.user_id, transaction);

  //   expect(freshUser).toBeDefined();
  //   expect(freshUser?.name).toBe('Updated Name');
  //   console.log('updateData.password:', JSON.stringify(updateData.password));
  //   console.log('freshUser.password:', freshUser!.password);

  //   expect(await bcrypt.compare(updateData.password!, freshUser!.password)).toBe(true);
  // });

  it('should update a user', async () => {
    const user = await userService.create(testUser, transaction);

    const newPassword = 'NewPassword123'; // <-- texto plano
    const updateData: UserUpdate = {
      name: 'Updated Name',
      password: newPassword,
    };

    const updatedUser = await userService.update(user.user_id, updateData, transaction);

    const freshUser = await userService.getById(user.user_id, transaction);

    expect(freshUser).toBeDefined();
    expect(freshUser?.name).toBe('Updated Name');

    // comparar texto plano con hash guardado
    expect(await bcrypt.compare(newPassword, freshUser!.password)).toBe(true);
  });

  it('should delete a user', async () => {
    const user = await userService.create(testUser, transaction);
    const deleted = await userService.delete(user.user_id, transaction);
    expect(deleted).toBe(true);

    const found = await userService.getById(user.user_id, transaction);
    expect(found).toBeNull();
  });
});
