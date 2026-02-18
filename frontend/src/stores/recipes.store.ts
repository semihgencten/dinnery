import { makeAutoObservable, runInAction } from 'mobx';
import { getRecipes, searchRecipes, getRecipe, getComments, getUserRecipes, createRecipe, searchIngredients, searchRecipesByIngredients, saveRecipe, unsaveRecipe } from '../api/recipeApi';
import type { Recipe, Comment, CreateRecipePayload } from '../types/recipe';





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
            const recipes = await getRecipes(offset, limit);
            runInAction(() => {
                // For now, simpler implementation: replace recipes on load.
                // If implementing infinite scroll later, we would append.
                if (offset === 0) {
                    this.recipes = recipes;
                } else {
                    this.recipes.push(...recipes);
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
            const recipes = await searchRecipes(name, category);
            runInAction(() => {
                this.recipes = recipes;
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
            const recipe = await getRecipe(id);
            runInAction(() => {
                this.currentRecipe = recipe;
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
            const comments = await getComments(id);
            runInAction(() => {
                this.currentRecipeComments = comments;
            });
        } catch (error) {
            console.error(`Failed to fetch comments for recipe ${id}`, error);
        }
    }

    async fetchUserRecipes(userId: number) {
        this.isLoading = true;
        try {
            const recipes = await getUserRecipes(userId, 'creator');
            runInAction(() => {
                this.recipes = recipes;
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
            const recipe = await createRecipe(recipeData);
            runInAction(() => {
                this.recipes.unshift(recipe);
            });
            return recipe;
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
            return await searchIngredients(term);
        } catch (error) {
            console.error('Failed to search ingredients', error);
            return [];
        }
    }

    async searchRecipesByIngredients(ingredients: string[]) {
        this.isLoading = true;
        try {
            const recipes = await searchRecipesByIngredients(ingredients);
            runInAction(() => {
                this.recipes = recipes;
            });
            return recipes;
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
            const recipes = await getUserRecipes(userId, 'saved');
            // TODO: Filter by collection if needed, or backend should handle it
            runInAction(() => {
                this.savedRecipes = recipes;
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
            const savedRecipe = await saveRecipe(recipeId, collection);

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
            const updatedRecipe = await unsaveRecipe(recipeId, collection);

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


