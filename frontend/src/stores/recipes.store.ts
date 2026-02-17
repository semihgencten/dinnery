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
    author?: {
        id: number;
        username: string;
    };
    ingredients?: {
        name: string;
        quantity: number;
        unit: string;
        notes: string | null;
    }[];
    isSaved: boolean;
}

export interface Comment {
    id: number;
    text: string;
    userId: number;
    recipeId: number;
    createdAt: string;
    updatedAt: string;
}

export class RecipesStore {
    recipes: Recipe[] = [];
    savedRecipes: Recipe[] = [];
    currentRecipe: Recipe | null = null;
    currentRecipeComments: Comment[] = [];
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

    async fetchRecipe(id: string) {
        this.isLoading = true;
        this.currentRecipe = null;
        this.currentRecipeComments = [];
        try {
            const response = await api.get(`/recipes/${id}`);
            runInAction(() => {
                this.currentRecipe = response.data;
            });
            // Fetch comments in parallel or after
            this.fetchComments(id);
        } catch (error) {
            console.error(`Failed to fetch recipe ${id}`, error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async fetchComments(id: string) {
        try {
            const response = await api.get(`/recipes/${id}/comments`);
            runInAction(() => {
                this.currentRecipeComments = response.data;
            });
        } catch (error) {
            console.error(`Failed to fetch comments for recipe ${id}`, error);
        }
    }

    async fetchUserRecipes(userId: number) {
        this.isLoading = true;
        try {
            const response = await api.get(`/recipes/user/${userId}`, {
                params: { role: 'creator' }
            });
            runInAction(() => {
                this.recipes = response.data;
            });
        } catch (error) {
            console.error('Failed to fetch user recipes', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async createRecipe(recipeData: CreateRecipePayload) {
        this.isLoading = true;
        try {
            const response = await api.post('/recipes', recipeData);
            runInAction(() => {
                this.recipes.unshift(response.data);
            });
            return response.data;
        } catch (error) {
            console.error('Failed to create recipe', error);
            throw error;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async searchIngredients(term: string) {
        try {
            const response = await api.get('/ingredients/search', {
                params: { term }
            });
            return response.data;
        } catch (error) {
            console.error('Failed to search ingredients', error);
            return [];
        }
    }

    async searchRecipesByIngredients(ingredients: string[]) {
        this.isLoading = true;
        try {
            const response = await api.post('/recipes/search/ingredients', ingredients);
            runInAction(() => {
                this.recipes = response.data;
            });
            return response.data as Recipe[];
        } catch (error) {
            console.error('Failed to search recipes by ingredients', error);
            return [];
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
    async fetchSavedRecipes(userId: number, collection?: string) {
        this.isLoading = true;
        try {
            const response = await api.get(`/recipes/user/${userId}`, {
                params: { role: 'saved' }
            });
            // TODO: Filter by collection if needed, or backend should handle it
            runInAction(() => {
                this.savedRecipes = response.data;
            });
        } catch (error) {
            console.error('Failed to fetch saved recipes', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async saveRecipe(recipeId: number, collection?: string) {
        try {
            const response = await api.post(`/recipes/${recipeId}/save`, { collection });
            const savedRecipe = response.data;

            runInAction(() => {
                if (!this.savedRecipes.find(r => r.id === savedRecipe.id)) {
                    this.savedRecipes.push(savedRecipe);
                }

                const recipeIndex = this.recipes.findIndex(r => r.id === recipeId);
                if (recipeIndex !== -1) {
                    this.recipes[recipeIndex] = savedRecipe;
                }

                if (this.currentRecipe && this.currentRecipe.id === recipeId) {
                    this.currentRecipe = savedRecipe;
                }
            });
        } catch (error) {
            console.error('Failed to save recipe', error);
            throw error;
        }
    }

    async unsaveRecipe(recipeId: number, collection?: string) {
        try {
            const response = await api.delete(`/recipes/${recipeId}/save`, {
                params: { collection }
            });
            const updatedRecipe = response.data;

            runInAction(() => {
                this.savedRecipes = this.savedRecipes.filter(r => r.id !== recipeId);

                const recipeIndex = this.recipes.findIndex(r => r.id === recipeId);
                if (recipeIndex !== -1) {
                    this.recipes[recipeIndex] = updatedRecipe;
                }

                if (this.currentRecipe && this.currentRecipe.id === recipeId) {
                    this.currentRecipe = updatedRecipe;
                }
            });
        } catch (error) {
            console.error('Failed to unsave recipe', error);
            throw error;
        }
    }
}

export interface CreateRecipePayload {
    name: string;
    description?: string;
    category?: string;
    instructions: string;
    photoUrl?: string;
    cookTime?: number;
    prepTime?: number;
    ingredients: {
        ingredientId?: number;
        quantity: number;
        unit: string;
        customIngredientText?: string;
        notes?: string;
    }[];
}
