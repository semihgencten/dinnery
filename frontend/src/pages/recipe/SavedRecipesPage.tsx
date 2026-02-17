import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import { useEffect } from 'react';
import { RecipeCard } from '../../components/RecipeCard';
import styles from './SavedRecipesPage.module.scss';

export const SavedRecipesPage = observer(() => {
    const { recipesStore, authStore } = useStore();

    useEffect(() => {
        if (authStore.user) {
            recipesStore.fetchSavedRecipes(authStore.user.id);
        }
    }, [recipesStore.savedRecipes.length, authStore.user]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Saved Recipes 📖</h1>

            <div className={styles.grid}>
                {recipesStore.isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton-card" style={{ height: '340px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                        </div>
                    ))
                ) : recipesStore.savedRecipes.length > 0 ? (
                    recipesStore.savedRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <h3>You haven't saved any recipes yet</h3>
                        <p style={{ marginTop: '0.5rem' }}>
                            Explore recipes and save your favorites to find them here easily!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});
