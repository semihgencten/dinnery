// Authentication
export interface UserLoginRequestDto {
    email: string;
    password: string;
}

export interface UserRefreshTokenRequestDto {
    refreshToken: string;
}

export interface UserRegisterRequestDto {
    email: string;
    password: string;
    language: string;
}

export interface UserLoginResponseDto {
    accessToken: string;
    refreshToken: string;
}

export interface UserRefreshTokenResponseDto {
    accessToken: string;
}

// Users
export interface UserUpdateProfileRequestDto {
    language?: string;
}

export interface UserBaseResponseDto {
    id: number;
    email: string;
    language: string;
}

export interface UserRegisterResponseDto extends UserBaseResponseDto { }
export interface UserGetResponseDto extends UserBaseResponseDto { }
export interface UserGetAllResponseDto extends UserBaseResponseDto { }
export interface UserGetProfileResponseDto extends UserBaseResponseDto { }
export interface UserUpdateProfileResponseDto extends UserBaseResponseDto { }

// Ingredients
export interface IngredientCreateRequestDto {
    name: string;
    displayName: string;
    photoUrl?: string;
    category?: string;
}

export interface IngredientBaseResponseDto {
    id: number;
    name: string;
    displayName: string;
    photoUrl: string | null;
    category: string | null;
    canBeDeleted: boolean;
}

export interface IngredientCreateResponseDto extends IngredientBaseResponseDto { }
export interface IngredientSearchResponseDto extends IngredientBaseResponseDto { }
export interface IngredientGetResponseDto extends IngredientBaseResponseDto { }

// Recipes
export const UserRecipeRole = {
    CREATOR: 'creator',
    SAVED: 'saved',
    COLLABORATOR: 'collaborator',
} as const;
export type UserRecipeRole = typeof UserRecipeRole[keyof typeof UserRecipeRole];

export interface CreateRecipeIngredientDto {
    ingredientId?: number;
    quantity: number;
    unit: string;
    customIngredientText?: string;
    notes?: string;
}

export interface UserRecipeDto {
    userId: number;
    role: UserRecipeRole;
}

export interface RecipeCreateRequestDto {
    name: string;
    description?: string;
    category?: string;
    instructions: string;
    photoUrl?: string;
    cookTime?: number;
    prepTime?: number;
    originalRecipeId?: number;
    ingredients: CreateRecipeIngredientDto[];
    userRecipes: UserRecipeDto[];
}

export interface RecipeUpdateRequestDto extends Partial<RecipeCreateRequestDto> { }

export interface RecipeSearchByIngredientsRequestDto {
    ingredients: string[];
}

export interface RecipeSaveRequestDto {
    collection: string;
}

export interface RecipeBaseResponseDto {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    instructions: string;
    photoUrl: string | null;
    cookTime: number | null;
    prepTime: number | null;
    originalRecipeId: number | null;
    createdAt: Date;
    updatedAt: Date;
    ingredients?: {
        name: string;
        quantity: number;
        unit: string;
        notes: string | null;
    }[] | null;
    author?: {
        id: number;
        username: string;
    } | null;
    isSaved?: boolean;
    likesCount?: number;
    commentsCount?: number;
}

export interface RecipeCreateResponseDto extends RecipeBaseResponseDto { }
export interface RecipeGetAllResponseDto extends RecipeBaseResponseDto { }
export interface RecipeSearchResponseDto extends RecipeBaseResponseDto { }
export interface RecipeSearchByIngredientsResponseDto extends RecipeBaseResponseDto { }
export interface RecipeGetByUserResponseDto extends RecipeBaseResponseDto { }
export interface RecipeGetResponseDto extends RecipeBaseResponseDto { }
export interface RecipeUpdateResponseDto extends RecipeBaseResponseDto { }
export interface RecipeForkResponseDto extends RecipeBaseResponseDto { }
export interface RecipeSaveResponseDto extends RecipeBaseResponseDto { }
export interface RecipeUnsaveResponseDto extends RecipeBaseResponseDto { }

export interface RecipeToggleLikeResponseDto {
    liked: boolean;
    likesCount: number;
}

// Comments
export interface RecipeAddCommentRequestDto {
    text: string;
}

export interface CommentBaseResponseDto {
    id: number;
    userId: number;
    recipeId: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecipeAddCommentResponseDto extends CommentBaseResponseDto { }
export interface RecipeGetCommentsResponseDto extends CommentBaseResponseDto { }


// Cloudinary
export interface CloudinaryGetSignatureResponseDto {
    timestamp: number;
    signature: string;
    cloudName: string | undefined;
    apiKey: string | undefined;
    folder: string;
}
