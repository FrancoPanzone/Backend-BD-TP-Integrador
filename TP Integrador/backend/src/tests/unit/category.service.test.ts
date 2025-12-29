// import { Category } from '../../models/entity/category.entity';
// import { CategoryInput } from '../../dtos/category.dto';
// import categoryService from '../../services/category.service';

// describe('Category Service - Unit Tests', () => {
//   let createdCategory: Category;

//   const sampleCategory: CategoryInput = {
//     name: 'Proteina',
//     description: 'Todos los productos de suplementación proteica',
//   };

//   beforeAll(async () => {
//     createdCategory = await categoryService.create(sampleCategory);
//   });

//   // para que me de info en consola
//   it('should create a new category', async () => {
//     expect(createdCategory).toHaveProperty('category_id');
//     expect(createdCategory.getName()).toBe(sampleCategory.name);
//   });

//   it('should return all categories', async () => {
//     const all = await categoryService.getAll();
//     expect(all.length).toBeGreaterThan(0);
//   });

//   it('should delete a category', async () => {
//     const id = createdCategory.getCategoryId();

//     await categoryService.delete(id);
//     const all = await categoryService.getAll();

//     const found = all.find((o) => o.getCategoryId() === id);
//     expect(found).toBeUndefined();
//   });
// });

// TODO: EN UNIT SERAN UNITARIOS ASI QUE NO USARAN POSTGRESQL, SEQUELIZE O DOCKER; SERA TODO MOCKEADO

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

    expect(CategoryRepository.create).toHaveBeenCalledWith({
      name: 'Proteina',
      description: 'Todos los productos de suplementación proteica',
    });
    expect(result).toBe(fakeCategory);
  });

  it('should return all categories', async () => {
    (CategoryRepository.getAll as jest.Mock).mockResolvedValue([]);

    const result = await categoryService.getAll();

    expect(CategoryRepository.getAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should throw error if category does not exist', async () => {
    (CategoryRepository.getById as jest.Mock).mockResolvedValue(null);

    await expect(categoryService.getById(999)).rejects.toThrow(
      'La categoría con id 999 no existe',
    );
  });

  it('should delete a category', async () => {
    (CategoryRepository.delete as jest.Mock).mockResolvedValue(true);

    await categoryService.delete(1);

    expect(CategoryRepository.delete).toHaveBeenCalledWith(1);
  });
});
