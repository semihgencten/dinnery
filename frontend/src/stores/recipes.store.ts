import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../lib/axios';

export interface Recipe {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    instructions: string;
    photoUrl: string | null;
    cookTime: number | null;
    prepTime: number | null;
    likesCount: number;
    commentsCount: number;
    originalRecipeId: number | null;
    createdAt: string;
    updatedAt: string;
    // user/author is not currently available in backend response
}

export class RecipesStore {
    recipes: Recipe[] = [];
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchRecipes(offset = 0, limit = 20) {
        this.isLoading = true;
        try {
            const response = await api.get('/recipes', {
                params: { offset, limit }
            });
            runInAction(() => {
                // For now, simpler implementation: replace recipes on load.
                // If implementing infinite scroll later, we would append.
                if (offset === 0) {
                    this.recipes = response.data;
                } else {
                    this.recipes.push(...response.data);
                }
            });
        } catch (error) {
            console.error('Failed to fetch recipes', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async searchRecipes(name?: string, category?: string) {
        this.isLoading = true;
        try {
            const response = await api.get('/recipes/search', {
                params: { name, category }
            });
            runInAction(() => {
                this.recipes = response.data;
            });
        } catch (error) {
            console.error('Failed to search recipes', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
