import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware'; // middleware general con zod
import { idParamSchema } from '../schemas/common.schema';
import CategoryController from '../controllers/category.controller';
import { CategorySchema, CategoryUpdateSchema } from '../schemas/category.schema';

const router = Router();

// GET /api/categories
router.get('/', CategoryController.getAll);
// GET /api/categories/:id
router.get('/:id', validate(idParamSchema, 'params'), CategoryController.getById);
// POST /api/categories/
router.post('/', validate(CategorySchema, 'body'), CategoryController.create);
// DELETE /api/categories/:id
router.delete('/:id', validate(idParamSchema, 'params'), CategoryController.delete);
// PUT /api/categories/:id
router.put(
  '/:id',
  validate(idParamSchema, 'params'), // valida que :id sea número
  validate(CategoryUpdateSchema, 'body'), // valida body opcional
  CategoryController.update,
);
export default router;
