// // src/services/user.service.ts
// import { User, UserRole } from '../models/entity/user.entity';
// import { UserInput } from '../dtos/user.dto';
// import mockUser from '../models/implementations/mock/mockUser';
// import bcrypt from 'bcrypt';

// export class UserService {
//   private userRepo = mockUser; // cuando lo ponemos en base de datos ponemos el repo de postgres y no el mock

//   // Devuelve todos los usuarios (solo para admin)
//   async getAll(): Promise<User[]> {
//     return this.userRepo.getAll();
//   }

//   // Obtiene un usuario por su ID
//   async getById(id: number): Promise<User | undefined> {
//     return this.userRepo.getById(id);
//   }

//   // Crea un nuevo usuario
//   // - Si no se especifica rol, se asigna "USER"
//   // - Hashea la contraseña
//   async create(data: UserInput): Promise<User> {
//     const existing = (await this.userRepo.getAll()).find((u) => u.email === data.email);

//     if (existing) {
//       throw new Error('El email ya está registrado');
//     }

//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     const newUser: UserInput = {
//       ...data,
//       password: hashedPassword,
//       role: data.role ?? UserRole.USER,
//     };

//     return this.userRepo.create(newUser);
//   }

//   // Actualiza un usuario
//   async update(id: number, data: Partial<User>): Promise<User | undefined> {
//     // Si incluye contraseña, la hasheamos antes
//     if (data.password) {
//       data.password = await bcrypt.hash(data.password, 10);
//     }

//     return this.userRepo.update(id, data);
//   }

//   //Elimina un usuario
//   async delete(id: number): Promise<boolean> {
//     return this.userRepo.delete(id);
//   }

//   // Busca usuario por email (útil para login / autenticación)
//   async getByEmail(email: string): Promise<User | undefined> {
//     const users = await this.userRepo.getAll();
//     return users.find((u) => u.email === email);
//   }

//   async getByName(name: string): Promise<User | undefined> {
//     const users = await this.userRepo.getAll();
//     return users.find((u) => u.name.toLowerCase() === name.toLowerCase());
//   }
// }

// export default new UserService();

// src/services/user.service.ts
import { User, UserRole } from '../models/entity/user.model';
import { UserInput, UserUpdate } from '../dtos/user.dto';
import UserRepository from '../repositories/user.repository';
import bcrypt from 'bcrypt';

class UserService {
  // Devuelve todos los usuarios (solo para admin)
  async getAll(): Promise<User[]> {
    return UserRepository.getAll();
  }

  // Obtiene un usuario por su ID
  async getById(id: number): Promise<User | null> {
    return UserRepository.getById(id);
  }

  // Busca usuario por email (útil para login / autenticación)
  async getByEmail(email: string): Promise<User | null> {
    return UserRepository.getByEmail(email);
  }

  // Busca usuario por nombre
  async getByName(name: string): Promise<User | null> {
    const users = await UserRepository.getAll();
    return users.find((u) => u.name.toLowerCase() === name.toLowerCase()) || null;
  }

  // Crea un nuevo usuario
  // - Si no se especifica rol, se asigna "USER"
  // - Hashea la contraseña
  async create(data: UserInput): Promise<User> {
    const existing = await this.getByEmail(data.email);
    if (existing) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser: Partial<User> = {
      ...data,
      password: hashedPassword,
      role: data.role ?? UserRole.USER,
    };

    return UserRepository.create(newUser);
  }

  // Actualiza un usuario
  async update(id: number, data: UserUpdate): Promise<User | null> {
    // Si incluye contraseña, la hasheamos antes
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return UserRepository.update(id, data as Partial<User>);
  }

  // Elimina un usuario
  async delete(id: number): Promise<boolean> {
    return UserRepository.delete(id);
  }
}

export default new UserService();
