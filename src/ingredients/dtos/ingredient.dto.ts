export class CreateIngredientDto {
    name: string;
    displayName: string;
    photoUrl?: string;
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
