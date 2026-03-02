import type { RecipeBaseResponseDto, CommentBaseResponseDto, RecipeCreateRequestDto } from "../../../shared/api-types";

export interface Ingredient {
    id: number;
    name: string;
}

export interface Recipe extends Omit<RecipeBaseResponseDto, 'createdAt' | 'updatedAt' | 'likesCount' | 'commentsCount'> {
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    commentsCount: number;
}

export interface Comment extends Omit<CommentBaseResponseDto, 'createdAt' | 'updatedAt'> {
    createdAt: string;
    updatedAt: string;
}

export type CreateRecipePayload = Omit<RecipeCreateRequestDto, 'userRecipes'>;

