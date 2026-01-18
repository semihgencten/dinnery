import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecipesService } from './recipes.service';
import { RecipeEntity } from './entities/recipe.entity';
import { Like } from 'typeorm';

describe('RecipesService', () => {
  let service: RecipesService;
  let repo: any;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(RecipeEntity),
          useValue: mockRepo,
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
      await service.search('Chicken');
      expect(repo.find).toHaveBeenCalledWith({
        where: {
          name: Like('%Chicken%'),
        },
      });
    });

    it('should search by category only', async () => {
      await service.search(undefined, 'Soup');
      expect(repo.find).toHaveBeenCalledWith({
        where: {
          category: 'Soup',
        },
      });
    });

    it('should search by name and category', async () => {
      await service.search('Chicken', 'Soup');
      expect(repo.find).toHaveBeenCalledWith({
        where: {
          name: Like('%Chicken%'),
          category: 'Soup',
        },
      });
    });

    it('should return all recipes if parameters are empty', async () => {
      await service.search('', '');
      // If name is empty string, if(name) is false.
      // If category is empty string, if(category) is false.
      // So where is {}.
      expect(repo.find).toHaveBeenCalledWith({
        where: {},
      });
    });

    it('should return all recipes if parameters are undefined', async () => {
      await service.search(undefined, undefined);
      expect(repo.find).toHaveBeenCalledWith({
        where: {},
      });
    });
  });
});
