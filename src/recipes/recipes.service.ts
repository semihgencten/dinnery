import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity';
import { Recipe } from './domain/recipe.model';
import { RecipeMapper } from './mappers/recipe.mapper';
import { CreateRecipeDto } from './dtos/recipe.dto';
import { UserRecipeEntity } from './entities/user-recipe.entity';

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
}
