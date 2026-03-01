import { makeAutoObservable } from 'mobx';

export interface Recipe {
    id: string;
    title: string;
    description: string;
    prepTime: number;
    servings: number;
    imageUrl?: string;
    ingredients: string[];
    instructions: string[];
}

export class RecipesStore {
    recipes: Recipe[] = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
    }
}

export const recipesStore = new RecipesStore();
