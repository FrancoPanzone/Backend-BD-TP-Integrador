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
    (ProductRepository.update as jest.Mock).mockResolvedValue({
      ...sampleProduct,
      rating: 5,
    });

    const review = await ReviewService.create(sampleReviewInput);

    expect(ProductRepository.getById).toHaveBeenCalledWith(
      sampleReviewInput.product_id,
      null
    );

    expect(ReviewRepository.create).toHaveBeenCalledWith(
      sampleReviewInput,
      null
    );

    expect(ProductRepository.update).toHaveBeenCalledWith(
      sampleReviewInput.product_id,
      expect.objectContaining({ rating: 5 }),
      null
    );

    expect(review).toBe(sampleReview);
  });

  it('should throw error if product does not exist', async () => {
    (ProductRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(
      ReviewService.create(sampleReviewInput)
    ).rejects.toThrow(
      `El producto con id ${sampleReviewInput.product_id} no existe`
    );
  });

  // GET ALL
  it('should return all reviews', async () => {
    (ReviewRepository.getAll as jest.Mock).mockResolvedValue([sampleReview]);

    const reviews = await ReviewService.getAll();

    expect(ReviewRepository.getAll).toHaveBeenCalledWith(null);
    expect(reviews).toEqual([sampleReview]);
  });

  // GET BY PRODUCT ID
  it('should return reviews by product id', async () => {
    (ProductRepository.getById as jest.Mock).mockResolvedValue(sampleProduct);
    (ReviewRepository.getByProductId as jest.Mock).mockResolvedValue([sampleReview]);

    const reviews = await ReviewService.getByProductId(sampleProduct.product_id);

    expect(ProductRepository.getById).toHaveBeenCalledWith(
      sampleProduct.product_id,
      null
    );

    expect(ReviewRepository.getByProductId).toHaveBeenCalledWith(
      sampleProduct.product_id,
      null
    );

    expect(reviews).toEqual([sampleReview]);
  });

  it('should throw error if product id does not exist', async () => {
    (ProductRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(
      ReviewService.getByProductId(999)
    ).rejects.toThrow('El producto con id 999 no existe');
  });

  // DELETE
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

    expect(ReviewRepository.getById).toHaveBeenCalledWith(
      sampleReview.review_id,
      null
    );

    expect(ReviewRepository.delete).toHaveBeenCalledWith(
      sampleReview.review_id,
      null
    );

    expect(ProductRepository.update).toHaveBeenCalledWith(
      sampleReview.product_id,
      expect.objectContaining({ rating: 0 }),
      null
    );

    expect(result).toBe(true);
  });

  it('should return false when deleting a non-existing review', async () => {
    (ReviewRepository.getById as jest.Mock).mockResolvedValue(null);

    const result = await ReviewService.delete(999);

    expect(result).toBe(false);
  });
});
