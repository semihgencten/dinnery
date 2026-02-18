export interface Ingredient {
    id: number;
    name: string;
}

export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    instructions: string;
    photoUrl: string | null;
    cookTime: number | null;
    prepTime: number | null;
    likesCount: number;
    commentsCount: number;
    originalRecipeId: number | null;
    createdAt: string;
    updatedAt: string;
    author?: {
        id: number;
        username: string;
    };
    ingredients?: {
        name: string;
        quantity: number;
        unit: string;
        notes: string | null;
    }[];
    isSaved: boolean;
}

export interface Comment {
    id: number;
    text: string;
    userId: number;
    recipeId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRecipePayload {
    name: string;
    description?: string;
    category?: string;
    instructions: string;
    photoUrl?: string;
    cookTime?: number;
    prepTime?: number;
    ingredients: {
        ingredientId?: number;
        quantity: number;
        unit: string;
        customIngredientText?: string;
        notes?: string;
    }[];
}
