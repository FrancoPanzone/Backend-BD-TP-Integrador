// src/tests/integration/review.integration.test.ts
// import ReviewService from '../../services/review.service';
// import ProductService from '../../services/product.service';
// import CategoryService from '../../services/category.service';
// import UserService from '../../services/user.service';
// import { sequelize } from '../../models/entity';
// import { Transaction } from 'sequelize';

// describe('Review Integration Tests with Transactions', () => {
//     let transaction: Transaction;
//     let testCategoryId: number;
//     let testProductId: number;
//     let testUserId: number;

//     beforeEach(async () => {
//         transaction = await sequelize.transaction();

//         const user = await UserService.create(
//             {
//                 name: 'User Review Test',
//                 email: `review${Date.now()}@test.com`,
//                 password: '123456',
//                 address: 'Calle Test 123',
//             },
//             transaction
//         );
//         testUserId = user.user_id!;

//         const category = await CategoryService.create(
//             {
//                 name: 'Categoría Review Test',
//                 description: 'Categoría para reviews',
//             },
//             transaction
//         );
//         testCategoryId = category.category_id!;

//         const product = await ProductService.create(
//             {
//                 name: 'Producto Review Test',
//                 description: 'Producto con reviews',
//                 price: 1000,
//                 stock: 20,
//                 category_id: testCategoryId,
//                 rating: 0,
//                 brand: 'BrandTest',
//             },
//             transaction
//         );

//         testProductId = product.product_id!;
//     });

//     afterEach(async () => {
//         await transaction.rollback();
//     });

//     it('should create a review and update product rating', async () => {
//         const review = await ReviewService.create(
//             {
//                 user_id: testUserId,
//                 product_id: testProductId,
//                 qualification: 5,
//                 comment: 'Excelente producto',
//             },
//             transaction
//         );

//         expect(review).toBeDefined();

//         const product = await ProductService.getById(
//             testProductId,
//             transaction
//         );

//         expect(product).not.toBeNull();
//         expect(product!.rating).toBe(5);
//     });

//     it('should recalculate rating after multiple reviews', async () => {
//         await ReviewService.create(
//             {
//                 user_id: testUserId,
//                 product_id: testProductId,
//                 qualification: 5,
//                 comment: 'Excelente',
//             },
//             transaction
//         );

//         await ReviewService.create(
//             {
//                 user_id: testUserId,
//                 product_id: testProductId,
//                 qualification: 3,
//                 comment: 'Regular',
//             },
//             transaction
//         );

//         const product = await ProductService.getById(
//             testProductId,
//             transaction
//         );

//         expect(product).not.toBeNull();
//         expect(product!.rating).toBe(4);
//     });

//     it('should get reviews by product id', async () => {
//         await ReviewService.create(
//             {
//                 user_id: testUserId,
//                 product_id: testProductId,
//                 qualification: 4,
//                 comment: 'Muy bueno',
//             },
//             transaction
//         );

//         const reviews = await ReviewService.getByProductId(
//             testProductId,
//             transaction
//         );

//         expect(reviews).toHaveLength(1);
//         expect(reviews[0]).toBeDefined();
//         expect(reviews[0]!.comment).toBe('Muy bueno');
//     });

//     it('should delete a review and update product rating', async () => {
//         const r1 = await ReviewService.create(
//             {
//                 user_id: testUserId,
//                 product_id: testProductId,
//                 qualification: 5,
//                 comment: 'Excelente',
//             },
//             transaction
//         );

//         const r2 = await ReviewService.create(
//             {
//                 user_id: testUserId,
//                 product_id: testProductId,
//                 qualification: 1,
//                 comment: 'Malo',
//             },
//             transaction
//         );

//         await ReviewService.delete(r2.review_id!, transaction);

//         const product = await ProductService.getById(
//             testProductId,
//             transaction
//         );

//         expect(product).not.toBeNull();
//         expect(product!.rating).toBe(5);
//     });
// });

// src/tests/integration/review.integration.test.ts
import ReviewService from '../../services/review.service';
import ProductService from '../../services/product.service';
import CategoryService from '../../services/category.service';
import UserService from '../../services/user.service';
import { sequelize } from '../../models/entity';
import { Transaction } from 'sequelize';

describe('Review Integration Tests with Transactions', () => {
  let transaction: Transaction;
  let testCategoryId: number;
  let testProductId: number;
  let testUserId: number;

  beforeEach(async () => {
    transaction = await sequelize.transaction();

    const user = await UserService.create(
      {
        name: 'User Review Test',
        email: `review${Date.now()}@test.com`,
        password: '123456',
        address: 'Calle Test 123',
      },
      transaction
    );
    testUserId = user.user_id!;

    const category = await CategoryService.create(
      {
        name: 'Categoría Review Test',
        description: 'Categoría para reviews',
      },
      transaction
    );
    testCategoryId = category.category_id!;

    const product = await ProductService.create(
      {
        name: 'Producto Review Test',
        description: 'Producto con reviews',
        price: 1000,
        stock: 20,
        category_id: testCategoryId,
        rating: 0,
        brand: 'BrandTest',
      },
      transaction
    );

    testProductId = product.product_id!;
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('should create a review and update product rating', async () => {
    const review = await ReviewService.create(
      {
        user_id: testUserId,
        product_id: testProductId,
        qualification: 5,
        comment: 'Excelente producto',
      },
      transaction
    );

    expect(review).toBeDefined();

    const product = await ProductService.getById(
      testProductId,
      transaction
    );

    expect(product).not.toBeNull();
    expect(Number(product!.rating)).toBe(5);
  });

  it('should recalculate rating after multiple reviews', async () => {
    await ReviewService.create(
      {
        user_id: testUserId,
        product_id: testProductId,
        qualification: 5,
        comment: 'Excelente',
      },
      transaction
    );

    await ReviewService.create(
      {
        user_id: testUserId,
        product_id: testProductId,
        qualification: 3,
        comment: 'Regular',
      },
      transaction
    );

    const product = await ProductService.getById(
      testProductId,
      transaction
    );

    expect(product).not.toBeNull();
    expect(Number(product!.rating)).toBe(4);
  });

  it('should get reviews by product id', async () => {
    await ReviewService.create(
      {
        user_id: testUserId,
        product_id: testProductId,
        qualification: 4,
        comment: 'Muy bueno',
      },
      transaction
    );

    const reviews = await ReviewService.getByProductId(
      testProductId,
      transaction
    );

    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toBeDefined();
    expect(reviews[0]!.comment).toBe('Muy bueno');
  });

  it('should delete a review and update product rating', async () => {
    await ReviewService.create(
      {
        user_id: testUserId,
        product_id: testProductId,
        qualification: 5,
        comment: 'Excelente',
      },
      transaction
    );

    const r2 = await ReviewService.create(
      {
        user_id: testUserId,
        product_id: testProductId,
        qualification: 1,
        comment: 'Malo',
      },
      transaction
    );

    await ReviewService.delete(r2.review_id!, transaction);

    const product = await ProductService.getById(
      testProductId,
      transaction
    );

    expect(product).not.toBeNull();
    expect(Number(product!.rating)).toBe(5);
  });
});
