export enum UserRecipeRole {
    CREATOR = 'creator',
    SAVED = 'saved',
    COLLABORATOR = 'collaborator',
}

export class UserRecipe {
    id: number;
    userId: number;
    recipeId: number;
    role: UserRecipeRole;
    collection?: string;
    createdAt: Date;
    updatedAt: Date;
}
