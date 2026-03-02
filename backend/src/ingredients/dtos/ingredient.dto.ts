import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IngredientCreateRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsString()
    category?: string;
}

export class IngredientBaseResponseDto {
    id: number;
    name: string;
    displayName: string;
    photoUrl: string | null;
    category: string | null;
    canBeDeleted: boolean;
}

export class IngredientCreateResponseDto extends IngredientBaseResponseDto { }
export class IngredientSearchResponseDto extends IngredientBaseResponseDto { }
export class IngredientGetResponseDto extends IngredientBaseResponseDto { }

