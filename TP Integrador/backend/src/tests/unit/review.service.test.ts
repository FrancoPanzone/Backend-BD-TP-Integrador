// // src/services/review.service.spec.ts
// import reviewService from '../../services/review.service';
// import MockProduct from '../../models/implementations/mock/mockProduct';
// import MockReview from '../../models/implementations/mock/mockReview';
// import { Review } from '../../models/entity/review.entity';

// jest.mock('../../models/implementations/mock/mockProduct');
// jest.mock('../../models/implementations/mock/mockReview');

// describe('Review Service - Unit Tests', () => {
//   let createdReview: Review;

//   const sampleReview = new Review(
//     1, // review_id
//     1, // user_id
//     2, // product_id
//     5, // qualification
//     'Excelente producto',
//     new Date(), // date
//   );

//   beforeAll(async () => {
//     // Mockear que el producto existe
//     (MockProduct.getById as jest.Mock).mockResolvedValue({ product_id: 2, rating: 0 });

//     // Mockear create de review
//     (MockReview.create as jest.Mock).mockImplementation(async (review) => review);

//     // Mockear getAll
//     (MockReview.getAll as jest.Mock).mockResolvedValue([sampleReview]);

//     // Mockear getByProductId
//     (MockReview.getByProductId as jest.Mock).mockResolvedValue([sampleReview]);

//     // Mockear getById
//     (MockReview.getById as jest.Mock).mockResolvedValue(sampleReview);

//     // Mockear delete
//     (MockReview.delete as jest.Mock).mockResolvedValue(true);

//     createdReview = await reviewService.create(sampleReview);
//   });

//   it('deberia crear una nueva review', async () => {
//     expect(createdReview).toHaveProperty('review_id');
//     expect(createdReview.comment).toBe(sampleReview.comment);
//   });

//   it('deberia devolver todas las reviews', async () => {
//     const all = await reviewService.getAll();
//     expect(all.length).toBeGreaterThan(0);
//     expect(all[0]).toEqual(sampleReview);
//   });

//   it('deberia devolver reviews por product_id existente', async () => {
//     const reviews = await reviewService.getByProductId(sampleReview.product_id);
//     expect(reviews.length).toBeGreaterThan(0);
//     expect(reviews[0]!.product_id).toBe(sampleReview.product_id);
//   });

//   it('deberia lanzar error si getByProductId usa un product_id que no existe', async () => {
//     // Simular producto inexistente
//     (MockProduct.getById as jest.Mock).mockResolvedValueOnce(undefined);

//     await expect(reviewService.getByProductId(999)).rejects.toThrow(
//       'El producto con id 999 no existe',
//     );
//   });

//   it('deberia eliminar una review', async () => {
//     const deleted = await reviewService.delete(createdReview.review_id);
//     expect(deleted).toBe(true);

//     // Mockear delete fallido
//     (MockReview.getById as jest.Mock).mockResolvedValueOnce(undefined);
//     const deletedAgain = await reviewService.delete(createdReview.review_id);
//     expect(deletedAgain).toBe(false);
//   });
// });

// tests/unit/review.service.test.ts
import ReviewService from '../../services/review.service';
import ReviewRepository from '../../repositories/review.repository';
import ProductRepository from '../../repositories/product.repository';
import { ReviewInput } from '../../dtos/review.dto';
import { Review } from '../../models/entity/review.model';
import { Product } from '../../models/entity/product.model';

jest.mock('../../repositories/review.repository');
jest.mock('../../repositories/product.repository');

