// src/routes/order.routes.ts

import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { validate } from '../middlewares/validate.middleware';
import { idParamSchema, userIdParamSchema, paginationQuerySchema } from '../schemas/common.schema';
import { orderInputSchema, orderStatusSchema } from '../schemas/order.schema';

import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole, authorizeSelfOrAdmin } from '../middlewares/role.middleware';
import { UserRole } from '../models/entity/user.model';

const router = Router();

// GET /api/orders
router.get('/', OrderController.getAll);

// GET /api/orders/:id
router.get('/:id', authenticateJWT, validate(idParamSchema, 'params'), OrderController.getById);

// GET /api/orders/user/:userId (propio o admin)
router.get(
  '/user/:userId',
  authenticateJWT,
  validate(userIdParamSchema, 'params'),
  authorizeSelfOrAdmin('userId'),
  OrderController.getByUserId,
);

// POST /api/orders
router.post('/', validate(orderInputSchema, 'body'), OrderController.create);

// DELETE /api/orders/:id (solo admin)
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRole(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  OrderController.delete,
);

// PATCH /api/orders/:id/status (solo admin)
router.patch(
  '/:id/status',
  authenticateJWT,
  authorizeRole(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  validate(orderStatusSchema, 'body'),
  OrderController.updateStatus,
);

// POST /api/orders/checkout/:userId
// para simular el flujo entre cart-itemCart-orderDetail-order
router.post(
  '/checkout/:userId',
  authenticateJWT,
  validate(userIdParamSchema, 'params'), // Zod valida y transforma userId
  OrderController.checkout,
);
export default router;
