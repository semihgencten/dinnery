import { RecipeEntity } from '../entities/recipe.entity';
import { Recipe } from '../domain/recipe.model';
import { UserRecipeRole } from '../domain/user-recipe.model';

export class RecipeMapper {
    static toDomain(entity: RecipeEntity, currentUserId?: number): Recipe {
        const creator = entity.userRecipes?.find(ur => ur.role === UserRecipeRole.CREATOR)?.user;
        const isSaved = currentUserId ? entity.userRecipes?.some(ur => ur.userId === currentUserId && ur.role === UserRecipeRole.SAVED) || false : false;

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
            })) || null,
            creator ? { id: creator.id, username: creator.email.split('@')[0] } : null,
            isSaved
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

    static toDomainList(entities: RecipeEntity[], currentUserId?: number): Recipe[] {
        return entities.map(entity => this.toDomain(entity, currentUserId));
    }
}
