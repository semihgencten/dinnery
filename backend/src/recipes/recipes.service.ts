import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, DataSource, IsNull } from 'typeorm';
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
    @InjectRepository(UserRecipeEntity)
    private userRecipeRepo: Repository<UserRecipeEntity>,
    private dataSource: DataSource,
  ) { }

  async findOne(id: number, userId?: number): Promise<Recipe> {
    const entity = await this.recipeRepo.findOne({
      where: { id },
      relations: ['ingredients', 'ingredients.ingredient', 'userRecipes', 'userRecipes.user']
    });

    if (!entity) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return RecipeMapper.toDomain(entity, userId);
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

  async findAll(offset: number = 0, limit: number = 20, userId?: number): Promise<Recipe[]> {
    const entities = await this.recipeRepo.createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.userRecipes', 'ur')
      .leftJoinAndSelect('ur.user', 'u')
      .skip(offset)
      .take(limit)
      .orderBy('recipe.likesCount + recipe.commentsCount', 'DESC')
      .addOrderBy('recipe.createdAt', 'DESC')
      .getMany();
    return RecipeMapper.toDomainList(entities, userId);
  }

  async findByUserAndRole(targetUserId: number, role: UserRecipeRole, viewerId?: number): Promise<Recipe[]> {
    const entities = await this.recipeRepo.find({
      where: { userRecipes: { userId: targetUserId, role } },
      relations: ['userRecipes', 'userRecipes.user']
    });
    return RecipeMapper.toDomainList(entities, viewerId);
  }

  async search(name?: string, category?: string, userId?: number): Promise<Recipe[]> {
    const qb = this.recipeRepo.createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.userRecipes', 'ur')
      .leftJoinAndSelect('ur.user', 'u');

    if (name) {
      qb.andWhere('recipe.name LIKE :name', { name: `%${name}%` });
    }

    if (category) {
      qb.andWhere('recipe.category = :category', { category });
    }

    qb.orderBy('recipe.likesCount + recipe.commentsCount', 'DESC');

    const entities = await qb.getMany();
    return RecipeMapper.toDomainList(entities, userId);
  }

  async searchByIngredients(ingredients: string[]): Promise<Recipe[]> {
    if (!ingredients || ingredients.length === 0) {
      return [];
    }

    const ingredientsLower = ingredients.map(i => i.toLowerCase());

    // 1. Find recipes that contain ingredients NOT in the list (The "Bad" recipes)
    // We check customIngredientText. If ingredientId exists, we ideally check the name too, 
    // but for now we assume customIngredientText covers the search term or we fall back to it.
    // To be robust, we'll join the ingredient table.

    // Note: TypeORM might prefix columns. We use the aliases defined.
    const badRecipes = await this.recipeRepo.createQueryBuilder('r')
      .select('r.id')
      .innerJoin('r.ingredients', 'ri')
      .leftJoin('ri.ingredient', 'i')
      .where(`(LOWER(ri.custom_ingredient_text) NOT IN (:...ingredients) OR ri.custom_ingredient_text IS NULL)`)
      .andWhere(`(i.name IS NULL OR LOWER(i.name) NOT IN (:...ingredients))`)
      // If custom text is null AND name is null (weird data), is it bad? 
      // Technically if it's not in the list, it's bad.
      // But the condition above is AND.
      // We want: (IsBadCustom OR IsBadLink) ?
      // No, we want: Verify IsValid.
      // IsValid = (Custom IN list OR Name IN list).
      // So IsBad = NOT (Custom IN list OR Name IN list)
      // = (Custom NOT IN list AND Name NOT IN list).
      .setParameter('ingredients', ingredientsLower)
      .getRawMany();

    const badRecipeIds = badRecipes.map(r => r.r_id);

    // 2. Fetch all recipes that are NOT in the bad list
    const qb = this.recipeRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.ingredients', 'ri')
      .leftJoinAndSelect('r.userRecipes', 'ur')
      .leftJoinAndSelect('ur.user', 'u')
      .leftJoinAndSelect('ri.ingredient', 'i');

    if (badRecipeIds.length > 0) {
      qb.where('r.id NOT IN (:...badRecipeIds)', { badRecipeIds });
    }

    // Ensure we don't return recipes with NO ingredients if that's not desired, 
    // but mathematically they are subsets.
    // "1. selected ingredients are included in the recipe" -> could imply Count > 0.
    // Let's filter out empty recipes to be safe? 
    // If user searches for 'tomato', they want food. Empty recipe is not food.
    // But how to check empty ingredients in this query?
    // We can join ingredients.
    // If we use innerJoinAndSelect('r.ingredients'), we enforce at least one ingredient.
    // But we used leftJoinAndSelect.

    // Let's enforce at least one ingredient match?
    // Actually, "1. selected ingredients are included" implies intersection is not empty.
    // So let's count matches.

    const recipes = await qb.getMany();

    // Filter out recipes with 0 ingredients just in case (as valid subset but useless result)
    const validRecipes = recipes.filter(r => r.ingredients && r.ingredients.length > 0);

    // 3. Sort in memory
    // Sort by:
    // a. Number of matching ingredients (desc)
    // b. Likes + Comments (desc)
    const sortedEntities = validRecipes.sort((a, b) => {
      const countA = a.ingredients.length;
      const countB = b.ingredients.length;
      if (countA !== countB) {
        return countB - countA;
      }
      const popularityA = (a.likesCount || 0) + (a.commentsCount || 0);
      const popularityB = (b.likesCount || 0) + (b.commentsCount || 0);
      return popularityB - popularityA;
    });

    return RecipeMapper.toDomainList(sortedEntities);
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
  async saveRecipe(id: number, userId: number, collection?: string): Promise<void> {
    const recipe = await this.recipeRepo.findOneBy({ id });
    if (!recipe) throw new NotFoundException('Recipe not found');

    const criteria: any = { userId, recipeId: id, role: UserRecipeRole.SAVED };
    if (collection) {
      criteria.collection = collection;
    } else {
      criteria.collection = IsNull();
    }

    const existing = await this.userRecipeRepo.findOneBy(criteria);
    if (existing) return;

    const userRecipe = new UserRecipeEntity();
    userRecipe.userId = userId;
    userRecipe.recipeId = id;
    userRecipe.role = UserRecipeRole.SAVED;
    if (collection) userRecipe.collection = collection;

    await this.userRecipeRepo.save(userRecipe);
  }

  async unsaveRecipe(id: number, userId: number, collection?: string): Promise<void> {
    const criteria: any = { userId, recipeId: id, role: UserRecipeRole.SAVED };
    if (collection) {
      criteria.collection = collection;
    } else {
      criteria.collection = IsNull();
    }
    await this.userRecipeRepo.delete(criteria);
  }
}
