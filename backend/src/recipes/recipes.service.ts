import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, DataSource } from 'typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { RecipeIngredientEntity } from './entities/recipe-ingredient.entity';
import { Recipe } from './domain/recipe.model';
import { RecipeMapper } from './mappers/recipe.mapper';
import { CreateRecipeDto, UpdateRecipeDto } from './dtos/recipe.dto';
import { UserRecipeEntity } from './entities/user-recipe.entity';
import { UserRecipeRole } from './domain/user-recipe.model';
import { RecipeLikeEntity } from './entities/recipe-like.entity';
import { CommentEntity } from './entities/comment.entity';
import { Comment } from './domain/comment.model';
import { CreateCommentDto } from './dtos/comment.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(RecipeEntity)
    private recipeRepo: Repository<RecipeEntity>,
    @InjectRepository(RecipeLikeEntity)
    private recipeLikeRepo: Repository<RecipeLikeEntity>,
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    private dataSource: DataSource,
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

  async create(createDto: CreateRecipeDto, creatorId?: number): Promise<Recipe> {
    const domainData = Recipe.create(
      createDto.name,
      createDto.description ?? '',
      createDto.category,
      createDto.instructions,
      createDto.photoUrl,
      createDto.cookTime,
      createDto.prepTime,
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

    if (creatorId) {
      const userRecipe = new UserRecipeEntity();
      userRecipe.userId = creatorId;
      userRecipe.role = UserRecipeRole.CREATOR;
      if (!entityData.userRecipes) {
        entityData.userRecipes = [];
      }
      entityData.userRecipes.push(userRecipe);
    }

    const entity = await this.recipeRepo.save(entityData);

    return RecipeMapper.toDomain(entity);
  }

  async findAll(offset: number = 0, limit: number = 20): Promise<Recipe[]> {
    const entities = await this.recipeRepo.find({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' }
    });
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

  async toggleLike(recipeId: number, userId: number): Promise<{ liked: boolean; likesCount: number }> {
    const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
    if (!recipe) throw new NotFoundException('Recipe not found');

    const existingLike = await this.recipeLikeRepo.findOneBy({ recipeId, userId });

    let liked = false;
    await this.dataSource.transaction(async (manager) => {
      if (existingLike) {
        await manager.delete(RecipeLikeEntity, { recipeId, userId });
        await manager.decrement(RecipeEntity, { id: recipeId }, 'likesCount', 1);
        liked = false;
      } else {
        const newLike = new RecipeLikeEntity();
        newLike.recipeId = recipeId;
        newLike.userId = userId;
        await manager.save(newLike);
        await manager.increment(RecipeEntity, { id: recipeId }, 'likesCount', 1);
        liked = true;
      }
    });

    const updatedRecipe = await this.recipeRepo.findOneBy({ id: recipeId });
    return { liked, likesCount: updatedRecipe?.likesCount || 0 };
  }

  async addComment(recipeId: number, userId: number, createDto: CreateCommentDto): Promise<Comment> {
    const recipe = await this.recipeRepo.findOneBy({ id: recipeId });
    if (!recipe) throw new NotFoundException('Recipe not found');

    const comment = new CommentEntity();
    comment.recipeId = recipeId;
    comment.userId = userId;
    comment.text = createDto.text;

    let savedComment: CommentEntity;

    await this.dataSource.transaction(async (manager) => {
      savedComment = await manager.save(comment);
      await manager.increment(RecipeEntity, { id: recipeId }, 'commentsCount', 1);
    });

    return new Comment(
      savedComment!.id,
      savedComment!.userId,
      savedComment!.recipeId,
      savedComment!.text,
      savedComment!.createdAt,
      savedComment!.updatedAt,
    );
  }

  async getComments(recipeId: number): Promise<Comment[]> {
    const entities = await this.commentRepo.find({
      where: { recipeId },
      order: { createdAt: 'DESC' },
    });

    return entities.map(e => new Comment(
      e.id,
      e.userId,
      e.recipeId,
      e.text,
      e.createdAt,
      e.updatedAt
    ));
  }
  async update(id: number, updateDto: UpdateRecipeDto, userId: number): Promise<Recipe> {
    const recipe = await this.recipeRepo.findOne({
      where: { id },
      relations: ['userRecipes', 'ingredients']
    });

    if (!recipe) throw new NotFoundException('Recipe not found');

    const isCreator = recipe.userRecipes?.some(ur => ur.userId === userId && ur.role === UserRecipeRole.CREATOR);
    if (!isCreator) throw new ForbiddenException('You are not the creator of this recipe');

    if (updateDto.name) recipe.name = updateDto.name;
    if (updateDto.description !== undefined) recipe.description = updateDto.description;
    if (updateDto.category !== undefined) recipe.category = updateDto.category;
    if (updateDto.instructions) recipe.instructions = updateDto.instructions;
    if (updateDto.photoUrl !== undefined) recipe.photoUrl = updateDto.photoUrl;
    if (updateDto.cookTime !== undefined) recipe.cookTime = updateDto.cookTime;
    if (updateDto.prepTime !== undefined) recipe.prepTime = updateDto.prepTime;

    if (updateDto.ingredients) {
      recipe.ingredients = updateDto.ingredients.map(dto => {
        const ingredient = new RecipeIngredientEntity();
        ingredient.ingredientId = dto.ingredientId ?? null;
        ingredient.quantity = dto.quantity;
        ingredient.unit = dto.unit;
        ingredient.customIngredientText = dto.customIngredientText ?? null;
        ingredient.notes = dto.notes ?? null;
        return ingredient;
      });
    }

    const saved = await this.recipeRepo.save(recipe);
    return RecipeMapper.toDomain(saved);
  }

  async remove(id: number, userId: number): Promise<void> {
    const recipe = await this.recipeRepo.findOne({
      where: { id },
      relations: ['userRecipes']
    });

    if (!recipe) throw new NotFoundException('Recipe not found');

    const isCreator = recipe.userRecipes?.some(ur => ur.userId === userId && ur.role === UserRecipeRole.CREATOR);
    if (!isCreator) throw new ForbiddenException('You are not the creator of this recipe');

    await this.recipeRepo.remove(recipe);
  }
}
