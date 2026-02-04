export class Recipe {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string | null,
        public readonly category: string | null,
        public readonly instructions: string,
        public readonly photoUrl: string | null,
        public readonly cookTime: number | null,
        public readonly prepTime: number | null,
        public readonly likesCount: number,
        public readonly commentsCount: number,
        public readonly originalRecipeId: number | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        public readonly ingredients: {
            name: string;
            quantity: number;
            unit: string;
            notes: string | null;
        }[] | null = null,
    ) { }

    static create(
        name: string,
        description: string,
        category: string | undefined,
        instructions: string,
        photoUrl?: string,
        cookTime?: number,
        prepTime?: number,
        originalRecipeId?: number
    ): Partial<Recipe> {
        return {
            name: name.trim(),
            description: description?.trim() || null,
            category: category?.trim() || null,
            instructions: instructions.trim(),
            photoUrl: photoUrl || null,
            cookTime: cookTime || null,
            prepTime: prepTime || null,
            originalRecipeId: originalRecipeId || null
        };
    }
}
