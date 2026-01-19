export class Recipe {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string | null,
        public readonly category: string | null,
        public readonly instructions: string,
        public readonly photoUrl: string | null,
        public readonly originalRecipeId: number | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }

    static create(
        name: string,
        description: string,
        category: string | undefined,
        instructions: string,
        photoUrl?: string,
        originalRecipeId?: number
    ): Partial<Recipe> {
        return {
            name: name.trim(),
            description: description?.trim() || null,
            category: category?.trim() || null,
            instructions: instructions.trim(),
            photoUrl: photoUrl || null,
            originalRecipeId: originalRecipeId || null
        };
    }
}
