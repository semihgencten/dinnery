import { axiosClient } from "./axiosClient";
import type {
    RecipeGetAllResponseDto,
    RecipeSearchResponseDto,
    RecipeGetResponseDto,
    RecipeGetCommentsResponseDto,
    RecipeGetByUserResponseDto,
    RecipeCreateRequestDto,
    RecipeCreateResponseDto,
    IngredientSearchResponseDto,
    RecipeSearchByIngredientsResponseDto,
    RecipeSaveResponseDto,
    RecipeUnsaveResponseDto
} from "../../../shared/api-types";

export const getRecipes = async (offset: number, limit: number): Promise<RecipeGetAllResponseDto[]> => {
    const response = await axiosClient.get<RecipeGetAllResponseDto[]>('/recipes', {
        params: { offset, limit }
    });
    return response.data;
};

export const searchRecipes = async (name?: string, category?: string): Promise<RecipeSearchResponseDto[]> => {
    const response = await axiosClient.get<RecipeSearchResponseDto[]>('/recipes/search', {
        params: { name, category }
    });
    return response.data;
};

export const getRecipe = async (id: string): Promise<RecipeGetResponseDto> => {
    const response = await axiosClient.get<RecipeGetResponseDto>(`/recipes/${id}`);
    return response.data;
};

export const getComments = async (id: string): Promise<RecipeGetCommentsResponseDto[]> => {
    const response = await axiosClient.get<RecipeGetCommentsResponseDto[]>(`/recipes/${id}/comments`);
    return response.data;
};

export const getUserRecipes = async (userId: number, role?: string): Promise<RecipeGetByUserResponseDto[]> => {
    const response = await axiosClient.get<RecipeGetByUserResponseDto[]>(`/recipes/user/${userId}`, {
        params: { role }
    });
    return response.data;
};

export const createRecipe = async (payload: RecipeCreateRequestDto): Promise<RecipeCreateResponseDto> => {
    const response = await axiosClient.post<RecipeCreateResponseDto>('/recipes', payload);
    return response.data;
};

export const searchIngredients = async (term: string): Promise<IngredientSearchResponseDto[]> => {
    const response = await axiosClient.get<IngredientSearchResponseDto[]>('/ingredients/search', {
        params: { term }
    });
    return response.data;
};

export const searchRecipesByIngredients = async (ingredients: string[]): Promise<RecipeSearchByIngredientsResponseDto[]> => {
    const response = await axiosClient.post<RecipeSearchByIngredientsResponseDto[]>('/recipes/search/ingredients', ingredients);
    return response.data;
};

export const saveRecipe = async (id: number, collection?: string): Promise<RecipeSaveResponseDto> => {
    const response = await axiosClient.post<RecipeSaveResponseDto>(`/recipes/${id}/save`, { collection });
    return response.data;
};

export const unsaveRecipe = async (id: number, collection?: string): Promise<RecipeUnsaveResponseDto> => {
    const response = await axiosClient.delete<RecipeUnsaveResponseDto>(`/recipes/${id}/save`, {
        params: { collection }
    });
    return response.data;
};
