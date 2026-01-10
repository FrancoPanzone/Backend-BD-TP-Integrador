// src/repositories/review.repository.ts
import { Review } from '../models/entity/review.model';
import { ReviewInput } from '../dtos/review.dto';
import { Transaction } from 'sequelize';

export class ReviewRepository {
  // Obtener todas las reviews
  async getAll(transaction: Transaction | null = null) {
    return Review.findAll({ transaction });
  }

  // Obtener review por ID
  async getById(id: number, transaction: Transaction | null = null) {
    return Review.findByPk(id, { transaction });
  }

  // Obtener todas las reviews de un producto específico
  async getByProductId(productId: number, transaction: Transaction | null = null) {
    return Review.findAll({
      where: { product_id: productId },
      transaction,
    });
  }

  // Crear una nueva review
  async create(data: ReviewInput, transaction: Transaction | null = null) {
    return Review.create(data, { transaction });
  }

  // Actualizar review
  async update(id: number, data: Partial<ReviewInput>, transaction: Transaction | null = null) {
    const review = await Review.findByPk(id, { transaction });
    if (!review) return null;
    return review.update(data, { transaction });
  }

  // Eliminar review por ID
  async delete(id: number, transaction: Transaction | null = null) {
    const review = await Review.findByPk(id, { transaction });
    if (!review) return false;
    await review.destroy({ transaction });
    return true;
  }
}

export default new ReviewRepository();
