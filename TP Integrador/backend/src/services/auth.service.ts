// version sincronica
/* import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import UserService from './user.service';
import { User } from '../models/entity/user.entity';

export class AuthService {
  async validateUser(email: string, password: string): Promise<User | null> {
    const users = await UserService.getAll();
    const user = users.find((u) => u.email === email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  generateToken(user: User): string {
    return jwt.sign(
      { user_id: user.user_id, role: user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn },
    );
  }
}

export default new AuthService(); */

// version asincronica
// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import UserService from './user.service';
import { User } from '../models/entity/user.model';

export class AuthService {
  // LOGIN POR NOMBRE
  async validateUserByName(name: string, password: string): Promise<User | null> {
    const user = await UserService.getByName(name);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // RECUPERO DE CONTRASEÑA POR EMAIL
  async sendPasswordReset(email: string): Promise<boolean> {
    const user = await UserService.getByEmail(email);
    if (!user) return false;

    // aqui podriamos enviar un correo real
    // pero en esta versión solo simulamos
    console.log(`Simulación: se envió un correo a ${email} con instrucciones de recuperación`);

    return true;
  }

  // Generar JWT de forma asíncrona
  async generateToken(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { user_id: user.user_id, role: user.role },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn },
        (err: Error | null, token?: string) => {
          if (err || !token) return reject(err);
          resolve(token);
        },
      );
    });
  }
}

export default new AuthService();
