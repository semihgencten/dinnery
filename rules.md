# Project Rules

## Styling
Always use SCSS modules. Never use Tailwind or inline styles.

## State Management
Use MobX for state management. Ensure strict typing.

## Components
Write functional components with React hooks. Focus on a mobile-first design.

## API & Axios
To keep API requests type-safe and consistent, ensure you follow this pattern:
1. All API calls made from the frontend MUST be abstracted into dedicated client files within the `frontend/src/api/` directory (e.g., `recipeApi.ts`, `userApi.ts`). Do not call `fetch` or `axiosClient` directly inside React components or stores.
2. New function structures should trace the existing pattern: strictly type the response interface, pass it as a generic to the axios method, and explicitly declare the return type of the function.
3. Always use the pre-configured `axiosClient` from `src/api/axiosClient.ts` for calls to our backend.
4. Define the expected return type using Generics in your `axiosClient` calls (e.g., `axiosClient.get<Recipe[]>('/recipes')`).
5. Explicitly declare the `Promise` return type of the API function (e.g., `Promise<Recipe[]>`).
6. Always extract and return `response.data`.

**Example:**
```typescript
// frontend/src/api/recipeApi.ts
import { axiosClient } from "./axiosClient";
import type { Recipe } from "../types/recipe";

export const getRecipes = async (offset: number, limit: number): Promise<Recipe[]> => {
    const response = await axiosClient.get<Recipe[]>('/recipes', {
        params: { offset, limit }
    });
    return response.data;
};
```

**Pages**
In App.tsx, use React Router for navigation. Use lazy loading for pages.


