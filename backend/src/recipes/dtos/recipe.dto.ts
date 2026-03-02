import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, ValidateIf, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRecipeRole } from '../domain/user-recipe.model';
import { PartialType } from '@nestjs/swagger';

export class CreateRecipeIngredientDto {
    @ValidateIf(o => !o.customIngredientText)
    @IsNumber()
    ingredientId?: number;

    @IsNumber()
    @Min(0)
    quantity: number;

    @IsString()
    @IsNotEmpty()
    unit: string;

    @ValidateIf(o => !o.ingredientId)
    @IsString()
    @IsNotEmpty()
    customIngredientText?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}

export class UserRecipeDto {
    @IsNumber()
    userId: number;

    @IsEnum(UserRecipeRole)
    role: UserRecipeRole;
}

export class RecipeCreateRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsString()
    @IsNotEmpty()
    instructions: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    cookTime?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    prepTime?: number;

    @IsOptional()
    @IsNumber()
    originalRecipeId?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateRecipeIngredientDto)
    ingredients: CreateRecipeIngredientDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserRecipeDto)
    userRecipes: UserRecipeDto[];
}

export class RecipeUpdateRequestDto extends PartialType(RecipeCreateRequestDto) { }

export class RecipeSearchByIngredientsRequestDto {
    @IsArray()
    @IsString({ each: true })
    ingredients: string[];
}

export class RecipeSaveRequestDto {
    @IsString()
    collection: string;
}

export class RecipeBaseResponseDto {
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

export class RecipeCreateResponseDto extends RecipeBaseResponseDto { }
export class RecipeGetAllResponseDto extends RecipeBaseResponseDto { }
export class RecipeSearchResponseDto extends RecipeBaseResponseDto { }
export class RecipeSearchByIngredientsResponseDto extends RecipeBaseResponseDto { }
export class RecipeGetByUserResponseDto extends RecipeBaseResponseDto { }
export class RecipeGetResponseDto extends RecipeBaseResponseDto { }
export class RecipeUpdateResponseDto extends RecipeBaseResponseDto { }
export class RecipeForkResponseDto extends RecipeBaseResponseDto { }
export class RecipeSaveResponseDto extends RecipeBaseResponseDto { }
export class RecipeUnsaveResponseDto extends RecipeBaseResponseDto { }

export class RecipeToggleLikeResponseDto {
    liked: boolean;
    likesCount: number;
}