describe('ReviewService - Unit Tests', () => {
  const sampleReviewInput: ReviewInput = {
    user_id: 1,
    product_id: 2,
    qualification: 5,
    comment: 'Excelente producto',
    date: new Date(),
  };

  const sampleReview = {
    review_id: 1,
    ...sampleReviewInput,
  } as Review;

  const sampleProduct = {
    product_id: 2,
    name: 'Proteína Vegetal',
    price: 18000,
    rating: 4.2,
    stock: 15,
  } as Product;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CREATE
  it('should create a new review and update product rating', async () => {
    (ProductRepository.getById as jest.Mock).mockResolvedValue(sampleProduct);
    (ReviewRepository.create as jest.Mock).mockResolvedValue(sampleReview);
    (ReviewRepository.getByProductId as jest.Mock).mockResolvedValue([sampleReview]);
    (ProductRepository.update as jest.Mock).mockResolvedValue({ ...sampleProduct, rating: 5 });

    const review = await ReviewService.create(sampleReviewInput);

    expect(ProductRepository.getById).toHaveBeenCalledWith(sampleReviewInput.product_id);
    expect(ReviewRepository.create).toHaveBeenCalledWith(sampleReviewInput);
    expect(ProductRepository.update).toHaveBeenCalledWith(sampleReviewInput.product_id, expect.objectContaining({ rating: 5 }));
    expect(review).toBe(sampleReview);
  });

  it('should throw error if product does not exist', async () => {
    (ProductRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(ReviewService.create(sampleReviewInput)).rejects.toThrow(
      `El producto con id ${sampleReviewInput.product_id} no existe`,
    );
  });

  // GET ALL
  it('should return all reviews', async () => {
    (ReviewRepository.getAll as jest.Mock).mockResolvedValue([sampleReview]);

    const reviews = await ReviewService.getAll();

    expect(ReviewRepository.getAll).toHaveBeenCalled();
    expect(reviews).toEqual([sampleReview]);
  });

  // GET BY PRODUCT ID
  it('should return reviews by product id', async () => {
    (ProductRepository.getById as jest.Mock).mockResolvedValue(sampleProduct);
    (ReviewRepository.getByProductId as jest.Mock).mockResolvedValue([sampleReview]);

    const reviews = await ReviewService.getByProductId(sampleProduct.product_id);

    expect(ProductRepository.getById).toHaveBeenCalledWith(sampleProduct.product_id);
    expect(ReviewRepository.getByProductId).toHaveBeenCalledWith(sampleProduct.product_id);
    expect(reviews).toEqual([sampleReview]);
  });

  it('should throw error if product id does not exist', async () => {
    (ProductRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(ReviewService.getByProductId(999)).rejects.toThrow('El producto con id 999 no existe');
  });

  // DELETE
  // it('should delete a review and update product rating', async () => {
  //   (ReviewRepository.getById as jest.Mock).mockResolvedValue(sampleReview);
  //   (ReviewRepository.delete as jest.Mock).mockResolvedValue(true);
  //   (ReviewRepository.getByProductId as jest.Mock).mockResolvedValue([]);
  //   (ProductRepository.update as jest.Mock).mockResolvedValue({ ...sampleProduct, rating: 0 });

  //   const result = await ReviewService.delete(sampleReview.review_id);

  //   expect(ReviewRepository.getById).toHaveBeenCalledWith(sampleReview.review_id);
  //   expect(ReviewRepository.delete).toHaveBeenCalledWith(sampleReview.review_id);
  //   expect(ProductRepository.update).toHaveBeenCalledWith(sampleReview.product_id, expect.objectContaining({ rating: 0 }));
  //   expect(result).toBe(true);
  // });

  it('should delete a review and update product rating', async () => {
    (ReviewRepository.getById as jest.Mock).mockResolvedValue(sampleReview);
    (ReviewRepository.delete as jest.Mock).mockResolvedValue(true);
    (ReviewRepository.getByProductId as jest.Mock).mockResolvedValue([]);

    (ProductRepository.getById as jest.Mock).mockResolvedValue(sampleProduct);
    (ProductRepository.update as jest.Mock).mockResolvedValue({
      ...sampleProduct,
      rating: 0,
    });

    const result = await ReviewService.delete(sampleReview.review_id);

    expect(ReviewRepository.getById).toHaveBeenCalledWith(sampleReview.review_id);
    expect(ReviewRepository.delete).toHaveBeenCalledWith(sampleReview.review_id);
    expect(ProductRepository.update).toHaveBeenCalledWith(
      sampleReview.product_id,
      expect.objectContaining({ rating: 0 }),
    );
    expect(result).toBe(true);
  });

  it('should return false when deleting a non-existing review', async () => {
    (ReviewRepository.getById as jest.Mock).mockResolvedValue(null);

    const result = await ReviewService.delete(999);

    expect(result).toBe(false);
  });
});
