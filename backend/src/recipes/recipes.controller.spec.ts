import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dtos/recipe.dto';
import { Recipe } from './domain/recipe.model';
import { UserRecipeRole } from './domain/user-recipe.model';
import { AuthGuard } from '../auth/auth.guard';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  const mockRecipe = new Recipe(
    1,
    'Test Recipe',
    'Description',
    'Category',
    'Instructions',
    'photo.jpg',
    null,
    null,
    0,
    0,
    null,
    new Date(),
    new Date(),
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockRecipe),
            findAll: jest.fn().mockResolvedValue([mockRecipe]),
            findOne: jest.fn().mockResolvedValue(mockRecipe),
            search: jest.fn().mockResolvedValue([mockRecipe]),
            findByUserAndRole: jest.fn().mockResolvedValue([mockRecipe]),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with the correct DTO', async () => {
      const dto = new CreateRecipeDto();
      dto.name = 'Test Recipe';
      dto.instructions = 'Instructions';

      const mockRequest = { user: { sub: 1 } };
      const result = await controller.create(dto, mockRequest);

      expect(result).toBe(mockRecipe);
      expect(service.create).toHaveBeenCalledWith(dto, mockRequest.user.sub);
    });
  });

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockRecipe]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single recipe', async () => {
      const result = await controller.findOne(1);
      expect(result).toBe(mockRecipe);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('search', () => {
    it('should call service.search with name and category', async () => {
      const name = 'Test';
      const category = 'Category';

      // Controller signature is search(category, name)
      const result = await controller.search(category, name);

      expect(result).toEqual([mockRecipe]);
      // Service signature is search(name, category)
      expect(service.search).toHaveBeenCalledWith(name, category);
    });

    it('should call service.search with only name', async () => {
      const name = 'Test';

      // Controller signature is search(category, name)
      await controller.search(undefined, name);

      expect(service.search).toHaveBeenCalledWith(name, undefined);
    });
  });

  describe('findByUser', () => {
    it('should call service.findByUserAndRole', async () => {
      const userId = 1;
      const role = UserRecipeRole.CREATOR;

      const result = await controller.findByUser(userId, role);

      expect(result).toEqual([mockRecipe]);
      expect(service.findByUserAndRole).toHaveBeenCalledWith(userId, role);
    });
  });
});
