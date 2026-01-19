import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientEntity } from './entities/ingredient.entity';
import { Ingredient } from './domain/ingredient.model';
import { IngredientMapper } from './mappers/ingredient.mapper';
import { CreateIngredientDto } from './dtos/ingredient.dto';

@Injectable()
export class IngredientsService {
    constructor(
        @InjectRepository(IngredientEntity)
        private ingredientRepo: Repository<IngredientEntity>,
    ) { }

    async findOne(id: number): Promise<Ingredient> {
        const entity = await this.ingredientRepo.findOne({
            where: { id }
        });

        if (!entity) {
            throw new NotFoundException(`Ingredient with ID ${id} not found`);
        }

        // In a real app, we might fetch usage count from a recipe-ingredient relation
        return IngredientMapper.toDomain(entity, 0);
    }

    async create(createDto: CreateIngredientDto): Promise<Ingredient> {
        const domainData = Ingredient.create(
            createDto.name,
            createDto.displayName,
            createDto.photoUrl,
            createDto.category
        );

        const existing = await this.ingredientRepo.findOne({
            where: { name: domainData.name }
        });

        if (existing) {
            throw new ConflictException('Ingredient already exists');
        }

        const entityData = IngredientMapper.toEntity(domainData);
        const entity = await this.ingredientRepo.save(entityData);

        return IngredientMapper.toDomain(entity);
    }

    async search(term: string): Promise<Ingredient[]> {
        const entities = await this.ingredientRepo.find();
        const ingredients = IngredientMapper.toDomainList(entities);

        return ingredients.filter(ing => ing.matches(term));
    }
}
