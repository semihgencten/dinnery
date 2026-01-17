import { RecipeEntity } from '../entities/recipe.entity';
import { Recipe } from '../domain/recipe.model';

export class RecipeMapper {
    static toDomain(entity: RecipeEntity): Recipe {
        return new Recipe(
            entity.id,
            entity.name,
            entity.description,
            entity.category,
            entity.instructions,
            entity.photoUrl,
            entity.createdAt,
            entity.updatedAt
        );
    }

    static toEntity(domain: Partial<Recipe>): Partial<RecipeEntity> {
        return {
            name: domain.name,
            description: domain.description ?? undefined,
            category: domain.category ?? undefined,
            instructions: domain.instructions,
            photoUrl: domain.photoUrl ?? undefined
        };
    }

    static toDomainList(entities: RecipeEntity[]): Recipe[] {
        return entities.map(entity => this.toDomain(entity));
    }
}
