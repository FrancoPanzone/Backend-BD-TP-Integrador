// // tests/user.service.test.ts
// import userService from '../../services/user.service';
// import mockUser from '../../models/implementations/mock/mockUser';
// import bcrypt from 'bcrypt';

// describe('UserService - Unit Tests', () => {
//   beforeEach(() => {
//     mockUser.clear();
//   });

//   it('should create a new user with hashed password', async () => {
//     const newUser = await userService.create({
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'Password123',
//       address: 'Test Street 1',
//     });

//     expect(newUser.user_id).toBeDefined();
//     expect(newUser.name).toBe('Test User');

//     const isMatch = await bcrypt.compare('Password123', newUser.password);
//     expect(isMatch).toBe(true);

//     // validar todo el objeto plano
//     expect(newUser.toJSON()).toEqual({
//       user_id: expect.any(Number),
//       name: 'Test User',
//       email: 'test@example.com',
//       password: expect.any(String),
//       address: 'Test Street 1',
//       role: 'USER',
//     });
//   });

//   it('should not allow duplicate emails', async () => {
//     await userService.create({
//       name: 'User1',
//       email: 'dup@example.com',
//       password: '123',
//       address: 'Street',
//     });

//     await expect(
//       userService.create({
//         name: 'User2',
//         email: 'dup@example.com',
//         password: '123',
//         address: 'Street',
//       }),
//     ).rejects.toThrow('El email ya está registrado');
//   });

//   it('should get a user by ID', async () => {
//     const created = await userService.create({
//       name: 'User3',
//       email: 'user3@example.com',
//       password: '123',
//       address: 'Street',
//     });

//     const fetched = await userService.getById(created.user_id);
//     expect(fetched).not.toBeUndefined();
//     expect(fetched!.email).toBe('user3@example.com');
//   });

//   it('should update a user password', async () => {
//     const created = await userService.create({
//       name: 'User4',
//       email: 'user4@example.com',
//       password: 'oldpass',
//       address: 'Street',
//     });

//     const updated = await userService.update(created.user_id, { password: 'newpass' });
//     expect(updated).not.toBeUndefined();
//     const isMatch = await bcrypt.compare('newpass', updated!.password);
//     expect(isMatch).toBe(true);
//   });

//   it('should delete a user', async () => {
//     const created = await userService.create({
//       name: 'User5',
//       email: 'user5@example.com',
//       password: '123',
//       address: 'Street',
//     });

//     const deleted = await userService.delete(created.user_id);
//     expect(deleted).toBe(true);
//     const deletedAgain = await userService.delete(created.user_id);
//     expect(deletedAgain).toBe(false);
//   });
// });

// tests/unit/user.service.test.ts
// import userService from '../../services/user.service';
// import UserRepository from '../../repositories/user.repository';
// import bcrypt from 'bcrypt';
// import { UserRole } from '../../models/entity/user.model';

// jest.mock('../../repositories/user.repository'); // mockea todo el repo
// jest.mock('bcrypt');

// describe('UserService - Unit Tests', () => {
//   const mockedRepo = UserRepository as jest.Mocked<typeof UserRepository>;

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should create a new user with hashed password', async () => {
//     (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

//     const fakeUser = {
//       user_id: 1,
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'hashedPassword',
//       address: 'Street 1',
//       role: UserRole.USER,
//     } as any;

//     mockedRepo.getByEmail.mockResolvedValue(null);
//     mockedRepo.create.mockResolvedValue(fakeUser);

//     const user = await userService.create({
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'Password123',
//       address: 'Street 1',
//     });

//     expect(mockedRepo.getByEmail).toHaveBeenCalledWith('test@example.com');
//     expect(mockedRepo.create).toHaveBeenCalled();
//     expect(user.password).toBe('hashedPassword');
//   });

//   it('should throw error if email exists', async () => {
//     const existingUser = { user_id: 1, email: 'dup@example.com' } as any;
//     mockedRepo.getByEmail.mockResolvedValue(existingUser);

//     await expect(
//       userService.create({
//         name: 'User',
//         email: 'dup@example.com',
//         password: '123',
//         address: 'Street',
//       })
//     ).rejects.toThrow('El email ya está registrado');
//   });

//   it('should update password', async () => {
//     const hashed = 'newHashed';
//     (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);

//     const fakeUser = { user_id: 1, password: hashed } as any;
//     mockedRepo.update.mockResolvedValue(fakeUser);

//     const updated = await userService.update(1, { password: 'newpass' });

//     expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
//     expect(mockedRepo.update).toHaveBeenCalledWith(1, { password: hashed });
//     expect(updated!.password).toBe(hashed);
//   });

