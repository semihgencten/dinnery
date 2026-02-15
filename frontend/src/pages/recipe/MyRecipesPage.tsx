import { observer } from 'mobx-react-lite';
import { useStore } from '../../context/store.context';
import { useEffect } from 'react';
import { RecipeCard } from '../../components/RecipeCard';
import styles from './MyRecipesPage.module.scss';

export const MyRecipesPage = observer(() => {
    const { recipesStore, authStore } = useStore();

    useEffect(() => {
        if (authStore.user) {
            recipesStore.fetchUserRecipes(authStore.user.id);
        }
    }, [authStore.user]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Recipes 👨‍🍳</h1>

            <div className={styles.grid}>
                {recipesStore.isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="skeleton-card" style={{ height: '340px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>
                        </div>
                    ))
                ) : recipesStore.recipes.length > 0 ? (
                    recipesStore.recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <h3>You haven't created any recipes yet</h3>
                        <p style={{ marginTop: '0.5rem' }}>
                            Start your culinary journey by creating a new recipe!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});

