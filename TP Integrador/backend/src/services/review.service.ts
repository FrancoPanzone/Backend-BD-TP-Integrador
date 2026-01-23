// src/services/review.service.ts
import { Transaction } from 'sequelize';

import ReviewRepository from '../repositories/review.repository';
import ProductRepository from '../repositories/product.repository';
import { ReviewInput } from '../dtos/review.dto';
import { Review } from '../models/entity/review.model';
import { Product } from '../models/entity/product.model';

class ReviewService {
  async getAll(transaction?: Transaction): Promise<Review[]> {
    return ReviewRepository.getAll(transaction ?? null);
  }

  async getById(
    id: number,
    transaction?: Transaction
  ): Promise<Review | null> {
    return ReviewRepository.getById(id, transaction ?? null);
  }

  async getByProductId(
    productId: number,
    transaction?: Transaction
  ): Promise<Review[]> {
    const product: Product | null =
      await ProductRepository.getById(productId, transaction ?? null);

    if (!product) {
      throw new Error(`El producto con id ${productId} no existe`);
    }

    return ReviewRepository.getByProductId(productId, transaction ?? null);
  }

  async create(
    data: ReviewInput,
    transaction?: Transaction
  ): Promise<Review> {
    const product: Product | null =
      await ProductRepository.getById(data.product_id, transaction ?? null);

    if (!product) {
      throw new Error(`El producto con id ${data.product_id} no existe`);
    }

    const review = await ReviewRepository.create(data, transaction ?? null);

    await this.updateProductRating(data.product_id, transaction);

    return review;
  }

  async delete(
    id: number,
    transaction?: Transaction
  ): Promise<boolean> {
    const review =
      await ReviewRepository.getById(id, transaction ?? null);

    if (!review) return false;

    const success =
      await ReviewRepository.delete(id, transaction ?? null);

    if (success) {
      await this.updateProductRating(review.product_id, transaction);
    }

    return success;
  }

  // Método privado para recalcular rating del producto
  private async updateProductRating(
    productId: number,
    transaction?: Transaction
  ) {
    const product: Product | null =
      await ProductRepository.getById(productId, transaction ?? null);

    if (!product) return;

    const reviews =
      await ReviewRepository.getByProductId(productId, transaction ?? null);

    const total = reviews.reduce(
      (sum, r) => sum + Number(r.qualification),
      0
    );

    const avg = reviews.length === 0 ? 0 : total / reviews.length;

    await ProductRepository.update(
      productId,
      { rating: Number(avg.toFixed(1)) },
      transaction ?? null
    );
  }
}

export default new ReviewService();