//   it('should delete user', async () => {
//     mockedRepo.delete.mockResolvedValue(true);

//     const result = await userService.delete(1);
//     expect(result).toBe(true);
//     expect(mockedRepo.delete).toHaveBeenCalledWith(1);
//   });
// });

// tests/unit/user.service.test.ts
// import UserService from '../../services/user.service';
// import UserRepository from '../../repositories/user.repository';
// import bcrypt from 'bcrypt';
// import { UserRole } from '../../models/entity/user.model';

// jest.mock('../../repositories/user.repository');

// describe('UserService - Unit Tests', () => {
//   const sampleUser = {
//     user_id: 1,
//     name: 'Test User',
//     email: 'test@example.com',
//     password: 'hashedPassword',
//     address: 'Test Street 1',
//     role: UserRole.USER,
//   };

//   const sampleInput = {
//     name: 'Test User',
//     email: 'test@example.com',
//     password: 'Password123',
//     address: 'Test Street 1',
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // CREATE
//   // it('should create a new user with hashed password', async () => {
//   //   (UserRepository.getByEmail as jest.Mock).mockResolvedValue(null);
//   //   (UserRepository.create as jest.Mock).mockImplementation(async (data) => ({
//   //     ...data,
//   //     user_id: 1,
//   //   }));

//   //   const created = await UserService.create(sampleInput);

//   //   expect(UserRepository.getByEmail).toHaveBeenCalledWith('test@example.com');
//   //   expect(UserRepository.create).toHaveBeenCalledWith(
//   //     expect.objectContaining({
//   //       name: 'Test User',
//   //       email: 'test@example.com',
//   //       password: expect.any(String),
//   //       address: 'Test Street 1',
//   //       role: UserRole.USER,
//   //     }),
//   //   );

//   //   const isMatch = await bcrypt.compare('Password123', created.password);
//   //   expect(isMatch).toBe(true);
//   // });

//   it('should create a new user and delegate password hashing to repository', async () => {
//     (UserRepository.getByEmail as jest.Mock).mockResolvedValue(null);
//     (UserRepository.create as jest.Mock).mockResolvedValue({
//       ...sampleUser,
//       password: 'hashedPassword',
//     });

//     const created = await UserService.create(sampleInput);

//     expect(UserRepository.getByEmail).toHaveBeenCalledWith('test@example.com');

//     expect(UserRepository.create).toHaveBeenCalledWith({
//       name: 'Test User',
//       email: 'test@example.com',
//       password: 'Password123', // 👉 contraseña en claro
//       address: 'Test Street 1',
//       role: UserRole.USER,
//     });

//     expect(created.password).toBe('hashedPassword');
//   });

//   it('should throw error if email already exists', async () => {
//     (UserRepository.getByEmail as jest.Mock).mockResolvedValue(sampleUser);

//     await expect(UserService.create(sampleInput)).rejects.toThrow(
//       'El email ya está registrado',
//     );
//   });

//   // GET
//   it('should get a user by ID', async () => {
//     (UserRepository.getById as jest.Mock).mockResolvedValue(sampleUser);

//     const user = await UserService.getById(1);

//     expect(UserRepository.getById).toHaveBeenCalledWith(1);
//     expect(user).toBe(sampleUser);
//   });

//   it('should get a user by email', async () => {
//     (UserRepository.getByEmail as jest.Mock).mockResolvedValue(sampleUser);

//     const user = await UserService.getByEmail('test@example.com');

//     expect(UserRepository.getByEmail).toHaveBeenCalledWith('test@example.com');
//     expect(user).toBe(sampleUser);
//   });

//   // UPDATE
//   it('should update user password', async () => {
//     (UserRepository.update as jest.Mock).mockImplementation(async (id, data) => ({
//       ...sampleUser,
//       ...data,
//     }));

//     const updated = await UserService.update(1, { password: 'newpass' });
//     expect(UserRepository.update).toHaveBeenCalledWith(1, expect.any(Object));

//     const isMatch = await bcrypt.compare('newpass', updated!.password);
//     expect(isMatch).toBe(true);
//   });

//   // DELETE
//   it('should delete a user', async () => {
//     (UserRepository.delete as jest.Mock).mockResolvedValue(true);

//     const result = await UserService.delete(1);
//     expect(UserRepository.delete).toHaveBeenCalledWith(1);
//     expect(result).toBe(true);
//   });

//   it('should return false when deleting non-existing user', async () => {
//     (UserRepository.delete as jest.Mock).mockResolvedValue(false);

//     const result = await UserService.delete(999);
//     expect(result).toBe(false);
//   });
// });

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

