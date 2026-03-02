import { makeAutoObservable, runInAction } from 'mobx';
import { getRecipes, searchRecipes } from '../api/recipeApi';
import type { RecipeGetAllResponseDto, RecipeSearchResponseDto } from '../../../shared/api-types';

export class RecipesStore {
    trendingRecipes: RecipeGetAllResponseDto[] = [];
    recommendedRecipes: RecipeGetAllResponseDto[] = [];
    searchResults: RecipeSearchResponseDto[] = [];
    isLoadingTrending = false;
    isLoadingRecommended = false;
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
}

export const recipesStore = new RecipesStore();
