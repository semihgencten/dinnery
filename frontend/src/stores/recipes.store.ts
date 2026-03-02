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

    mapRecipe(r: any): Recipe {
        return {
            ...r,
            likesCount: r.likesCount ?? 0,
            commentsCount: r.commentsCount ?? 0,
            createdAt: r.createdAt as unknown as string,
            updatedAt: r.updatedAt as unknown as string
        };
    }

    async fetchRecipes(offset = 0, limit = 20) {
        this.isLoading = true;
        try {
            const recipes = await getRecipes(offset, limit);
            runInAction(() => {
                const mapped = recipes.map(r => this.mapRecipe(r));
                if (offset === 0) {
                    this.recipes = mapped;
                } else {
                    this.recipes.push(...mapped);
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
                this.recipes = recipes.map(r => this.mapRecipe(r));
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
                this.currentRecipe = this.mapRecipe(recipe);
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
                this.currentRecipeComments = comments.map(c => ({
                    ...c,
                    createdAt: c.createdAt as unknown as string,
                    updatedAt: c.updatedAt as unknown as string
                }));
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
                this.recipes = recipes.map(r => this.mapRecipe(r));
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
            const recipe = await createRecipe({ ...recipeData, userRecipes: [] });
            runInAction(() => {
                this.recipes.unshift(this.mapRecipe(recipe));
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
                this.recipes = recipes.map(r => this.mapRecipe(r));
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
    async fetchSavedRecipes(userId: number) {
        this.isLoading = true;
        try {
            const recipes = await getUserRecipes(userId, 'saved');
            // TODO: Filter by collection if needed, or backend should handle it
            runInAction(() => {
                this.savedRecipes = recipes.map(r => this.mapRecipe(r));
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
            const mappedSaved = this.mapRecipe(savedRecipe);

            runInAction(() => {
                if (!this.savedRecipes.find(r => r.id === savedRecipe.id)) {
                    this.savedRecipes.push(mappedSaved);
                }

                const recipeIndex = this.recipes.findIndex(r => r.id === recipeId);
                if (recipeIndex !== -1) {
                    this.recipes[recipeIndex] = mappedSaved;
                }

                if (this.currentRecipe && this.currentRecipe.id === recipeId) {
                    this.currentRecipe = mappedSaved;
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
            const mappedUpdated = this.mapRecipe(updatedRecipe);

            runInAction(() => {
                this.savedRecipes = this.savedRecipes.filter(r => r.id !== recipeId);

                const recipeIndex = this.recipes.findIndex(r => r.id === recipeId);
                if (recipeIndex !== -1) {
                    this.recipes[recipeIndex] = mappedUpdated;
                }

                if (this.currentRecipe && this.currentRecipe.id === recipeId) {
                    this.currentRecipe = mappedUpdated;
                }
            });
        } catch (error) {
            console.error('Failed to unsave recipe', error);
            throw error;
        }
    }
}


