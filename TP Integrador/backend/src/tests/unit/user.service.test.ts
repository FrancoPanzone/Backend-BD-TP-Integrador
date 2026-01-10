// tests/unit/user.service.test.ts
import UserService from '../../services/user.service';
import UserRepository from '../../repositories/user.repository';
import bcrypt from 'bcrypt';
import { UserRole } from '../../models/entity/user.model';

jest.mock('../../repositories/user.repository');

describe('UserService - Unit Tests', () => {
  const sampleUser = {
    user_id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    address: 'Test Street 1',
    role: UserRole.USER,
  };

  const sampleInput = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
    address: 'Test Street 1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  it('should create a new user and delegate password hashing to repository', async () => {
    (UserRepository.getByEmail as jest.Mock).mockResolvedValue(null);
    (UserRepository.create as jest.Mock).mockResolvedValue({
      ...sampleUser,
      password: 'hashedPassword',
    });

    const created = await UserService.create(sampleInput);

    expect(UserRepository.getByEmail).toHaveBeenCalledWith(
      'test@example.com',
      undefined
    );

    expect(UserRepository.create).toHaveBeenCalledWith(
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123', // contraseña en claro
        address: 'Test Street 1',
        role: UserRole.USER,
      },
      undefined
    );

    expect(created.password).toBe('hashedPassword');
  });

  it('should throw error if email already exists', async () => {
    (UserRepository.getByEmail as jest.Mock).mockResolvedValue(sampleUser);

    await expect(UserService.create(sampleInput)).rejects.toThrow(
      'El email ya está registrado'
    );

    expect(UserRepository.getByEmail).toHaveBeenCalledWith(
      'test@example.com',
      undefined
    );
  });

  // GET
  it('should get a user by ID', async () => {
    (UserRepository.getById as jest.Mock).mockResolvedValue(sampleUser);

    const user = await UserService.getById(1);

    expect(UserRepository.getById).toHaveBeenCalledWith(
      1,
      undefined
    );
    expect(user).toBe(sampleUser);
  });

  it('should get a user by email', async () => {
    (UserRepository.getByEmail as jest.Mock).mockResolvedValue(sampleUser);

    const user = await UserService.getByEmail('test@example.com');

    expect(UserRepository.getByEmail).toHaveBeenCalledWith(
      'test@example.com',
      undefined
    );
    expect(user).toBe(sampleUser);
  });

  // UPDATE
  it('should update user password', async () => {
    (UserRepository.update as jest.Mock).mockImplementation(
      async (_id, data) => ({
        ...sampleUser,
        ...data,
        password: await bcrypt.hash(data.password, 10),
      })
    );

    const updated = await UserService.update(1, { password: 'newpass' });

    expect(UserRepository.update).toHaveBeenCalledWith(
      1,
      expect.any(Object),
      undefined
    );

    const isMatch = await bcrypt.compare('newpass', updated!.password);
    expect(isMatch).toBe(true);
  });

  // DELETE
  it('should delete a user', async () => {
    (UserRepository.delete as jest.Mock).mockResolvedValue(true);

    const result = await UserService.delete(1);

    expect(UserRepository.delete).toHaveBeenCalledWith(
      1,
      undefined
    );
    expect(result).toBe(true);
  });

  it('should return false when deleting non-existing user', async () => {
    (UserRepository.delete as jest.Mock).mockResolvedValue(false);

    const result = await UserService.delete(999);

    expect(UserRepository.delete).toHaveBeenCalledWith(
      999,
      undefined
    );
    expect(result).toBe(false);
  });
});

