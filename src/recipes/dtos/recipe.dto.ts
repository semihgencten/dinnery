export class CreateRecipeDto {
    name: string;
    description?: string;
    instructions: string;
    photoUrl?: string;
}

export class RecipeResponseDto {
    id: number;
    name: string;
    description: string | null;
    instructions: string;
    photoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}
