export class Ingredient {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly displayName: string,
        public readonly photoUrl: string | null,
        public readonly category: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
        private readonly usageCount: number = 0
    ) { }


    canBeDeleted(): boolean {
        return this.usageCount === 0;
    }

    matches(searchTerm: string): boolean {
        const term = searchTerm.toLowerCase();
        return this.name.toLowerCase().includes(term) ||
            this.displayName.toLowerCase().includes(term);
    }

    // Factory method
    static create(
        name: string,
        displayName: string,
        photoUrl?: string,
        category?: string
    ): Partial<Ingredient> {
        return {
            name: name.toLowerCase().trim(),
            displayName: displayName.trim(),
            photoUrl: photoUrl || null,
            category: category || null
        };
    }
}
