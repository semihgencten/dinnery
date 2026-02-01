import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity';
import { Recipe } from './domain/recipe.model';
import { RecipeMapper } from './mappers/recipe.mapper';
import { CreateRecipeDto } from './dtos/recipe.dto';
import { UserRecipeEntity } from './entities/user-recipe.entity';
import { UserRecipeRole } from './domain/user-recipe.model';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepo: Repository<RecipeEntity>,
  ) { }

  async findOne(id: number): Promise<Recipe> {
    const entity = await this.recipeRepo.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return RecipeMapper.toDomain(entity);
  }

  async create(createDto: CreateRecipeDto): Promise<Recipe> {
    const domainData = Recipe.create(
      createDto.name,
      createDto.description ?? '',
      createDto.category,
      createDto.instructions,
      createDto.photoUrl,
      createDto.originalRecipeId,
    );

    const existing = await this.recipeRepo.findOne({
      where: { name: domainData.name },
    });

    if (existing) {
      throw new ConflictException('Recipe already exists');
    }

    const entityData = RecipeMapper.toEntity(domainData);

    // Map ingredients if they exist
    if (createDto.ingredients?.length) {
      entityData.ingredients = createDto.ingredients.map(dto => {
        const ingredient = new RecipeIngredientEntity();
        ingredient.ingredientId = dto.ingredientId ?? null;
        ingredient.quantity = dto.quantity;
        ingredient.unit = dto.unit;
        ingredient.customIngredientText = dto.customIngredientText ?? null;
        ingredient.notes = dto.notes ?? null;
        return ingredient;
      });
    }

    if (createDto.userRecipes?.length) {
      entityData.userRecipes = createDto.userRecipes.map(dto => {
        const userRecipe = new UserRecipeEntity();
        userRecipe.userId = dto.userId;
        userRecipe.role = dto.role;
        return userRecipe;
      });
    }

    const entity = await this.recipeRepo.save(entityData);

    return RecipeMapper.toDomain(entity);
  }

  async findAll(): Promise<Recipe[]> {
    const entities = await this.recipeRepo.find();
    return RecipeMapper.toDomainList(entities);
  }
  async findByUserAndRole(userId: number, role: UserRecipeRole): Promise<Recipe[]> {
    return this.recipeRepo.find({
      where: { userRecipes: { userId, role } },
    });
  }

  async search(name?: string, category?: string): Promise<Recipe[]> {
    const where: any = {};

    if (name) {
      where.name = Like(`%${name}%`);
    }

    if (category) {
      where.category = category;
    }

    return this.recipeRepo.find({ where });
  }

  async fork(originalId: number, userId: number): Promise<Recipe> {
    const original = await this.recipeRepo.findOne({
      where: { id: originalId },
      relations: ['ingredients'],
    });

    if (!original) {
      throw new NotFoundException(`Recipe with ID ${originalId} not found`);
    }

    const newRecipe = new RecipeEntity();
    newRecipe.name = `${original.name} (Fork)`;
    newRecipe.description = original.description;
    newRecipe.category = original.category;
    newRecipe.instructions = original.instructions;
    newRecipe.photoUrl = original.photoUrl;
    newRecipe.originalRecipeId = original.id;

    if (original.ingredients) {
      newRecipe.ingredients = original.ingredients.map((ing) => {
        const newIng = new RecipeIngredientEntity();
        newIng.quantity = ing.quantity;
        newIng.unit = ing.unit;
        newIng.customIngredientText = ing.customIngredientText;
        newIng.notes = ing.notes;
        newIng.ingredientId = ing.ingredientId;
        return newIng;
      });
    }

    const userRecipe = new UserRecipeEntity();
    userRecipe.userId = userId; // Assuming userId is passed from controller
    userRecipe.role = UserRecipeRole.CREATOR;
    newRecipe.userRecipes = [userRecipe];

    const saved = await this.recipeRepo.save(newRecipe);
    return RecipeMapper.toDomain(saved);
  }
}
