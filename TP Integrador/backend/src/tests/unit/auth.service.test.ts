// tests/unit/auth.service.test.ts
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import AuthService from '../../services/auth.service';
// import UserService from '../../services/user.service';
// import { User, UserRole } from '../../models/entity/user.entity';
// import { jwtConfig } from '../../config/jwt.config';

// jest.mock('bcrypt');
// jest.mock('jsonwebtoken');
// jest.mock('../../services/user.service');

// describe('AuthService', () => {
//   const mockUser = new User(
//     1,
//     'TestUser',
//     'test@example.com',
//     'hashedPassword',
//     'Fake Street 123',
//     UserRole.USER,
//   );

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   // Tests para validateUserByName
//   describe('validateUserByName', () => {
//     it('debería devolver el usuario si el nombre y la contraseña son válidos', async () => {
//       (UserService.getByName as jest.Mock).mockResolvedValue(mockUser);
//       (bcrypt.compare as jest.Mock).mockResolvedValue(true);

//       const result = await AuthService.validateUserByName('TestUser', 'password123');

//       expect(UserService.getByName).toHaveBeenCalledWith('TestUser');
//       expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
//       expect(result).toEqual(mockUser);
//     });

//     it('debería devolver null si el usuario no existe', async () => {
//       (UserService.getByName as jest.Mock).mockResolvedValue(undefined);

//       const result = await AuthService.validateUserByName('UnknownUser', 'password123');

//       expect(result).toBeNull();
//     });

//     it('debería devolver null si la contraseña es incorrecta', async () => {
//       (UserService.getByName as jest.Mock).mockResolvedValue(mockUser);
//       (bcrypt.compare as jest.Mock).mockResolvedValue(false);

//       const result = await AuthService.validateUserByName('TestUser', 'wrongpass');

//       expect(result).toBeNull();
//     });
//   });

//   // Tests para generateToken
//   describe('generateToken', () => {
//     it('debería generar un token JWT correctamente', async () => {
//       (jwt.sign as jest.Mock).mockImplementation((payload, secret, options, callback) => {
//         callback(null, 'jwt.token.here');
//       });

//       const token = await AuthService.generateToken(mockUser);

//       expect(jwt.sign).toHaveBeenCalledWith(
//         { user_id: mockUser.user_id, role: mockUser.role },
//         jwtConfig.secret,
//         { expiresIn: jwtConfig.expiresIn },
//         expect.any(Function),
//       );
//       expect(token).toBe('jwt.token.here');
//     });
//   });
// });

// tests/unit/auth.service.test.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import { User, UserRole } from '../../models/entity/user.model';
import { jwtConfig } from '../../config/jwt.config';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../services/user.service');

describe('AuthService', () => {
  const mockUser = new User({
    user_id: 1,
    name: 'TestUser',
    email: 'test@example.com',
    password: 'hashedPassword',
    address: 'Fake Street 123',
    role: UserRole.USER,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUserByName', () => {
    it('debería devolver el usuario si el nombre y la contraseña son válidos', async () => {
      (UserService.getByName as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await AuthService.validateUserByName('TestUser', 'password123');

      ///expect(UserService.getByName).toHaveBeenCalledWith('TestUser');
      expect(UserService.getByName).toHaveBeenCalledWith('TestUser', undefined);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result).toEqual(mockUser);
    });

    it('debería devolver null si el usuario no existe', async () => {
      (UserService.getByName as jest.Mock).mockResolvedValue(undefined);

      const result = await AuthService.validateUserByName('UnknownUser', 'password123');

      expect(result).toBeNull();
    });

    it('debería devolver null si la contraseña es incorrecta', async () => {
      (UserService.getByName as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await AuthService.validateUserByName('TestUser', 'wrongpass');

      expect(result).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('debería generar un token JWT correctamente', async () => {
      (jwt.sign as jest.Mock).mockImplementation((payload, secret, options, callback) => {
        callback(null, 'jwt.token.here');
      });

      const token = await AuthService.generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: mockUser.user_id, role: mockUser.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn },
        expect.any(Function),
      );
      expect(token).toBe('jwt.token.here');
    });
  });

  describe('sendPasswordReset', () => {
    it('debería devolver true si el usuario existe', async () => {
      (UserService.getByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.sendPasswordReset('test@example.com');

      //expect(UserService.getByEmail).toHaveBeenCalledWith('test@example.com');
      expect(UserService.getByEmail).toHaveBeenCalledWith('test@example.com', undefined);
      expect(result).toBe(true);
    });

    it('debería devolver false si el usuario no existe', async () => {
      (UserService.getByEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await AuthService.sendPasswordReset('unknown@example.com');

      expect(result).toBe(false);
    });
  });
});
