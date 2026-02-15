import { observer } from 'mobx-react-lite';
import { useStore } from '../context/store.context';
import { type Recipe } from '../stores/recipes.store';
import { Clock, Heart, ChefHat, Bookmark, BookmarkCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './RecipeDiscoveryCard.scss';

interface RecipeDiscoveryCardProps {
    recipe: Recipe;
}

export const RecipeDiscoveryCard = observer(({ recipe }: RecipeDiscoveryCardProps) => {
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
            recipe.isSaved = false;
        } else {
            await recipesStore.saveRecipe(recipe.id);
            recipe.isSaved = true;
        }
    };

    return (
        <Link to={`/recipes/${recipe.id}`} className="recipe-discovery-card">
            <div className="discovery-card-image-container">
                {recipe.photoUrl ? (
                    <img src={recipe.photoUrl} alt={recipe.name} className="discovery-card-image" />
                ) : (
                    <div className="discovery-card-placeholder">
                        <ChefHat size={32} opacity={0.5} />
                    </div>
                )}

                <button
                    className={`discovery-save-button ${recipe.isSaved ? 'saved' : ''}`}
                    onClick={handleSave}
                    aria-label={recipe.isSaved ? "Unsave recipe" : "Save recipe"}
                >
                    {recipe.isSaved ? <BookmarkCheck size={16} fill="#E11D48" className="text-primary" /> : <Bookmark size={16} />}
                </button>

                <div className="discovery-card-overlay discovery-card-overlay-left">
                    <Heart size={14} className="discovery-heart-icon" />
                    <span>{recipe.likesCount}</span>
                </div>

                <div className="discovery-card-overlay discovery-card-overlay-right">
                    <Clock size={14} />
                    <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                </div>
            </div>

            <div className="discovery-card-content">
                <h3 className="discovery-card-title">{recipe.name}</h3>
                <p className="discovery-card-author">
                    {recipe.author?.username ? `@${recipe.author.username}` : 'Unknown'}
                </p>
            </div>
        </Link>
    );
});
