// src/routes/user.route.ts
import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { userInputSchema, userUpdateSchema } from '../schemas/user.schema';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole, authorizeSelfOrAdmin } from '../middlewares/role.middleware';
import { UserRole } from '../models/entity/user.model';

const router = Router();

// GET /api/users — obtener todos los usuarios (solo admin)
router.get('/', authenticateJWT, authorizeRole(UserRole.ADMIN), UserController.getAll);

// GET /api/users/:id — obtener usuario por ID (propio o admin)
router.get(
  '/:id',
  authenticateJWT,
  validate(idParamSchema, 'params'),
  authorizeSelfOrAdmin('id'),
  UserController.getById,
);

// POST /api/users — registrar un nuevo usuario (público)
router.post('/', validate(userInputSchema, 'body'), UserController.create);

// PUT /api/users/:id — actualizar usuario (propio o admin)
// el validate(idParamSchema, 'params') esta antes de authorizeSelfOrAdmin en las rutas id siempre va a estar
router.put(
  '/:id',
  authenticateJWT,
  validate(idParamSchema, 'params'),
  validate(userUpdateSchema, 'body'),
  authorizeSelfOrAdmin('id'),
  UserController.update,
);

// DELETE /api/users/:id — eliminar usuario (solo admin)
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRole(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  UserController.delete,
);

export default router;
