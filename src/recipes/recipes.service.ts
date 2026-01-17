import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeEntity } from './entities/recipe.entity';
import { Recipe } from './domain/recipe.model';
import { RecipeMapper } from './mappers/recipe.mapper';
import { CreateRecipeDto } from './dtos/recipe.dto';

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
      createDto.instructions,
      createDto.photoUrl,
    );

    const existing = await this.recipeRepo.findOne({
      where: { name: domainData.name },
    });

    if (existing) {
      throw new ConflictException('Recipe already exists');
    }

    const entityData = RecipeMapper.toEntity(domainData);
    const entity = await this.recipeRepo.save(entityData);

    return RecipeMapper.toDomain(entity);
  }

  async findAll(): Promise<Recipe[]> {
    const entities = await this.recipeRepo.find();
    return RecipeMapper.toDomainList(entities);
  }
}
