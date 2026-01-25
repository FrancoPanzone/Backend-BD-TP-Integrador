// version asincronica
// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';
import UserService from './user.service';
import { User } from '../models/entity/user.model';
import { Transaction } from 'sequelize';

export class AuthService {
  /**
   * LOGIN POR NOMBRE
   * @param name nombre de usuario
   * @param password contraseña
   * @param transaction transacción opcional para tests
   */
  async validateUserByName(
    name: string,
    password: string,
    transaction?: Transaction,
  ): Promise<User | null> {
    const user = await UserService.getByName(name, transaction);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  /**
   * RECUPERO DE CONTRASEÑA POR EMAIL
   * @param email correo del usuario
   * @param transaction transacción opcional para tests
   */
  async sendPasswordReset(email: string, transaction?: Transaction): Promise<boolean> {
    const user = await UserService.getByEmail(email, transaction);
    if (!user) return false;

    // aquí podríamos enviar un correo real
    console.log(`Simulación: se envió un correo a ${email} con instrucciones de recuperación`);

    return true;
  }

  /**
   * Genera JWT de forma asíncrona
   * @param user usuario
   */
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
