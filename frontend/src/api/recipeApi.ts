import { axiosClient } from "./axiosClient";
import type { Recipe, Comment, CreateRecipePayload, Ingredient } from "../types/recipe";

export const getRecipes = async (offset: number, limit: number): Promise<Recipe[]> => {
    const response = await axiosClient.get<Recipe[]>('/recipes', {
        params: { offset, limit }
    });
    return response.data;
};

export const searchRecipes = async (name?: string, category?: string): Promise<Recipe[]> => {
    const response = await axiosClient.get<Recipe[]>('/recipes/search', {
        params: { name, category }
    });
    return response.data;
};

export const getRecipe = async (id: string): Promise<Recipe> => {
    const response = await axiosClient.get<Recipe>(`/recipes/${id}`);
    return response.data;
};

export const getComments = async (id: string): Promise<Comment[]> => {
    const response = await axiosClient.get<Comment[]>(`/recipes/${id}/comments`);
    return response.data;
};

export const getUserRecipes = async (userId: number, role?: string): Promise<Recipe[]> => {
    const response = await axiosClient.get<Recipe[]>(`/recipes/user/${userId}`, {
        params: { role }
    });
    return response.data;
};

export const createRecipe = async (payload: CreateRecipePayload): Promise<Recipe> => {
    const response = await axiosClient.post<Recipe>('/recipes', payload);
    return response.data;
};

export const searchIngredients = async (term: string): Promise<Ingredient[]> => {
    const response = await axiosClient.get<Ingredient[]>('/ingredients/search', {
        params: { term }
    });
    return response.data;
};

export const searchRecipesByIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
    const response = await axiosClient.post<Recipe[]>('/recipes/search/ingredients', ingredients);
    return response.data;
};

export const saveRecipe = async (id: number, collection?: string): Promise<Recipe> => {
    const response = await axiosClient.post<Recipe>(`/recipes/${id}/save`, { collection });
    return response.data;
};

export const unsaveRecipe = async (id: number, collection?: string): Promise<Recipe> => {
    const response = await axiosClient.delete<Recipe>(`/recipes/${id}/save`, {
        params: { collection }
    });
    return response.data;
};