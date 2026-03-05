import { makeAutoObservable, runInAction } from 'mobx';
import { getRecipes, searchRecipes, getRecipe, getComments, saveRecipe, unsaveRecipe, getUserRecipes } from '../api/recipeApi';
import type {
    RecipeGetAllResponseDto,
    RecipeSearchResponseDto,
    RecipeGetResponseDto,
    RecipeGetCommentsResponseDto,
    RecipeGetByUserResponseDto
} from '../../../shared/api-types';

export class RecipesStore {
    trendingRecipes: RecipeGetAllResponseDto[] = [];
    recommendedRecipes: RecipeGetAllResponseDto[] = [];
    searchResults: RecipeSearchResponseDto[] = [];
    currentRecipe: RecipeGetResponseDto | null = null;
    currentRecipeComments: RecipeGetCommentsResponseDto[] = [];
    userRecipes: RecipeGetByUserResponseDto[] = [];
    savedRecipes: RecipeGetByUserResponseDto[] = [];
    isLoadingTrending = false;
    isLoadingRecommended = false;
    isLoadingRecipe = false;
    isLoadingComments = false;
    isLoadingUserRecipes = false;
    isLoadingSavedRecipes = false;
    isSearching = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchTrendingRecipes() {
        this.isLoadingTrending = true;
        this.error = null;
        try {
            // For now, grabbing the first 5 records as "trending"
            const data = await getRecipes(0, 5);
            runInAction(() => {
                this.trendingRecipes = data;
                this.isLoadingTrending = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to fetch trending recipes';
                this.isLoadingTrending = false;
            });
        }
    }

    async fetchRecommendedRecipes() {
        this.isLoadingRecommended = true;
        this.error = null;
        try {
            // Grabbing different offset for "recommended"
            const data = await getRecipes(5, 5);
            runInAction(() => {
                this.recommendedRecipes = data;
                this.isLoadingRecommended = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to fetch recommended recipes';
                this.isLoadingRecommended = false;
            });
        }
    }

    async search(query: string) {
        if (!query.trim()) {
            runInAction(() => {
                this.searchResults = [];
            });
            return;
        }

        this.isSearching = true;
        this.error = null;
        try {
            const data = await searchRecipes(query);
            runInAction(() => {
                this.searchResults = data;
                this.isSearching = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Search failed';
                this.isSearching = false;
            });
        }
    }

    async fetchRecipe(id: string) {
        this.isLoadingRecipe = true;
        this.error = null;
        try {
            const data = await getRecipe(id);
            runInAction(() => {
                this.currentRecipe = data;
                this.isLoadingRecipe = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to fetch recipe';
                this.isLoadingRecipe = false;
            });
        }
    }

    async fetchComments(id: string) {
        this.isLoadingComments = true;
        this.error = null;
        try {
            const data = await getComments(id);
            runInAction(() => {
                this.currentRecipeComments = data;
                this.isLoadingComments = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to fetch comments';
                this.isLoadingComments = false;
            });
        }
    }

    async saveRecipe(id: number) {
        try {
            await saveRecipe(id);
            runInAction(() => {
                // Also update recommended/trending arrays if necessary, but focusing on detail view:
                if (this.currentRecipe && this.currentRecipe.id === id) {
                    this.currentRecipe.isSaved = true;
                }
                const trending = this.trendingRecipes.find(r => r.id === id);
                if (trending) trending.isSaved = true;
                const recommended = this.recommendedRecipes.find(r => r.id === id);
                if (recommended) recommended.isSaved = true;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to save recipe';
            });
        }
    }

    async unsaveRecipe(id: number) {
        try {
            await unsaveRecipe(id);
            runInAction(() => {
                if (this.currentRecipe && this.currentRecipe.id === id) {
                    this.currentRecipe.isSaved = false;
                }
                const trending = this.trendingRecipes.find(r => r.id === id);
                if (trending) trending.isSaved = false;
                const recommended = this.recommendedRecipes.find(r => r.id === id);
                if (recommended) recommended.isSaved = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to unsave recipe';
            });
        }
    }

    async fetchUserRecipes(userId: number) {
        this.isLoadingUserRecipes = true;
        this.error = null;
        try {
            const data = await getUserRecipes(userId, 'creator');
            runInAction(() => {
                this.userRecipes = data;
                this.isLoadingUserRecipes = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to fetch user recipes';
                this.isLoadingUserRecipes = false;
            });
        }
    }

    async fetchSavedRecipes(userId: number) {
        this.isLoadingSavedRecipes = true;
        this.error = null;
        try {
            const data = await getUserRecipes(userId, 'saved');
            runInAction(() => {
                this.savedRecipes = data;
                this.isLoadingSavedRecipes = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to fetch saved recipes';
                this.isLoadingSavedRecipes = false;
            });
        }
    }
}

export const recipesStore = new RecipesStore();
