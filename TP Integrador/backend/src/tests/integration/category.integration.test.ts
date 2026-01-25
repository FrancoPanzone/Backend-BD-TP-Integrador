import CategoryService from '../../services/category.service';
import { sequelize } from '../../models/entity';
import { Transaction } from 'sequelize';
import { CategoryInput } from '../../dtos/category.dto';

describe('CategoryService - Integration Tests', () => {
  let transaction: Transaction;
  let testCategory: CategoryInput;

  beforeEach(async () => {
    transaction = await sequelize.transaction();
    testCategory = {
      name: 'Integration Category',
      description: 'Descripción de prueba',
    };
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  it('should create and retrieve a category', async () => {
    const category = await CategoryService.create(testCategory, transaction);
    expect(category).toBeDefined();
    expect(category.name).toBe(testCategory.name);

    const found = await CategoryService.getById(category.category_id, transaction);
    expect(found).toBeDefined();
    expect(found.name).toBe(testCategory.name);
  });

  it('should update a category', async () => {
    const category = await CategoryService.create(testCategory, transaction);

    const updatedData = { name: 'Updated Category' };
    const updated = await CategoryService.update(category.category_id, updatedData, transaction);

    expect(updated).toBeDefined();
    expect(updated.name).toBe('Updated Category');

    const fresh = await CategoryService.getById(category.category_id, transaction);
    expect(fresh.name).toBe('Updated Category');
  });

  it('should delete a category', async () => {
    const category = await CategoryService.create(testCategory, transaction);

    await CategoryService.delete(category.category_id, transaction);

    const found = await CategoryService.getById(category.category_id, transaction).catch(
      () => null,
    );
    expect(found).toBeNull();
  });
});
