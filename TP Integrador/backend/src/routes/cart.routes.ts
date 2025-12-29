import { Router } from 'express';
import CartController from '../controllers/cart.controller';
import { validate } from '../middlewares/validate.middleware'; // middleware general con zod
import { idParamSchema } from '../schemas/common.schema';
import { cartSchema } from '../schemas/cart.schema'; // esquema zod para crear review

const router = Router();

// GET /api/carts
router.get('/', CartController.getAll);
// GET /api/carts/:id
router.get('/:id', validate(idParamSchema, 'params'), CartController.getById);
// GET /api/carts/user/:userId
router.get('/user/:userId', validate(idParamSchema, 'params'), CartController.getCartByUserId);
// POST /api/carts
router.post('/', validate(cartSchema, 'body'), CartController.create);
// DELETE /api/carts/:id
router.delete('/:id', validate(idParamSchema, 'params'), CartController.delete);

export default router;
