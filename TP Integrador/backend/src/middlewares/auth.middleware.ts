// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/entity/user.model';

type JwtPayloadCustom = {
  user_id: number;
  role: 'ADMIN' | 'USER' | UserRole;
};

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    role: 'ADMIN' | 'USER';
  };
}

// export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const JWT_SECRET: string = process.env.JWT_SECRET ?? 'super_secret_key';
//   const authHeader = req.headers.authorization;

//   console.log('auth middleware', process.env.JWT_SECRET)

//   // Validamos que venga el header
//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Token no proporcionado' });
//   }

//   try {
//     // Validamos que token no sea undefined
//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ message: 'Token no proporcionado' });
//     }
//     // Verificamos y decodificamos el token
//     const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadCustom;

//     // Validamos que contenga user_id y role
//     if (!decoded.user_id || !decoded.role) {
//       return res.status(403).json({ message: 'Token inválido' });
//     }

//     // Normalizamos el rol para asegurar que sea siempre un string "ADMIN" o "USER"
//     const normalizedRole = decoded.role?.toString().toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';

//     // Asignamos la info del usuario al request
//     req.user = {
//       user_id: decoded.user_id,
//       role: normalizedRole,
//     };

//     next();
//   } catch (err) {
//     return res.status(403).json({ message: 'Token inválido o expirado' });
//   }
// };

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const JWT_SECRET: string = process.env.JWT_SECRET ?? 'super_secret_key';
  const authHeader = req.headers.authorization;

  console.log('🔹 auth middleware called');
  console.log('authHeader:', authHeader);
  console.log('JWT_SECRET:', JWT_SECRET);

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('❌ Token no proporcionado');
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('❌ Token vacío');
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadCustom;
    req.user = { user_id: decoded.user_id, role: decoded.role };
    console.log('✅ Token verificado', req.user);
    next();
  } catch (err) {
    console.log('❌ Token inválido', err);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};