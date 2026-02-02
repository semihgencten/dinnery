export class Comment {
    constructor(
        public readonly id: number,
        public readonly userId: number,
        public readonly recipeId: number,
        public readonly text: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }
}
