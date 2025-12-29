// src/routes/review.routes.ts

import { Router } from 'express';
import ReviewController from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware'; // middleware general con zod
import { idParamSchema, userIdParamSchema, paginationQuerySchema } from '../schemas/common.schema';
import { reviewSchema } from '../schemas/review.schema'; // esquema zod para crear review

const router = Router();

// GET /api/reviews
router.get('/', ReviewController.getAll);
// GET /api/reviews/:id
router.get('/:id', validate(idParamSchema, 'params'), ReviewController.getById);
// GET /api/reviews/product/:productId
router.get('/product/:productId', ReviewController.getByProductId);
// POST /api/reviews
router.post('/', validate(reviewSchema, 'body'), ReviewController.create);
// TODO: Abria que poner un PATCH? No creo que sea necesario
// DELETE /api/reviews/:id
router.delete('/:id', validate(idParamSchema, 'params'), ReviewController.delete);

export default router;
