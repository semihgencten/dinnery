import { observer } from 'mobx-react-lite';
import { useStore } from '../context/store.context';
import { type Recipe } from '../types/recipe';
import { Clock, Heart, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './RecipeCard.scss';

interface RecipeCardProps {
    recipe: Recipe;
}

export const RecipeCard = observer(({ recipe }: RecipeCardProps) => {
    const { recipesStore, authStore } = useStore();
    const navigate = useNavigate();

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!authStore.isAuthenticated) {
            navigate('/login');
            return;
        }

        if (recipe.isSaved) {
            await recipesStore.unsaveRecipe(recipe.id);
            // Optimistic update or refetch needed?
            // Since we modified isSaved in backend mapper, we need to update local state.
            // But recipesStore.recipes contains the recipe object.
            // We should update the recipe object in store.
            // But fetchSavedRecipes updates store.recipes. 
            // saveRecipe/unsaveRecipe is async.
            // We should manually toggle isSaved on the recipe object if possible.
            // Recipe interface is read-only? No.
            // But MobX action should modify it.
            // Let's add toggleSaved action to store or just update it here if allowed.
            // Better to re-fetch or have store handle it.
            // For now, let's assume store handles it or I force update.
            // Actually, best practice is store action updates the observable.
            // I'll update store to handle local state update.
            recipe.isSaved = false;
        } else {
            await recipesStore.saveRecipe(recipe.id);
            recipe.isSaved = true;
        }
    };

    return (
        <Link to={`/recipes/${recipe.id}`} className="recipe-card">
            <div className="card-image-container">
                {recipe.photoUrl ? (
                    <img src={recipe.photoUrl} alt={recipe.name} className="card-image" />
                ) : (
                    <div className="card-placeholder">
                        <ChefHat size={48} opacity={0.5} />
                    </div>
                )}
                <div className="category-pill">{recipe.category || 'General'}</div>
                <button
                    className={`save-button ${recipe.isSaved ? 'saved' : ''}`}
                    onClick={handleSave}
                    aria-label={recipe.isSaved ? "Unsave recipe" : "Save recipe"}
                >
                    {recipe.isSaved ? <BookmarkCheck size={20} fill="#E11D48" className="text-primary" /> : <Bookmark size={20} />}
                </button>
            </div>
            <div className="card-content">
                <h3 className="card-title">{recipe.name}</h3>

                <div className="card-meta">
                    <div className="meta-item">
                        <Clock size={16} />
                        <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                    </div>
                </div>

                <div className="card-footer">
                    <div className="social-stats">
                        <div className="stat">
                            <Heart size={16} className="heart-icon" />
                            <span>{recipe.likesCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
});
