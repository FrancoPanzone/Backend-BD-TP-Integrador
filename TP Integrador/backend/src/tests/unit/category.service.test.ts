// src/tests/unit/category.service.test.ts
import categoryService from '../../services/category.service';
import CategoryRepository from '../../repositories/category.repository';
import { Category } from '../../models/entity/category.model';

jest.mock('../../repositories/category.repository');

describe('CategoryService (Unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new category', async () => {
    const fakeCategory = {
      category_id: 1,
      name: 'Proteina',
      description: 'Todos los productos de suplementación proteica',
    } as Category;

    (CategoryRepository.create as jest.Mock).mockResolvedValue(fakeCategory);

    const result = await categoryService.create({
      name: 'Proteina',
      description: 'Todos los productos de suplementación proteica',
    });

    expect(CategoryRepository.create).toHaveBeenCalledWith(
      {
        name: 'Proteina',
        description: 'Todos los productos de suplementación proteica',
      },
      undefined // transaction opcional
    );
    expect(result).toBe(fakeCategory);
  });

  it('should return all categories', async () => {
    (CategoryRepository.getAll as jest.Mock).mockResolvedValue([]);

    const result = await categoryService.getAll();

    expect(CategoryRepository.getAll).toHaveBeenCalledWith(undefined); // transaction opcional
    expect(result).toEqual([]);
  });

  it('should throw error if category does not exist', async () => {
    (CategoryRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(categoryService.getById(999)).rejects.toThrow(
      'La categoría con id 999 no existe'
    );
    expect(CategoryRepository.getById).toHaveBeenCalledWith(999, undefined);
  });

  it('should update a category', async () => {
    const updatedCategory = {
      category_id: 1,
      name: 'Proteina Whey',
      description: 'Proteína de suero',
    } as Category;

    (CategoryRepository.update as jest.Mock).mockResolvedValue(updatedCategory);

    const result = await categoryService.update(1, {
      name: 'Proteina Whey',
      description: 'Proteína de suero',
    });

    expect(CategoryRepository.update).toHaveBeenCalledWith(
      1,
      {
        name: 'Proteina Whey',
        description: 'Proteína de suero',
      },
      undefined // transaction opcional
    );
    expect(result).toBe(updatedCategory);
  });

  it('should delete a category', async () => {
    (CategoryRepository.delete as jest.Mock).mockResolvedValue(true);

    await categoryService.delete(1);

    expect(CategoryRepository.delete).toHaveBeenCalledWith(1, undefined);
  });
});
