// // src/services/review.service.ts

// import MockReview from '../models/implementations/mock/mockReview';
// import MockProduct from '../models/implementations/mock/mockProduct';
// import { Review } from '../models/entity/review.entity';
// import { ReviewInput } from '../dtos/review.dto';

// class ReviewService {
//   async getAll(): Promise<Review[]> {
//     return MockReview.getAll();
//   }

//   async getById(id: number): Promise<Review | undefined> {
//     return MockReview.getById(id);
//   }

//   async getByProductId(productId: number): Promise<Review[]> {
//     // Verificar que el producto exista
//     const product = await MockProduct.getById(productId);
//     if (!product) {
//       throw new Error(`El producto con id ${productId} no existe`);
//     }

//     return MockReview.getByProductId(productId);
//   }

//   async create(data: ReviewInput): Promise<Review> {
//     // Verificar que el producto exista
//     const product = await MockProduct.getById(data.product_id);
//     if (!product) {
//       throw new Error(`El producto con id ${data.product_id} no existe`);
//     }

//     const newReview = await MockReview.create(data);

//     // Recalcular rating del producto
//     await this.updateProductRating(data.product_id);

//     return newReview;
//   }

//   async delete(id: number): Promise<boolean> {
//     const review = await MockReview.getById(id);
//     if (!review) return false;

//     const success = await MockReview.delete(id);

//     if (success) {
//       await this.updateProductRating(review.product_id);
//     }

//     return success;
//   }

//   // Método privado para recalcular rating
//   private async updateProductRating(productId: number) {
//     const product = await MockProduct.getById(productId);
//     if (!product) return;

//     const reviews = await MockReview.getByProductId(productId);

//     let totalScore = reviews.reduce((sum, r) => sum + r.qualification, 0);
//     let totalCount = reviews.length;

//     // Solo considerar rating inicial si ya existe
//     if (product.rating && product.rating > 0) {
//       totalScore += product.rating;
//       totalCount += 1;
//     }

//     const avg = totalCount === 0 ? 0 : totalScore / totalCount;
//     product.rating = parseFloat(avg.toFixed(1));
//   }
// }

// export default new ReviewService();

// src/services/review.service.ts
// import ReviewRepository from '../repositories/review.repository';
// import ProductRepository from '../repositories/product.repository';
// import { ReviewInput } from '../dtos/review.dto';
// import { Review } from '../models/entity/review.model';
// import { Product } from '../models/entity/product.model';

// class ReviewService {
//   // Obtener todas las reviews
//   async getAll(): Promise<Review[]> {
//     return await ReviewRepository.getAll();
//   }

//   // Obtener review por ID
//   async getById(id: number): Promise<Review | null> {
//     return await ReviewRepository.getById(id);
//   }

//   // Obtener todas las reviews de un producto específico
//   async getByProductId(productId: number): Promise<Review[]> {
//     const product: Product | null = await ProductRepository.getById(productId);
//     if (!product) {
//       throw new Error(`El producto con id ${productId} no existe`);
//     }

//     return await ReviewRepository.getByProductId(productId);
//   }

//   // Crear una nueva review
//   async create(data: ReviewInput): Promise<Review> {
//     const product: Product | null = await ProductRepository.getById(data.product_id);
//     if (!product) {
//       throw new Error(`El producto con id ${data.product_id} no existe`);
//     }

//     const newReview: Review = await ReviewRepository.create(data);

//     // Recalcular rating del producto
//     await this.updateProductRating(data.product_id);

//     return newReview;
//   }

//   // Eliminar review por ID
//   async delete(id: number): Promise<boolean> {
//     const review: Review | null = await ReviewRepository.getById(id);
//     if (!review) return false;

//     const success = await ReviewRepository.delete(id);

//     if (success) {
//       await this.updateProductRating(review.product_id);
//     }

//     return success;
//   }

//   // Método privado para recalcular rating del producto
//   private async updateProductRating(productId: number) {
//     const product: Product | null = await ProductRepository.getById(productId);
//     if (!product) return;

//     const reviews: Review[] = await ReviewRepository.getByProductId(productId);

//     const totalScore = reviews.reduce((sum, r) => sum + parseFloat(r.qualification.toString()), 0);
//     const avgRating = reviews.length === 0 ? 0 : totalScore / reviews.length;

//     // Actualizar rating del producto
//     await ProductRepository.update(productId, { rating: parseFloat(avgRating.toFixed(1)) });
//   }
// }

// export default new ReviewService();

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
