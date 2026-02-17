import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipeEntity } from './entities/recipe.entity';
import { RecipeLikeEntity } from './entities/recipe-like.entity';
import { CommentEntity } from './entities/comment.entity';
import { UserRecipeEntity } from './entities/user-recipe.entity';
import { Like, DataSource } from 'typeorm';
import { UserRecipeRole } from './domain/user-recipe.model';

describe('RecipesService', () => {
  let service: RecipesService;
  let repo: any;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      findOneBy: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    };

    const mockUserRecipeRepo = {
      ...mockRepo,
      findOneBy: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const mockDataSource = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: { ...mockRepo }, // Clone to ensure independence
        },
        {
          provide: getRepositoryToken(RecipeLikeEntity),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockRepo,
        },
        {
          provide: getRepositoryToken(UserRecipeEntity),
          useValue: mockUserRecipeRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    repo = module.get(getRepositoryToken(RecipeEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  describe('search', () => {
    it('should search by name only', async () => {
      const qb = repo.createQueryBuilder();
      await service.search('Chicken');
      expect(qb.andWhere).toHaveBeenCalledWith('recipe.name LIKE :name', { name: '%Chicken%' });
    });

    it('should search by category only', async () => {
      const qb = repo.createQueryBuilder();
      await service.search(undefined, 'Soup');
      expect(qb.andWhere).toHaveBeenCalledWith('recipe.category = :category', { category: 'Soup' });
    });

    it('should search by name and category', async () => {
      const qb = repo.createQueryBuilder();
      await service.search('Chicken', 'Soup');
      expect(qb.andWhere).toHaveBeenCalledWith('recipe.name LIKE :name', { name: '%Chicken%' });
      expect(qb.andWhere).toHaveBeenCalledWith('recipe.category = :category', { category: 'Soup' });
    });

    it('should return all recipes if parameters are empty', async () => {
      const qb = repo.createQueryBuilder();
      await service.search('', '');
      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('should return all recipes if parameters are undefined', async () => {
      const qb = repo.createQueryBuilder();
      await service.search(undefined, undefined);
      expect(qb.andWhere).not.toHaveBeenCalled();
    });
  });

  describe('saveRecipe', () => {
    it('should save a recipe', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue({ id: 1 }); // recipe exists
      repo.findOne = jest.fn().mockResolvedValue({ id: 1, userRecipes: [], ingredients: [] }); // for this.findOne
      const userRecipeRepo = (service as any).userRecipeRepo;
      userRecipeRepo.findOneBy = jest.fn().mockResolvedValue(null); // not yet saved
      userRecipeRepo.save = jest.fn();

      await service.saveRecipe(1, 1, 'Dinner');

      expect(userRecipeRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        userId: 1,
        recipeId: 1,
        role: UserRecipeRole.SAVED,
        collection: 'Dinner'
      }));
    });

    it('should not save if already saved', async () => {
      repo.findOneBy = jest.fn().mockResolvedValue({ id: 1 });
      repo.findOne = jest.fn().mockResolvedValue({ id: 1, userRecipes: [{ userId: 1, role: UserRecipeRole.SAVED }], ingredients: [] }); // for this.findOne
      const userRecipeRepo = (service as any).userRecipeRepo;
      userRecipeRepo.findOneBy = jest.fn().mockResolvedValue({ id: 1 }); // already saved

      await service.saveRecipe(1, 1);

      expect(userRecipeRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('unsaveRecipe', () => {
    it('should unsave a recipe', async () => {
      repo.findOne = jest.fn().mockResolvedValue({ id: 1, userRecipes: [], ingredients: [] }); // for this.findOne
      const userRecipeRepo = (service as any).userRecipeRepo;
      userRecipeRepo.delete = jest.fn();

      await service.unsaveRecipe(1, 1, 'Dinner');

      expect(userRecipeRepo.delete).toHaveBeenCalledWith({
        userId: 1,
        recipeId: 1,
        role: UserRecipeRole.SAVED,
        collection: 'Dinner'
      });
    });
  });
});
