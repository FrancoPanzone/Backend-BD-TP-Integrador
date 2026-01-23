// src/routes/orderDetail.routes.ts

import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware'; // middleware general con zod
import { idParamSchema } from '../schemas/common.schema';
import orderDetailController from '../controllers/orderDetail.controller';
import { orderDetailSchema } from '../schemas/orderDetail.schema';

import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRole, authorizeSelfOrAdmin } from '../middlewares/role.middleware';
import { UserRole } from '../models/entity/user.model';

const router = Router();

// GET /api/orderDetails
router.get('/', orderDetailController.getAll);
// GET /api/orderDetails/:id
router.get('/:id', validate(idParamSchema, 'params'), orderDetailController.getById);
// GET /api/orderDetails/product/:productId
router.get('/product/:productId', orderDetailController.getByProductId);
// GET /api/orderDetails/order/:orderId
router.get('/order/:orderId', orderDetailController.getByOrderId);
// POST /api/orderDetails
router.post(
  '/',
  authenticateJWT,
  authorizeRole(UserRole.ADMIN),
  validate(orderDetailSchema, 'body'),
  orderDetailController.create,
);
// DELETE /api/orderDetails/:id
router.delete(
  '/:id',
  authenticateJWT,
  authorizeRole(UserRole.ADMIN),
  validate(idParamSchema, 'params'),
  orderDetailController.delete,
);

export default router;
