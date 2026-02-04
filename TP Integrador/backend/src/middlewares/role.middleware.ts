// src/middlewares/role.middleware.ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { UserRole } from '../models/entity/user.model';

// Middleware para autorizar según rol
export const authorizeRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });

    if (!roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
};

// Middleware para autorizar si es admin o si accede a su propio recurso
// export const authorizeSelfOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
//   // el validate(idParamSchema, 'params') esta antes de authorizeSelfOrAdmin en las rutas: id siempre va a estar
//   const id = req.params.id!;

//   if (!req.user) return res.status(401).json({ message: 'No autenticado' });

//   if (req.user.role === UserRole.ADMIN || req.user.user_id.toString() === id.toString()) {
//     return next();
//   }

//   return res.status(403).json({ message: 'Acceso denegado' });
// };

export const authorizeSelfOrAdmin =
  (paramName: string = 'id') =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const paramValue = req.params[paramName];

    if (!paramValue) {
      return res.status(400).json({
        message: `Falta el parámetro ${paramName}`,
      });
    }

    if (req.user.role === UserRole.ADMIN || req.user.user_id.toString() === paramValue.toString()) {
      return next();
    }

    return res.status(403).json({ message: 'Acceso denegado' });
  };
