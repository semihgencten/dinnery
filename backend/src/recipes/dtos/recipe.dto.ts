import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, ValidateIf, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRecipeRole } from '../domain/user-recipe.model';

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

export class CreateRecipeDto {
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

export class RecipeResponseDto {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    instructions: string;
    photoUrl: string | null;
    originalRecipeId: number | null;
    createdAt: Date;
    updatedAt: Date;
}
