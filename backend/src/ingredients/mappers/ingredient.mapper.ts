import { IngredientEntity } from '../entities/ingredient.entity';
import { Ingredient } from '../domain/ingredient.model';

export class IngredientMapper {
    static toDomain(entity: IngredientEntity, usageCount?: number): Ingredient {
        return new Ingredient(
            entity.id,
            entity.name,
            entity.displayName,
            entity.photoUrl,
            entity.category,
            entity.createdAt,
            entity.updatedAt,
            usageCount
        );
    }

    static toEntity(domain: Partial<Ingredient>): Partial<IngredientEntity> {
        return {
            name: domain.name,
            displayName: domain.displayName,
            photoUrl: domain.photoUrl ?? undefined,
            category: domain.category ?? undefined
        };
    }

    static toDomainList(entities: IngredientEntity[]): Ingredient[] {
        return entities.map(entity => this.toDomain(entity));
    }
}
