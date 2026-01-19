import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
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

export class IngredientResponseDto {
    id: number;
    name: string;
    displayName: string;
    photoUrl: string | null;
    category: string | null;
    canBeDeleted: boolean;
}
