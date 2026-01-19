export class RecipeIngredient {
    constructor(
        public readonly id: number,
        public readonly recipeId: number,
        public readonly ingredientId: number | null,
        public readonly quantity: number,
        public readonly unit: string,
        public readonly customIngredientText: string | null = null,
        public readonly notes: string | null = null,
    ) { }

    static create(
        recipeId: number,
        quantity: number,
        unit: string,
        item: { ingredientId: number } | { customIngredientText: string },
        notes?: string
    ): Partial<RecipeIngredient> {
        const isCustom = 'customIngredientText' in item;

        return {
            recipeId,
            quantity,
            unit,
            ingredientId: isCustom ? null : (item as { ingredientId: number }).ingredientId,
            customIngredientText: isCustom ? (item as { customIngredientText: string }).customIngredientText.trim() : null,
            notes: notes?.trim() || null
        };
    }
}
