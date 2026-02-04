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
            entity.cookTime,
            entity.prepTime,
            entity.likesCount,
            entity.commentsCount,
            entity.originalRecipeId || null,
            entity.createdAt,
            entity.updatedAt,
            entity.ingredients?.map(i => ({
                name: i.customIngredientText || i.ingredient?.name || 'Unknown Ingredient',
                quantity: Number(i.quantity),
                unit: i.unit,
                notes: i.notes
            })) || null
        );
    }

    static toEntity(domain: Partial<Recipe>): Partial<RecipeEntity> {
        return {
            name: domain.name,
            description: domain.description ?? undefined,
            category: domain.category ?? undefined,
            instructions: domain.instructions,
            photoUrl: domain.photoUrl ?? undefined,
            cookTime: domain.cookTime ?? undefined,
            prepTime: domain.prepTime ?? undefined,
            originalRecipeId: domain.originalRecipeId ?? undefined
        };
    }

    static toDomainList(entities: RecipeEntity[]): Recipe[] {
        return entities.map(entity => this.toDomain(entity));
    }
}
