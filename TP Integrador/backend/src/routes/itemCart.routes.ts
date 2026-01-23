import { Router } from 'express';
import itemCartController from '../controllers/itemCart.controller';
import { validate } from '../middlewares/validate.middleware'; // middleware general con zod
import { idParamSchema } from '../schemas/common.schema';
import { itemCartSchema } from '../schemas/itemCart.schema'; // esquema zod para crear review

const router = Router();

// GET /api/itemCarts
router.get('/', itemCartController.getAll);
// GET /api/itemCarts/:id
router.get('/:id', validate(idParamSchema, 'params'), itemCartController.getByItemId);
// GET /api/itemCarts/cart/:cartId
router.get('/cart/:cartId', itemCartController.getByCartId);
// GET /api/itemCarts/product/:productId
router.get('/product/:productId', itemCartController.getByProductId);
// POST /api/itemCarts
router.post('/', validate(itemCartSchema, 'body'), itemCartController.create);
// DELETE /api/itemCarts/:id
router.delete('/:id', validate(idParamSchema, 'params'), itemCartController.delete);

export default router;
