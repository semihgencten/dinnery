import { AuthStore } from './auth.store';
import { RecipesStore } from './recipes.store';

export class RootStore {
    authStore: AuthStore;
    recipesStore: RecipesStore;

    constructor() {
        this.authStore = new AuthStore();
        this.recipesStore = new RecipesStore();
    }
}

export const rootStore = new RootStore();
